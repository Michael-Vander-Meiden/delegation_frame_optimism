import csv
import pickle

# Read the CSV file and create the dictionary
delegate_dict = {}

with open('good_delegates.csv', 'r') as csvfile:
    reader = csv.DictReader(csvfile)
    for row in reader:
        delegate_dict[row['delegate_address']] = row['good_delegate'] == 'True'

# Save the dictionary as a pickled file
with open('good_delegates.pkl', 'wb') as pickle_file:
    pickle.dump(delegate_dict, pickle_file)

print("Dictionary has been created and saved as good_delegates.pkl")