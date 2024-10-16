import os
import cv2
import numpy as np

def extract_custom_number_of_frames(video_path, output_folder, frame_size=(1280, 720), num_frames=10):
    output_folder = os.path.abspath(output_folder)
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        print(f"Không thể mở video: {video_path}")
        return
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    fps = cap.get(cv2.CAP_PROP_FPS)
    if total_frames < num_frames:
        print(f"Số frame trong video ({total_frames}) ít hơn số lượng frame yêu cầu ({num_frames})")
        return
    frame_interval = max(1, total_frames // (num_frames - 1))
    frames_to_cut = [int(np.floor(i * frame_interval)) for i in range(num_frames)]
    frames_to_cut[-1] = total_frames - 1
    saved_count = 0
    for frame_num in frames_to_cut:
        cap.set(cv2.CAP_PROP_POS_FRAMES, frame_num)
        ret, frame = cap.read()
        if not ret:
            print(f"Không thể đọc frame {frame_num}")
            break
        resized_frame = cv2.resize(frame, frame_size)
        frame_filename = os.path.join(output_folder, f'{saved_count+1:03d}.jpg')
        cv2.imwrite(frame_filename, resized_frame)
        saved_count += 1
    cap.release()
    print(f'Đã tách {saved_count} frame từ video {video_path}')

def process_all_videos_in_folder(folder_path, output_base_folder, num_frames=10, frame_size=(1280, 720)):
    if os.path.isdir(folder_path):
        for filename in os.listdir(folder_path):
            if filename.endswith(".mp4"):
                video_path = os.path.join(folder_path, filename)
                video_name = os.path.splitext(filename)[0]
                video_output_folder = os.path.join(output_base_folder, video_name)
                if not os.path.exists(video_output_folder):
                    os.makedirs(video_output_folder)
                print(f'Đang xử lý video: {filename}')
                try:
                    extract_custom_number_of_frames(video_path, video_output_folder, frame_size, num_frames)
                except Exception as e:
                    print(f"Đã xảy ra lỗi khi xử lý video {filename}: {e}")

if __name__ == "__main__":
    dataset_path = os.path.abspath("data/videos")
    output_base_folder = os.path.abspath("data/images")
    num_frames_to_extract = 666
    process_all_videos_in_folder(dataset_path, output_base_folder, num_frames=num_frames_to_extract)