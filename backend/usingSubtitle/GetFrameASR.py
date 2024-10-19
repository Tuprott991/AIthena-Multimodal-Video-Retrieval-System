import json, os, re

data_directory = 'data'
subtitle_directory = os.path.join(data_directory, 'subtitle')

def get_frame_ASR(pagefile,global_pagefile, keywords: str):
    img_paths = [entry['imgpath'] for entry in pagefile]
    subtitle_paths = [re.split(r'[\\/]', path)[-2] + ".json" for path in img_paths]
    subtitle_paths = list(set(subtitle_paths))
    keywords = keywords.split(',')
    keywords = [k.lower().strip() for k in keywords]
    list_frames = []
    for path in subtitle_paths:
        path = os.path.join('data','subtitle', path)
        if not os.path.exists(path):
            continue
        try:
            with open(path, 'r', encoding='utf-8') as f:
                subtitle_data = json.load(f)
        except json.JSONDecodeError:
            print(f"Lỗi khi đọc file JSON: {path}")
            continue
        for entry in subtitle_data:
            text = entry['text'].lower()
            if any(keyword in text for keyword in keywords):
                for img_name in entry['img_path']:
                    video_name = re.split(r'[\\/]' ,(path.split('.')[0]))[-1]
                    list_frames.append(os.path.abspath(f'../frontend/public/images/{video_name}/{img_name}'))
                    print(video_name)

    filtered_pagefile = [
        item for item in global_pagefile if item['imgpath'] in list_frames
    ]

    return filtered_pagefile
