from underthesea import word_tokenize
from collections import Counter
import os, json

data_directory = 'data'
subtitle_directory = os.path.join(data_directory, 'subtitle')
metadata_directory = os.path.join(data_directory, 'metadata')

def calculate_similarity(text, query):
    text_tokens, query_tokens = word_tokenize(text), word_tokenize(query)
    total_words = len(query_tokens)
    if total_words == 0:
        return 0
    text_counter, query_counter = Counter(text_tokens), Counter(query_tokens)
    common_words = set(text_counter) & set(query_counter)
    common_count = sum(min(text_counter[word], query_counter[word]) for word in common_words)
    similarity_percentage = (common_count / total_words) 
    return similarity_percentage

def get_video_list(pagefile, keyword):
    img_path = [entry['imgpath'] for entry in pagefile]
    video_paths = [os.path.join(subtitle_directory, f"{os.path.basename(os.path.dirname(path))}.json") for path in img_path]
    video_list = []
    for json_path in video_paths:
        with open(json_path, 'r', encoding='utf-8') as file:
            json_data = json.load(file)
        json_data = ' '.join(json_data)
        score = calculate_similarity(json_data, keyword)
        video_name = os.path.split(json_path)[-1][:-5]
        metadata_path = metadata_directory + video_name + ".json"
        with open(metadata_path, 'r', encoding='utf-8') as file:
            metadata = json.load(file)
        url = metadata['watch_url']
        video_list.append((video_name, url, score))
    return sorted(video_list, reverse=True, key=lambda x: x[-1])