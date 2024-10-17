import numpy as np
import os
import faiss

data_directory = 'data'
npy_directory = os.path.join(data_directory, 'CLIP-features')
all_features = []
for file_name in sorted(os.listdir(npy_directory)):
    # print(file_name)
    if file_name.endswith('.npy'):
        file_path = os.path.join(npy_directory, file_name)
        features = np.load(file_path)
        all_features.append(features)

# Cái này xài để lấy theo từng video nè (Nếu)
# features = np.load(r"C:\Users\Vatuk\OneDrive - VNU-HCMUS\Desktoc\clip-features-32-b1\clip-features-32\L01_V020.npy")
# all_features.append(features)

all_features = np.vstack(all_features)
d = all_features.shape[1]
index = faiss.IndexFlatL2(d)
index.add(all_features)
faiss.write_index(index, 'faiss_normal_ViT.bin')