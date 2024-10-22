import os
import requests
from urllib.parse import urlparse

def download_image(url: str, folder: str = 'data/imgInput') -> str:
    # Tạo thư mục nếu chưa tồn tại
    if not os.path.exists(folder):
        os.makedirs(folder)
    
    # Lấy tên file từ URL
    parsed_url = urlparse(url)
    file_name = os.path.basename(parsed_url.path)
    
    # Kiểm tra định dạng file có phải jpg hoặc png
    if not file_name.lower().endswith(('.jpg', '.jpeg', '.png')):
        raise ValueError("Chỉ hỗ trợ định dạng .jpg và .png")
    
    # Đường dẫn file để lưu ảnh
    file_path = os.path.join(folder, file_name)
    
    # Tải ảnh
    response = requests.get(url)
    if response.status_code == 200:
        with open(file_path, 'wb') as f:
            f.write(response.content)
        return file_path
    else:
        raise Exception(f"Không thể tải ảnh từ URL: {url}. Status code: {response.status_code}")
    
# url = 'https://lzd-img-global.slatic.net/g/p/bf524e10e41d9bc43207d56df4dc6910.jpg_320x320.jpg_550x550.jpg'

# print(download_image(url))
    