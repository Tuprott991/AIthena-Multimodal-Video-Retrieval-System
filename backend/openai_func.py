import base64
import requests
import openai
import os
from dotenv import load_dotenv
from PIL import Image
from io import BytesIO
load_dotenv()

# OpenAI API Key
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
def clarification(prompt):
    openai.api_key = OPENAI_API_KEY

    response = openai.ChatCompletion.create(
        model="chatgpt-4o-latest",  # Use appropriate model name
        messages=[
            {"role": "system", "content": "You are a professional query refiner."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.7,
        max_tokens=150
    )
    return(response.choices[0].message["content"])




def standard_prompt(prompt):
    openai.api_key = OPENAI_API_KEY

    response = openai.ChatCompletion.create(
        model="chatgpt-4o-latest",  # Use appropriate model name
        messages=[
            {"role": "user", "content": prompt}
        ],
        temperature=0.7,
        max_tokens=150
    )
    return(response.choices[0].message["content"])


def qa(image_path, ques):
# Function to encode the image
    openai.api_key = OPENAI_API_KEY
    def encode_image(image_path):
      with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode('utf-8')

    # Getting the base64 string
    base64_image = encode_image(image_path)
    response = openai.ChatCompletion.create(
        model="chatgpt-4o-latest",
        messages=[
          {"role": "system", "content": "You are an expert in Image recognition and an Q&A assistant."},
          {
            "role": "user",
            "content": [
              {
                "type": "text",
                "text": f"{ques} in this picture?"
              },
              {
                "type": "image_url",
                "image_url": {
                  "url": f"data:image/jpeg;base64,{base64_image}"
                }
              }
            ]
          },
        ],
        max_tokens=300
    )
    # headers = {
    #   "Content-Type": "application/json",
    #   "Authorization": f"Bearer {openai.api_key}"
    # }
    # response = requests.post("https://api.openai.com/v1/chat/completions", headers=headers, json=payload)
    # print("response", response)
    return response.choices[0].message["content"]
    # return(response.choices[0].message["content"])


def gen_img(i_prompt):
  openai.api_key = OPENAI_API_KEY  # Đặt API key

  response = openai.Image.create(
      model="dall-e-3",
      prompt=i_prompt,
      n=1,
      size="1792x1024"
  )
  # return response
  return response['data'][0]
  # Tải hình ảnh từ URL và hiển thị
  # image_response = requests.get(image_url)
  # image = Image.open(BytesIO(image_response.content))
  # image.show()  # Hiển thị hình ảnh

# def main():
#   standard_prompt(input("Nhập prompt đi thằng ngu:"))
# #
# #   # image_path = "227.jpg"
# #   #qa(image_path,api_key,"What's license plate number")
# #   #gen_img(api_key,"Với ngữ cảnh là tôi đang thi cuộc thi VBS và cần tạo ảnh để thực hiện chức năng simularity search để giải quyết video-kis, ảnh rất thực tế không mang tính thẩm mỹ. Hãy tạo ảnh 2 cánh tay người đang móc đồ trang trí là quả bóng vào cây thông noel, với cây thông noel nằm bên trái khung hình và 2 cánh tay chìa ra từ bên phải khung hình")
# #   gen_img(api_key,"Create three distinct medals inspired by the 2024 Paris Olympic and Paralympic Games, each with unique designs. The first medal on the left is silver, featuring geometric diamond patterns with a centered Paralympic symbol, giving a modern and reflective appearance. The second medal in the center is gold, shaped with radiating triangular ridges and a hexagon in the middle bearing the Olympic flame and 'Paris 2024' text. The third medal on the right is bronze, with an artistic depiction of a winged figure inspired by Greek mythology, alongside the Olympic rings and architectural elements. Each medal should have a ribbon attached with subtle Olympic patterns, using blue for the Olympic ones and red for the Paralympic one.")

# if __name__ == "__main__":
#     main()


