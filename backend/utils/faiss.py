from PIL import Image
import faiss
import matplotlib.pyplot as plt
import math
import numpy as np 
import clip
import torch
from langdetect import detect
# from genarator import genarateIndexBinFile 

class Myfaiss:
    def __init__(self, bin_file : str,id2img_fps, device, translater, clip_backbone="ViT-L/14"):
        self.index= self.load_bin_file(bin_file)
        self.id2img_fps= id2img_fps
        self.device= device
        self.model, self.preprocess = clip.load(clip_backbone, device=device)
        self.translater = translater

    def load_bin_file(self, bin_file: str):
        return faiss.read_index(bin_file)
    
    def show_images(self, image_paths):
        fig = plt.figure(figsize=(15, 10))
        columns = int(math.sqrt(len(image_paths)))
        rows = int(np.ceil(len(image_paths)/columns))

        for i in range(1, columns*rows +1):
          img = plt.imread(image_paths[i - 1])
          ax = fig.add_subplot(rows, columns, i)
          ax.set_title('/'.join(image_paths[i - 1].split('/')[-3:]))

          plt.imshow(img)
          plt.axis("off")

        plt.show()
        
    def image__search(self, id_query, img_path =None, k =100): 
        if img_path:
            image = Image.open(img_path) # img_path là đường dẫn chính xác
            image_input = self.preprocess(image).unsqueeze(0).to(self.device)
            with torch.no_grad():
                query_feats = self.model.encode_image(image_input).cpu().detach().numpy().astype(np.float16)
        else:
            query_feats = self.index.reconstruct(id_query).reshape(1,-1)

        scores, idx_image = self.index.search(query_feats, k=k)
        idx_image = idx_image.flatten()


        infos_query = list(map(self.id2img_fps.get, list(idx_image)))
        image_paths = [info for info in infos_query]

        
        return scores, idx_image, infos_query, image_paths
    
    def text_search(self, text, k, DictPreImgPath = None, pre_bin_file:str = None  ): # thêm 1 parameter là bool CQ
        if detect(text) == 'vi':
            text = self.translater(text)

        ###### TEXT FEATURES EXACTING ######

        # Embed text để so sánh với image embedded
        text = clip.tokenize([text]).to(self.device)   #Copy cái này oke nè
        text_features = self.model.encode_text(text).cpu().detach().numpy().astype(np.float32) # ép kiểu không ảnh hưởng 

        ###### SEARCHING #####
        #Nếu như có preQuery thì trích xuất img_path -> npy_path 
        #Dùng các file npy đó để tạo file .bin 
        #load lại file .bin đó thành  preIndex rồi chạy search 

        if pre_bin_file:
            preIndex = self.load_bin_file(pre_bin_file)
            scores, idx_image = preIndex.search(text_features,k = k)
        else:
            scores, idx_image = self.index.search(text_features, k=k) # search với những index đã có trong file bin

        idx_image = idx_image.flatten()

        ###### GET INFOS KEYFRAMES_ID ######

        infos_query = list(map(self.id2img_fps.get if not pre_bin_file else DictPreImgPath.get , list(idx_image)))

        # anhxa = list(m)
        image_paths = [info for info in infos_query]

        return scores, idx_image, infos_query, image_paths
        

        #index 0, Dict  i = 0