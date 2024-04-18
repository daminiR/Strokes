import string
import random
import csv
import json
# import pandas as pd

  # sports: [{game_level: number, sport: string}]
  # imageSet: [{img_idx: number, imageURL: string, filePath: string}]
letters = string.ascii_lowercase
_id1 = "wLP3M9NMuVb0HZ6YgRflMlZZtZs1"
_id2= "ajxydxqqodmnnflqrszduslasqvq"
IDs = [_id1, _id2]
numMessages = 200
with open("/home/damini/activityBook/backend/src/admin/createMessages/sampleMessages.csv", mode='w') as csv_file:
  dataWriter = csv.writer(csv_file, delimiter=';',quotechar = "'")
  dataWriter.writerow(['sender', 'receiver', 'text'])
  for user in range(numMessages):
      text = ''.join(random.choice(letters) for i in range(15))
      sender = random.choice(IDs)
      receiver = list(set(IDs) - set([sender]))[0]
      print(sender, receiver)
      dataWriter.writerow([sender, receiver, text])
csv_file.close()



