import string
import random
import csv
import json
# import pandas as pd

  # sports: [{game_level: number, sport: string}]
  # image_set: [{img_idx: number, imageURL: string, filePath: string}]
letters = string.ascii_lowercase
numUsers = 7
gender = ["Male", "Female"]

sportsList2 = ["Squash", "Tennis", "Soccer", "badminton", "Hockey", "Volleyball", "Basketball", "Cricket", "Table Tennis", "Baseball", "Golf", "American Football"]
sportsList = [{"Squash", 0},
              {"Tennis", 0},
              {"Soccer", 0},
              {"badminton", 0},
              {"Hockey",0},
              {"Volleyball",0 },
              {"Basketball",0 },
              {"Cricket",0 },
              {"Table Tennis",0 },
              {"Baseball",0 },
              {"Golf",0 },
              {"American Football", 0}]

image_set = [
"https://live.staticflickr.com/3861/14630821615_c50c61efd7_b.jpg",
  "https://live.staticflickr.com/8234/8401697309_e594585eda_b.jpg",
  "https://live.staticflickr.com/5643/23778807571_e9649ee35e_b.jpg",
  "https://cdn.pixabay.com/photo/2020/12/03/14/35/horror-5800684_1280.jpg",
  "https://cdn.pixabay.com/photo/2021/09/28/05/05/bird-6663217_1280.jpg",
  "https://cdn.pixabay.com/photo/2021/10/04/16/42/dog-6680642_1280.jpg",
  "https://cdn.pixabay.com/photo/2021/10/09/09/18/indian-palm-squirrel-6693577_1280.jpg",
  "https://cdn.pixabay.com/photo/2021/10/05/16/53/kimono-6683245_1280.jpg",
  "https://cdn.pixabay.com/photo/2021/04/07/17/01/woman-6159648_1280.jpg",
  "https://cdn.pixabay.com/photo/2021/09/17/10/55/caiman-lizard-6632344__480.jpg",
  "https://cdn.pixabay.com/photo/2021/10/17/08/11/animal-6717147__480.jpg"
]

with open("/home/damini/activityBook/backend/src/admin/createData/sampleUserData.csv", mode='w') as csv_file:
  dataWriter = csv.writer(csv_file, delimiter=';',quotechar = "'")
  dataWriter.writerow(['_id', 'first_name', 'last_name', 'genderUser', 'age', 'sports', 'image_set', 'desciption', 'location'])
  for user in range(numUsers):
     _id = ''.join(random.choice(letters) for i in range(28))
     first_name = ''.join(random.choice(letters) for i in range(8))
     last_name = ''.join(random.choice(letters) for i in range(8))
     description = ''.join(random.choice(letters) for i in range(50))
     genderUser = random.choice(gender)
     age  = random.randint(20, 42)
     # sports = list(random.sample(sportsList, random.randint(2, 6)))
     sports = random.sample(sportsList2, random.randint(2, 6))
     sportsObj = [{'sport': sport, "game_level": random.choice(["0","1","2"])} for sport in sports]
     sportsObjJSON = json.dumps(sportsObj)
     random_imgs = random.sample(image_set, random.randint(2, 5))
     images = [{"imageURL": image, "img_idx": idx, "filePath": image} for idx, image in enumerate(random_imgs)]
     imagesJSON = json.dumps(images)
     location = {"city": "Boston", "state": "MA", "country": "US"}
     locationJSON =json.dumps(location)
     matched = []
     i_blocked = []
     blocked_me = []
     likes = []
     dislikes = []
     print("///////////////////////////////////////////////////////")
     print("_id", _id)
     print("first_name", first_name)
     print("last_name", last_name)
     print("genderUser", genderUser)
     print("age", age)
     print("sportsType", sportsObjJSON)
     print("image_set", images)
     print("location", location)
     dataWriter.writerow([_id, first_name, last_name, genderUser, age, sportsObjJSON, imagesJSON, description, locationJSON])
  csv_file.close()



