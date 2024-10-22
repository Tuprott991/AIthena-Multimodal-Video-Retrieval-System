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
    print(url)
    # url = 'https://oaidalleapiprodscus.blob.core.windows.net/private/org-Stu2EOJxHRNc9l7HJqzHlAQK/user-5DNLB81AX8JN8rEOnwBHnPfl/img-3k624C2AAmkrxKD5hw4DG5eu.png?st=2024-10-22T09%3A43%3A52Z&se=2024-10-22T11%3A43%3A52Z&sp=r&sv=2024-08-04&sr=b&rscd=inline&rsct=image/png&skoid=d505667d-d6c1-4a0a-bac7-5c84a87759f8&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2024-10-21T18%3A50%3A47Z&ske=2024-10-22T18%3A50%3A47Z&sks=b&skv=2024-08-04&sig=2zNYV0d8ZgKlaLsr0jG/jmOwhaMq0Oy6emQrUVnuhUY%3D'

    response = requests.get(url)
    if response.status_code == 200:
        with open(file_path, 'wb') as f:
            f.write(response.content)
        return file_path
    else:
        raise Exception(f"Không thể tải ảnh từ URL: {url}. Status code: {response.status_code}")
    
# url = 'https://lzd-img-global.slatic.net/g/p/bf524e10e41d9bc43207d56df4dc6910.jpg_320x320.jpg_550x550.jpg'

# print(download_image(url))
    