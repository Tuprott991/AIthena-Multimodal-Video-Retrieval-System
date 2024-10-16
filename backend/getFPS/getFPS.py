import os
import pandas as pd

if __name__=="__main__":
    data_folder = 'data'
    map_keyframes_folder = os.path.join(data_folder, 'map-keyframes')
    sub_df = []
    for file in os.listdir(map_keyframes_folder):
        csv_path = os.path.join(map_keyframes_folder, file)
        data = pd.read_csv(csv_path)
        name, fps = file[:file.find('.')], data['fps'][1]
        sub_df.append({'folder' : name, 'fps': float(fps)})
    df = pd.DataFrame(sub_df)
    df.to_csv(os.path.join('getFPS','fps.csv'), index=False)