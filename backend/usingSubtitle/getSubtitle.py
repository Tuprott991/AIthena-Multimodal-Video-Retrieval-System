import json, os, re
from youtube_transcript_api import YouTubeTranscriptApi

def get_subtitle(video_id, languages=['vi']):
    try:
        transcript = YouTubeTranscriptApi.get_transcript(video_id, languages=languages)
        return transcript
    except Exception as e:
        return str(e)

def extract_video_id(youtube_url):
    match = re.search(r'v=([a-zA-Z0-9_-]{11})', youtube_url)
    if match:
        return match.group(1)
    return None

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

def save_subtitles_to_file(subtitles, output_file):
    with open(output_file, 'w', encoding='utf-8') as file:
        full_text = " ".join(line['text'] for line in subtitles).lower()
        full_text = re.sub(r'\[.*?\]', '', full_text)
        file.write(full_text)

def save_error_to_file(error_message, output_file, video_url=None):
    with open(output_file, 'w', encoding='utf-8') as file:
        file.write(error_message)
        if video_url:
            file.write(f"\nURL video: {video_url}")

def main():
    metadata_folder = os.path.join('data', 'metadata')
    subtitle_folder = os.path.join(os.path.join('data','subtitle'),'txt')
    if not os.path.exists(subtitle_folder):
        os.makedirs(subtitle_folder)
    for json_file in os.listdir(metadata_folder):
        if json_file.endswith('.json'):
            json_path = os.path.join(metadata_folder, json_file)
            video_url = read_video_url_from_json(json_path)
            video_id = extract_video_id(video_url)
            if video_id:
                subtitles = get_subtitle(video_id)   
                if isinstance(subtitles, list):
                    txt_file = os.path.join(subtitle_folder, json_file.replace('.json', '.txt'))
                    save_subtitles_to_file(subtitles, txt_file)
                else:
                    error_file = os.path.join(subtitle_folder, json_file.replace('.json', '_errors.txt'))
                    save_error_to_file(subtitles, error_file, video_url)
            else:
                error_message = f"Không tìm thấy video ID cho URL: {video_url}"
                error_file = os.path.join(subtitle_folder, json_file.replace('.json', '_errors.txt'))
                save_error_to_file(error_message, error_file, video_url)

def process_error_files(subtitle_folder):
    error_files = [f for f in os.listdir(subtitle_folder) if f.endswith('_errors.txt')]
    for error_file in error_files:
        error_file_path = os.path.join(subtitle_folder, error_file)
        with open(error_file_path, 'r', encoding='utf-8') as file:
            lines = file.readlines()
        text_lines = []
        for line in lines:
            if not re.match(r'^\d+:\d+', line):
                text_lines.append(line.strip())
        full_text = " ".join(text_lines).lower()
        output_file_path = os.path.join(subtitle_folder, error_file.replace('_errors.txt', '.txt'))
        save_subtitles_to_file(full_text, output_file_path)

if __name__ == "__main__":
    main()