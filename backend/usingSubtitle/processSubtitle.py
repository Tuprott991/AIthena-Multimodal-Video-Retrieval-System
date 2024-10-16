import os
import json
import pandas as pd
from youtube_transcript_api import YouTubeTranscriptApi
import webbrowser

def get_transcript(video_id):
    try:
        transcript = YouTubeTranscriptApi.get_transcript(video_id, languages=['en', 'vi'])
        return transcript
    except Exception as e:
        print(f"Error: {e}")

def read_csv_file(file_path):
    data = pd.read_csv(file_path)
    return data

def get_img_path(data: pd.DataFrame, start: int, end: int) -> list:
    start *= 25
    end *= 25
    filtered_data = data[(data['frame_idx'] >= start) & (data['frame_idx'] <= end)]
    idxs = filtered_data['n'].tolist()
    return [str(idx).zfill(3)+'.jpg' for idx in idxs]

def split_video_content(data : pd.DataFrame, video_url : str):
    video_id = video_url.split('v=')[1].split('&')[0]
    transcript = get_transcript(video_id)
    if transcript:
        segments = []
        current_segment = []
        segment_duration = 10
        current_time = 0
        for entry in transcript:
            start = entry['start']
            text = entry['text']
            while current_time < start:
                if current_segment:
                    segments.append({
                        'start_time': current_time,
                        'end_time': current_time + segment_duration,
                        'text': ' '.join(current_segment),
                        'img_path': get_img_path(data, current_time, current_time + segment_duration)
                    })
                    current_segment = []
                current_time += segment_duration
            current_segment.append(text)
        if current_segment:
            segments.append({
                'start_time': current_time,
                'end_time': current_time + segment_duration,
                'text': ' '.join(current_segment),
                'img_path': get_img_path(data, current_time, current_time + segment_duration)
            })
    return segments

def write_to_json_file(data, filename):
    with open(filename, 'w', encoding='utf-8') as json_file:
        json.dump(data, json_file, ensure_ascii=False, indent=4)

def read_video_url_from_json(json_file):
    try:
        with open(json_file, 'r', encoding='utf-8') as file:
            data = json.load(file)
            if 'watch_url' in data:
                return data['watch_url']
            else:
                return None
    except (json.JSONDecodeError, FileNotFoundError, KeyError) as e:
        return str(e)
    
def main():
    metadata_folder = os.path.join('data','metadata')
    subtitle_folder = os.path.join('data','subtitle')
    keyframe_folder = os.path.join('data', 'map-keyframes')
    if not os.path.exists(subtitle_folder):
        os.makedirs(subtitle_folder)
    for json_file in os.listdir(metadata_folder):
        if json_file.endswith('.json'):
            json_path = os.path.join(metadata_folder, json_file)
            data = read_csv_file(os.path.join(keyframe_folder, json_file[:json_file.find('.')]+'.csv'))
            try:
                video_url = read_video_url_from_json(json_path)
                video_content = split_video_content(data, video_url)
                write_to_json_file(video_content, os.path.join(subtitle_folder,json_file))
            except Exception:
                write_to_json_file(video_url, os.path.join(subtitle_folder,json_file[:json_file.index('.')]+'_error.json'))

def main_2():
    subtitle_folder = os.path.join('data', 'subtitle')
    keyframe_folder = os.path.join('data', 'map-keyframes')
    error_files = [file for file in os.listdir(subtitle_folder) if file.endswith('error.json')]
    for file in error_files:
        with open(os.path.join(subtitle_folder,file), 'r', encoding='utf-8') as f:
            url = json.load(f)
            webbrowser.open(url)
            data = read_csv_file(os.path.join(keyframe_folder, file[:file.find('.')][:-6]+'.csv'))
            try:
                video_content = split_video_content(data, url)
                write_to_json_file(video_content, os.path.join(subtitle_folder,file))
            except Exception:
                write_to_json_file(url, os.path.join(subtitle_folder,file))
        break