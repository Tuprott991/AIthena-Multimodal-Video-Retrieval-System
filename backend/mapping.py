import pandas as pd, json, os
import re

data_directory = 'data'
map_keyframes_directory = os.path.join(data_directory, 'map-keyframes')
metadata_directory = os.path.join(data_directory, 'metadata')

class mapping:
    def __init__(self, img_path: str) -> None:
        self.folder, self.file = tuple(re.split(r'[\\/]', img_path)[-2:])
    
    def getFrame_idx(self):
        csv_path = os.path.join(map_keyframes_directory, self.folder+'.csv')
        df = pd.read_csv(csv_path)
        return df.loc[df['n'] == int(self.file.split('.')[0]), 'frame_idx'].values[0]
    
    def getTime(self):
        csv_path = os.path.join(map_keyframes_directory,self.folder+'.csv')
        df = pd.read_csv(csv_path)
        return df.loc[df['n'] == int(self.file.split('.')[0]), 'pts_time'].values[0]
    
    def generateURL(self):
        json_path = os.path.join(metadata_directory,self.folder+'.json')
        with open(json_path, 'r', encoding='utf-8') as file: 
            url = json.load(file)['watch_url']
        new_url = f"{url}&t={round(self.getTime())}"
        return new_url