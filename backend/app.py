import cv2, os, webbrowser, mapping as mp, pyperclip, copy, re
from flask import Flask, render_template, Response, request, jsonify, send_file
from usingOCR import TakeFrameWithKeyWords as ocr
from usingSubtitle import GetFrameASR as sub
from filterobj import filterobj as fob
from utils.query_processing import Translation
from utils.faiss import Myfaiss
from genarator import PrenIdexBinGenerator as pre
from flask_cors import CORS
import openai_func as opai
from dotenv import load_dotenv
import requests
import downloadimg as dlimg
load_dotenv()
os.environ['CUDA_VISIBLE_DEVICES'] = '-1'

# app = Flask(__name__, template_folder='templates')
app = Flask(__name__)
CORS(app)
DictImagePath = {}
i = 0


start_path = os.path.abspath("../frontend/public")
main_path = os.path.abspath("../frontend/public/images")

SESSION_ID = os.getenv('SESSION_ID')

def numerical_sort(value):
    # Tìm và chuyển các con số trong tên file thành số nguyên để sắp xếp đúng thứ tự
    parts = re.findall(r'\d+', value)
    return int(parts[0]) if parts else 0

for folder in sorted(os.listdir(main_path)):
    folder_path = os.path.join(main_path, folder)
    if os.path.isdir(folder_path):
        for keyframe in sorted(os.listdir(folder_path), key=numerical_sort):
            keyframe_path = os.path.join(folder_path, keyframe)
            if keyframe_path.lower().endswith(('.jpg')):
                DictImagePath[i] = keyframe_path
                i += 1

DictPreImgPath = {}
global_pagefile = [{'imgpath': path, 'id': id} for id, path in DictImagePath.items()]

pre_bin_file = 'pre_faiss_normal_ViT.bin'
LenDictPath = len(DictImagePath)
bin_file='faiss_normal_ViT.bin' 
MyFaiss = Myfaiss(bin_file, DictImagePath, 'cpu', Translation(), "ViT-B/32")  # Đổi lại ViT-B/32 nếu dùng data cũ

preQueryPageFile = []

@app.route('/home')
@app.route('/')
def thumbnailimg():
    print("load_iddoc")
    pagefile = []
    index = request.args.get('index', default=0, type=int)
    imgperindex = 100
    page_filelist = []
    list_idx = []
    if LenDictPath - 1 > index + imgperindex:
        first_index = index * imgperindex
        last_index = index * imgperindex + imgperindex
        tmp_index = first_index
        while tmp_index < last_index:
            page_filelist.append(DictImagePath[tmp_index])
            list_idx.append(tmp_index)
            tmp_index += 1
    else:
        first_index = index * imgperindex
        last_index = LenDictPath
        tmp_index = first_index
        while tmp_index < last_index:
            page_filelist.append(DictImagePath[tmp_index])
            list_idx.append(tmp_index)
            tmp_index += 1
    for imgpath, id in zip(page_filelist, list_idx):
        pagefile.append({'imgpath': os.path.relpath(imgpath, start_path), 'id': id})
    data = {'num_page': int(LenDictPath / imgperindex) + 1, 'pagefile': pagefile}
    # for item in pagefile:
    #     obj = mp.mapping(item['imgpath'])
    #     time_ = int(obj.getTime() * 1000)
    #     item['milisecond'] = time_
    # return render_template('home.html', data=data)
    return jsonify(data)


@app.route('/getneighbor')
def get_neighbor():
    print("get neighbor")
    id_query = int(request.args.get('imgid'))
    pagefile = []
    imgperindex = 100
    start_id = max(0, id_query - 10)
    end_id = min(LenDictPath - 1, id_query + 10)
    for img_id in range(start_id, end_id + 1):
        imgpath = DictImagePath[img_id]
        pagefile.append({'imgpath': imgpath, 'id': img_id})
    data = {'num_page': int(LenDictPath / imgperindex) + 1, 'pagefile': pagefile}
    for item in data['pagefile']:
    # Extract the relevant part of the path for React's public folder access
        if (item['imgpath']):
            item['imgpath'] = os.path.relpath(item['imgpath'], start_path)

    # for item in pagefile:
    #     obj = mp.mapping(item['imgpath'])
    #     time_ = int(obj.getTime() * 1000)
    #     item['milisecond'] = time_
    return jsonify(data)
    
    # return render_template('home.html', data=data)

@app.route('/imgsearch')
def image_search():
    print("image search")
    pagefile = []
    id_query = int(request.args.get('imgid'))
    _, list_ids, _, list_image_paths = MyFaiss.image__search(id_query, k=50)
    imgperindex = 100
    for imgpath, id in zip(list_image_paths, list_ids):
        pagefile.append({'imgpath': imgpath, 'id': int(id)})
    data = {'num_page': int(LenDictPath/imgperindex)+1, 'pagefile': pagefile}
    for item in data['pagefile']:
    # Extract the relevant part of the path for React's public folder access
        if (item['imgpath']):
            item['imgpath'] = os.path.relpath(item['imgpath'], start_path)

    # for item in pagefile:
    #     obj = mp.mapping(item['imgpath'])
    #     time_ = int(obj.getTime() * 1000)
    #     item['milisecond'] = time_
    # return render_template('home.html', data=data)
    return jsonify(data)

def get_DictPreImgPath(pagefile):
    list_video_path = ['/'.join(re.split(r'[\\/]', entry['imgpath'])[:-1]) for entry in pagefile]
    list_video_path = list(dict.fromkeys(list_video_path))
    j = 0
    Dict = {}
    for video_path in list_video_path:
        for keyframe in os.listdir(video_path):
            keyframe_path = os.path.join(video_path, keyframe)
            if keyframe_path.lower().endswith(('.jpg')):
                Dict[j] = keyframe_path
                j += 1
    return Dict, list_video_path

@app.route('/textsearch')
def text_search():  
    global preQueryPageFile
    global DictPreImgPath
    global start_path
    text_query = request.args.get('text_query')
    faiss_checked = request.args.get('faiss', 'false').lower() == 'true'
    ocr_checked = request.args.get('ocr', 'false').lower() == 'true'
    subtitle_checked = request.args.get('subtitle', 'false').lower() == 'true'
    keywords = request.args.get('keywords')
    cq_checked = request.args.get('cq', 'false').lower() == 'true'
    num_images = int(request.args.get('num_images', 0)) if request.args.get('num_images') else None
    
    if not faiss_checked and not ocr_checked and not subtitle_checked:
        faiss_checked = True
    pagefile = []
    if faiss_checked:
        if cq_checked:
             _, list_ids, _, list_image_paths = MyFaiss.text_search(text_query,100, DictPreImgPath, pre_bin_file)
        else: 
            _, list_ids, _, list_image_paths = MyFaiss.text_search(text_query, k=num_images or 100)
        for imgpath, id in zip(list_image_paths, list_ids):
            pagefile.append({'imgpath': imgpath, 'id': int(id)})
        if ocr_checked:
            pagefile = ocr.find_list_key_frame(pagefile, global_pagefile, keywords)
        if subtitle_checked:
            pagefile = sub.get_frame_ASR(pagefile, global_pagefile, keywords)
    elif ocr_checked:
        pagefile = ocr.find_list_key_frame(preQueryPageFile if cq_checked else global_pagefile, global_pagefile, text_query)
    elif subtitle_checked:
        pagefile = sub.get_frame_ASR(preQueryPageFile if cq_checked else global_pagefile, global_pagefile, text_query)
    
    preQueryPageFile = copy.deepcopy(pagefile)
    DictPreImgPath, list_video_path = get_DictPreImgPath(pagefile)

    if len(pagefile) != 0:
        pre.create_pre_bin_file(list_video_path)

    # for item in pagefile:
    #     obj = mp.mapping(item['imgpath'])
    #     time_ = int(obj.getTime() * 1000)
    #     item['milisecond'] = time_

    data = {'num_page': int(LenDictPath/num_images)+1, 'pagefile': pagefile}   
    for item in data['pagefile']:
    # Extract the relevant part of the path for React's public folder access
        if (item['imgpath']):
            item['imgpath'] = os.path.relpath(item['imgpath'], start_path)
            
    # return render_template('home.html', data=data)
    return jsonify(data)

# SERVE FILE URL
@app.route('/serve-image/<path:filename>')
def serve_image(filename):
    # Serve the image file
    image_path = os.path.join(os.getcwd(),'data','images', filename)
    return send_file(image_path)


@app.route('/get_img')
def get_img():
    fpath = request.args.get('fpath')
    list_image_name = fpath.split("/")
    image_name = "/".join(list_image_name[-2:])

    if os.path.exists(fpath):
        img = cv2.imread(fpath)
    else:
        print("load 404.jpg")
        img = cv2.imread("./static/images/404.jpg")

    height, width, _ = img.shape
    if width > height:
        img = cv2.resize(img, (1280, 720))
    else:
        img = cv2.resize(img, (720, 1280))
    img = cv2.putText(img, image_name, (30, 80), cv2.FONT_HERSHEY_SIMPLEX, 3, (255, 0, 0), 4, cv2.LINE_AA)
    ret, jpeg = cv2.imencode('.jpg', img)

    return Response((b'--frame\r\n'
                     b'Content-Type: image/jpeg\r\n\r\n' + jpeg.tobytes() + b'\r\n\r\n'), 
                     mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/submit_item')
def submit_item():
    # data = request.get_json()  
    # img_path = data.get('imgpath') 
    img_path = request.args.get('path')
    # img_path = img_path.split('/')[4:]
    # img_path = os.path.join(os.getcwd(),'data','images', img_path[0], img_path[1])
    # img_path = img_path.replace("\\", "/")
    img_path = os.path.join(start_path, img_path)
    print("final", img_path)
    obj = mp.mapping(img_path)
    yt_url = obj.generateURL()
    embed_url = yt_url.replace("youtube.com/watch?v=", "youtube.com/embed/")
    embed_url = embed_url.replace("&t=", "?amp;start=")
    # webbrowser.open(yt_url) 
    return jsonify(embed_url)


@app.route('/get_Answer')
def get_Answer():
    img_path = request.args.get('path')
    # img_path = img_path.split('\\')[-2:]
    # img_path = os.path.join(os.getcwd(),'data','images', img_path[0], img_path[1])
    # img_path = img_path.replace("\\", "/")
    obj = mp.mapping(img_path)
    time_ = int(obj.getTime() * 1000)
    # answer = img_path.split('/')[-2] + ", " + str(frame_idx) 
    answer = obj.folder + ", " + str(time_) 
    pyperclip.copy(answer)
    return jsonify(answer)

@app.route('/filter', methods=['POST'])
def obj_filter():
    selected_items = request.form.get('selected_items')
    selected_items_list = [item.strip() for item in selected_items.split(',')]
    pagefile = fob.get_objectFilter(preQueryPageFile, selected_items_list)
    imgperindex = 100
    data = {'num_page': int(LenDictPath/imgperindex)+1, 'pagefile': pagefile}   
    return render_template('home.html', data=data)

@app.route('/openai_prompt')
def openai_prompt():
    prompt = request.args.get('prompt')
    output = opai.standard_prompt(prompt)
    return jsonify(output)

@app.route('/qa')
def qa():
    img_path = request.args.get('imgpath')
    ques = request.args.get('question')
    img_path = os.path.normpath(os.path.join(main_path, img_path))
    output = opai.qa(img_path, ques)
    return jsonify(output)

@app.route("/getsessionId")
def session_id():
    return jsonify(SESSION_ID)

@app.route("/getevaluationId")
def evaluation_id():
    evaluation_url = "https://eventretrieval.one/api/v2/client/evaluation/list"
    params = {"session": SESSION_ID}
    
    try:
        response = requests.get(evaluation_url, params=params)
        response.raise_for_status()  # Raise an error for bad responses (4xx or 5xx)

        data = response.json()

        return jsonify(data), response.status_code
    except requests.exceptions.RequestException as e:
        print(f"Error fetching evaluation ID: {e}")
        return jsonify({"error": "Failed to fetch evaluation ID"}), 500


# @app.route("/sketchquery")
# def sketchquery():
#     pagefile = []
#     imgurl = request.args.get('imgurl')
#     img_path = dlimg.download_image(imgurl)

#     _, list_ids, _, list_image_paths = MyFaiss.image__search(5,img_path , k=50)
#     imgperindex = 50
#     for imgpath, id in zip(list_image_paths, list_ids):
#         pagefile.append({'imgpath': imgpath, 'id': int(id)})
#     data = {'num_page': int(LenDictPath/imgperindex)+1, 'pagefile': pagefile}
#     for item in data['pagefile']:
#         if (item['imgpath']):
#             item['imgpath'] = os.path.relpath(item['imgpath'], start_path)
#     return jsonify(data)


@app.route("/sketchquery", methods=['POST'])
def sketchquery():
    pagefile = []
    
    # Assuming the incoming data is in JSON format and contains 'imgurl'
    data = request.json
    
    if not data or 'imgurl' not in data:
        return jsonify({"error": "imgurl is required"}), 400
    
    imgurl = data['imgurl']
    
    # Assuming dlimg.download_image is a method to download the image from the provided URL
    img_path = dlimg.download_image(imgurl)

    print(img_path)
    # Calling the MyFaiss.image__search function with the image path
    _, list_ids, _, list_image_paths = MyFaiss.image__search(5, img_path, k=50)
    imgperindex = 50
    
    # Populating the pagefile list with the image paths and ids
    for imgpath, id in zip(list_image_paths, list_ids):
        pagefile.append({'imgpath': imgpath, 'id': int(id)})
    

    # Preparing the response data
    data = {
        'num_page': int(LenDictPath/imgperindex) + 1,
        'pagefile': pagefile
    }
    
    # Adjusting paths to be relative
    for item in data['pagefile']:
        if item['imgpath']:
            item['imgpath'] = os.path.relpath(item['imgpath'], start_path)
    
    # Returning the data as a JSON response
    return jsonify(data)



@app.route("/genimg")
def gen_img():
    prompt = request.args.get('prompt')
    output = opai.gen_img(prompt)
    return jsonify(output)

if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port=5001)