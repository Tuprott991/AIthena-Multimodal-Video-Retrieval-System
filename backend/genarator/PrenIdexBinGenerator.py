import numpy as np
import os
import re
import faiss

def create_pre_bin_file(list_video_path):
    pre_all_features = []

    #video path data/images/L01_V001
    #video_name_list = [re.split(r'[\\/]', video_path)[-2] for video_path in list_video_path] 

    for video_path in list_video_path:
        video_name = re.split(r'[\\/]', video_path)[-1]
        npy_path = f"data/CLIP-features/{video_name}.npy"
        features = np.load(npy_path)
        pre_all_features.append(features)

    # Chuyển tất cả các features thành một mảng numpy
    pre_all_features = np.vstack(pre_all_features)

    # Dùng FAISS để tạo chỉ mục từ các vector
    pre_d = pre_all_features.shape[1]  # Số chiều của vector
    pre_index = faiss.IndexFlatL2(pre_d)  # FAISS Index dùng khoảng cách L2
    pre_index.add(pre_all_features)  # Thêm các vector vào FAISS index

    # Lưu FAISS index ra file .bin
    faiss.write_index(pre_index, 'pre_faiss_normal_ViT.bin')

    #print("Hoàn thành việc tạo FAISS index.")
