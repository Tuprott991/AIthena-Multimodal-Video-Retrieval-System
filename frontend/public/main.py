import json
import os

# Define the input and output file paths
input_file = "suggestions.json"
output_file = os.path.join(os.getcwd(), "suggestions_updated.json")

# Read the JSON data from the input file
try:
    with open(input_file, "r") as f:
        suggestions = json.load(f)
except json.JSONDecodeError as e:
    print(f"Failed to decode JSON: {e}")
    exit(1)

# Convert the suggestions into a list of dictionaries with id and name
items = [{"id": index, "name": suggestion} for index, suggestion in enumerate(suggestions)]

# Create the folder if it doesn't exist
# os.makedirs(exist_ok=True)

# Write the updated data to the output JSON file
with open(output_file, "w") as f:
    json.dump(items, f, indent=4)

print(f"Data written to {output_file}")
