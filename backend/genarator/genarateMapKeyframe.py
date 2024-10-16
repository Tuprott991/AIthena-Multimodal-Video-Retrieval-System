import os
import json
import csv
import numpy as np

def generateMapKeyframes(metadata_folder, output_folder, num_frames, fps=25.0):
    """
    Đọc các file JSON từ folder metadata và tạo các file CSV tương ứng trong folder output.
    Tham số:
        - param metadata_folder: Thư mục chứa các file JSON
        - param output_folder: Thư mục để lưu các file CSV
        - param num_frames: Số lượng frames cần cắt
        - param fps: Số frames per second (fps), mặc định là 25.0
    """
    os.makedirs(output_folder, exist_ok=True)
    for json_file in os.listdir(metadata_folder):
        if json_file.endswith(".json"):
            json_path = os.path.join(metadata_folder, json_file)
            with open(json_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
                if 'length' in data:
                    total_time = data['length']
                    total_frames = int(total_time * fps)
                    frames_to_cut = [int(np.floor(i * (total_frames - 1) / (num_frames - 1))) for i in range(num_frames)]
                    frames_to_cut[-1] = total_frames - 1
                else:
                    print(f"Trường 'length' không có trong file: {json_file}")
                    continue
            csv_file = os.path.splitext(json_file)[0] + ".csv"
            csv_path = os.path.join(output_folder, csv_file)
            with open(csv_path, mode='w', newline='', encoding='utf-8') as csv_file:
                fieldnames = ['n', 'pts_time', 'fps', 'frame_idx']
                writer = csv.DictWriter(csv_file, fieldnames=fieldnames)
                writer.writeheader()
                for i, frame_num in enumerate(frames_to_cut):
                    n = i + 1
                    pts_time = frame_num / fps
                    frame_idx = frame_num
                    writer.writerow({'n': n, 'pts_time': f"{pts_time:.1f}", 'fps': fps, 'frame_idx': frame_idx})
            print(f"Đã tạo file CSV: {csv_path}")
metadata_folder = os.path.abspath("data/metadata")
output_folder = os.path.abspath("data/map-keyframes")
num_frames = 666
generateMapKeyframes(metadata_folder, output_folder, num_frames)