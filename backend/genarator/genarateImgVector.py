import os
import clip
import torch
from PIL import Image
import numpy as np
from sklearn.preprocessing import normalize

device = "cuda" if torch.cuda.is_available() else "cpu"
model, preprocess = clip.load("ViT-B/32", device=device)
data_folder = 'data'
root_folder = os.path.join(data_folder, 'images')
output_folder = os.path.join(data_folder, 'CLIP-features')
os.makedirs(output_folder, exist_ok=True)
sub_folders = [f for f in os.listdir(root_folder) if os.path.isdir(os.path.join(root_folder, f))]
def process_folder(folder_path, output_file_path):
    image_files = [f for f in os.listdir(folder_path) if f.endswith('.jpg')]
    features_list = []
    for image_file in image_files:
        image_path = os.path.join(folder_path, image_file)
        image = Image.open(image_path)
        image_input = preprocess(image).unsqueeze(0).to(device)
        with torch.no_grad():
            image_features = model.encode_image(image_input)
        image_features_np = image_features.cpu().numpy()
        features_list.append(image_features_np)
    if features_list:
        features_array = np.concatenate(features_list, axis=0)
        features_array_normalized = normalize(features_array, norm='l2').astype(np.float16)
        np.save(output_file_path, features_array_normalized)
        print(f"Đã lưu file '{output_file_path}' với shape: {features_array_normalized.shape}")
    else:
        print(f"Không có ảnh .jpg trong folder: {folder_path}")

for sub_folder in sub_folders:
    folder_path = os.path.join(root_folder, sub_folder)
    output_file_path = os.path.join(output_folder, f"{sub_folder}.npy")
    process_folder(folder_path, output_file_path)

print(f"Tất cả các file .npy đã được lưu trong folder: {output_folder}")