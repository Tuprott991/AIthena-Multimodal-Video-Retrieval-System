import os
import re
import json
import time
import copy

def find_list_key_frame(pagefile, global_pagefile, keywords: str, k: int = 100) -> list:
    """
    Find frames from pagefile that match the provided keywords in the corresponding OCR JSON files.

    Parameters:
        - pagefile: List of dictionaries containing page information.
        - global_pagefile: List of dictionaries containing global page information.
        - keywords: Comma-separated string of keywords to search in the OCR JSON files.
        - k: Optional limit on the number of frames to return (default: 100).

    Returns:
        - A list of filtered pagefile dictionaries that match the criteria.
    """
    # Prepare image paths and folder names
    img_paths = [entry['imgpath'] for entry in pagefile]
    # print(img_paths)
    folder_names = {re.split(r'[/\\]', path)[-2] for path in img_paths}

    # Prepare keywords for case-insensitive search
    keywords = {keyword.lower().strip() for keyword in keywords.split(',')}
    # print(keywords)
    
    # Define the folders for OCR data and images
    image_folder = os.path.abspath("../frontend/public/images")
    ocr_folder = os.path.join('data', 'OCR')

    # Store frames matching the keywords
    matching_frames = set()

    # Process each folder (corresponding to OCR files)
    for folder in folder_names:
        json_path = os.path.join(ocr_folder, f'{folder}.json')
        
        if os.path.exists(json_path):
            try:
                with open(json_path, 'r', encoding='utf-8') as f:
                    ocr_data = json.load(f)

                # Find frames that contain any of the keywords in the OCR data
                for img_name, ocr_text in ocr_data.items():
                    # print(img_name, ocr_text)
                    if any(keyword in ocr_text.lower() for keyword in keywords):
                        frame_path = os.path.join(image_folder, folder, img_name)
                        matching_frames.add(frame_path)

            except json.JSONDecodeError:
                print(f"Warning: Cannot decode JSON in file {json_path}")
            except Exception as e:
                print(f"Error processing file {json_path}: {e}")
        else:
            # print(f"Warning: OCR JSON file {json_path} does not exist.")
            pass

    # print(matching_frames)
    # Filter global pagefile based on the frames found

    # print(matching_frames)

    filtered_pagefile = [
        copy.deepcopy(item) for item in global_pagefile if item['imgpath'] in matching_frames
    ]

    # with open('global_pagefile.json', 'w', encoding='utf-8') as json_file:
    #     json.dump(global_pagefile, json_file, ensure_ascii=False, indent=4)

    # Limit to 'k' results if necessary
    if k and len(filtered_pagefile) > k:
        return filtered_pagefile[:k]

    return filtered_pagefile