import os, cv2, json, re, pytesseract, numpy as np
from unidecode import unidecode

def clean_text(text: str) -> str:
    text = unidecode(text)
    text = re.sub(r'[^a-zA-Z0-9\s]', '', text)
    text = re.sub(r'\s+', ' ', text)
    text = text.lower().strip()
    return text

def addWhiteBlock(img_path: str) -> np.ndarray:
    image = cv2.imread(img_path)
    if image is None:
        print(f"Could not load image: {img_path}")
        return None
    output_image = image
    output_image[646:690, 0:1280] = (255, 255, 255)
    output_image[50:112, 1047:1195] = (255, 255, 255)
    return output_image

if __name__ == '__main__':
    pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

    data_folder = 'data'
    root_folder = os.path.join(data_folder, 'images')
    output_folder = os.path.join(data_folder, 'OCR')

    if not os.path.exists(output_folder):
        os.makedirs(output_folder)

    for subdir, dirs, files in os.walk(root_folder):
        if files:
            data = {}
            folder_name = os.path.basename(subdir)
            for file in files:
                if file.lower().endswith(('.jpg', '.jpeg', '.png')):
                    image_path = os.path.join(subdir, file)
                    img = addWhiteBlock(image_path)
                    if img is None:
                        print(f"Could not load image: {image_path}")
                        continue
                    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
                    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
                    enhanced_image = clahe.apply(gray)
                    kernel = np.array([[0, -1, 0], [-1, 5, -1], [0, -1, 0]])
                    sharpened = cv2.filter2D(enhanced_image, -1, kernel)
                    try:
                        text = pytesseract.image_to_string(sharpened, lang='eng')
                    except Exception as e:
                        print(f"Error processing image {image_path}: {e}")
                        continue
                    cleaned_text = clean_text(text)
                    if cleaned_text:
                        image_key = os.path.basename(image_path)
                        data[image_key] = cleaned_text
            if data:
                json_filename = os.path.join(output_folder, f'{folder_name}.json')
                with open(json_filename, 'w', encoding='utf-8') as json_file:
                    json.dump(data, json_file, ensure_ascii=False, indent=4)
                print(f"Hoàn tất xử lý hình ảnh và lưu file JSON tại {json_filename}.")