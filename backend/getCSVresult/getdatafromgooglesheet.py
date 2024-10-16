import pandas as pd
import os
import zipfile

main_folder = 'getCSVresult'
submission_folder = os.path.join(main_folder, 'submission')

def extract_columns(df: pd.DataFrame) -> None:
    if 'TÊN FILE' in df.columns and 'Kết quả bỏ vào CSV' in df.columns:
        df_selected = df[['TÊN FILE', 'Kết quả bỏ vào CSV']]
        return df_selected
    else:
        print("Các cột 'TÊN FILE' hoặc 'Kết quả bỏ vào CSV' không tồn tại trong file CSV.")

def save_all_result(df: pd.DataFrame) -> None:
    if not os.path.exists(submission_folder):
        os.mkdir(submission_folder)
    for _, row in df.iterrows():
        if not pd.isna(row['TÊN FILE']):
            filename = os.path.join(submission_folder,f"{row['TÊN FILE']}.csv")
            with open(filename,'w') as file:
                if not pd.isna(row['Kết quả bỏ vào CSV']):
                    file.write(str(row['Kết quả bỏ vào CSV']))

def zip_folder(output_zip : str, folder_path : str) -> None: 
    with zipfile.ZipFile(output_zip, 'w', zipfile.ZIP_DEFLATED) as zip_file:
        for foldername, _, filenames in os.walk(folder_path):
            if 'submission' in foldername: 
                for filename in filenames:
                    file_path = os.path.join(foldername, filename)
                    arcname = os.path.relpath(file_path, folder_path)
                    zip_file.write(file_path, arcname)
                    os.remove(file_path)
    os.removedirs(submission_folder)

if __name__ == '__main__':
    url = "https://docs.google.com/spreadsheets/d/10sZfGfyhN_-G4JocjCY9u6OAXNzSw0QTWF-yzUHHAfs/export?format=csv&gid=708859947"
    df = pd.read_csv(url)
    name_result = extract_columns(df)
    save_all_result(name_result)
    zip_folder(os.path.join(main_folder,'submission.zip'), main_folder)
