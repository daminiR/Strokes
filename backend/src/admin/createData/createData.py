import string
import random
import csv
import json
# import pandas as pd

  # sports: [{game_level: number, sport: string}]
  # image_set: [{img_idx: number, imageURL: string, filePath: string}]
letters = string.ascii_lowercase
numUsers = 200
gender = ["Male", "Female"]

sportsList2 = [
  "Softball",
  "Kickball",
  "Pickleball",
  "Hiking",
  "Swimming",
  "Kick boxing",
  "Bouldering",
  "Squash",
  "Tennis",
  "Soccer",
  "Badminton",
  "Hockey",
  "Volleyball",
  "Basketball",
  "Cricket",
  "Table Tennis",
  "Skateboarding",
  "Baseball",
  "Golf",
  "American Football",
  "Skating",
  "Snowbording",
  "Ice Skating",
  "Ice Hockey",
  "Power Lifting",
  "Body Building",
  "Surfing",
  "Cheerleading",
  "Ultimate Frisbee",
  "Cricket",
  "Cycling",
  "Dance",
  "Dodgeball",
  "Fencing",
  "Wrestling",
  "Gymnastics",
  "Paddleboarding",
  "Boxing"
];
# sportsList2 = ["Squash", "Tennis", "Soccer", "badminton", "Hockey", "Volleyball", "Basketball", "Cricket", "Table Tennis", "Baseball", "Golf", "American Football"]
# sportsList = [{"Squash", 0},
              # {"Tennis", 0},
              # {"Soccer", 0},
              # {"Badminton", 1},
              # {"Hockey",0},
              # {"Volleyball",0 },
              # {"Basketball",0 },
              # {"Cricket",0 },
              # {"Table Tennis",0 },
              # {"Baseball",0 },
              # {"Golf",0 },
              # {"American Football", 0}]

image_set = [
   "https://images.unsplash.com/photo-1641175702113-796692d71e9b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwxNzR8fHxlbnwwfHx8fA%3D%3D&auto=format&fit=crop&w=900&q=60",
   "https://images.unsplash.com/photo-1641170471790-d4e9d08ba22c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwxNjd8fHxlbnwwfHx8fA%3D%3D&auto=format&fit=crop&w=900&q=60",
   "https://images.unsplash.com/photo-1641225731207-1fda1739c7f7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwxNTJ8fHxlbnwwfHx8fA%3D%3D&auto=format&fit=crop&w=900&q=60",
   "https://images.unsplash.com/photo-1641220839365-ba2da91c1368?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwxMzh8fHxlbnwwfHx8fA%3D%3D&auto=format&fit=crop&w=900&q=60",
   "https://images.unsplash.com/photo-1641209751671-d1cd7bedcd86?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwxMzN8fHxlbnwwfHx8fA%3D%3D&auto=format&fit=crop&w=900&q=60",
   "https://images.unsplash.com/photo-1641213695743-6b97ec5b027e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwxMjd8fHxlbnwwfHx8fA%3D%3D&auto=format&fit=crop&w=900&q=60",
   "https://images.unsplash.com/photo-1641155785005-592529a4391d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwxMTV8fHxlbnwwfHx8fA%3D%3D&auto=format&fit=crop&w=900&q=60",
   "https://images.unsplash.com/photo-1640622308013-b9337424e401?ixlib=rb-1.2.1&ixid=MnwxMjA3fDF8MHxlZGl0b3JpYWwtZmVlZHwxMDR8fHxlbnwwfHx8fA%3D%3D&auto=format&fit=crop&w=900&q=60",
   "https://images.unsplash.com/photo-1641269700053-2d25534763e8?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw4Nnx8fGVufDB8fHx8&auto=format&fit=crop&w=900&q=60",
   "https://images.unsplash.com/photo-1641224081286-e76996a73a8a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw4Mnx8fGVufDB8fHx8&auto=format&fit=crop&w=900&q=60",
   "https://images.unsplash.com/photo-1593642532744-d377ab507dc8?ixlib=rb-1.2.1&ixid=MnwxMjA3fDF8MHxlZGl0b3JpYWwtZmVlZHw2NXx8fGVufDB8fHx8&auto=format&fit=crop&w=900&q=60",
   "https://images.unsplash.com/photo-1641247636234-4fa35101d4ef?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw1Mnx8fGVufDB8fHx8&auto=format&fit=crop&w=900&q=60",
   "https://images.unsplash.com/photo-1641289024282-5a50e8fd6c7a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwzN3x8fGVufDB8fHx8&auto=format&fit=crop&w=900&q=60",
   "https://images.unsplash.com/photo-1641159247660-cee52f9dddae?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwzM3x8fGVufDB8fHx8&auto=format&fit=crop&w=900&q=60",
   "https://images.unsplash.com/photo-1641213610651-ebcb7fe02a17?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyfHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=900&q=60",
   "https://images.unsplash.com/photo-1641220980035-345579824691?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw1fHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=900&q=60",
"https://images.unsplash.com/photo-1641221750080-24949785b28d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw5fHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=900&q=60",
   "https://images.unsplash.com/photo-1641244063050-d3e34619fd2d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwxM3x8fGVufDB8fHx8&auto=format&fit=crop&w=900&q=60",
   "https://images.unsplash.com/photo-1641209751671-d1cd7bedcd86?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwxN3x8fGVufDB8fHx8&auto=format&fit=crop&w=900&q=60",
   "https://images.unsplash.com/photo-1638913661377-abd9e8cf1998?ixlib=rb-1.2.1&ixid=MnwxMjA3fDF8MHxlZGl0b3JpYWwtZmVlZHwyNnx8fGVufDB8fHx8&auto=format&fit=crop&w=900&q=60",
   "https://images.unsplash.com/photo-1641224204630-11f43d3b0a0e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwzOHx8fGVufDB8fHx8&auto=format&fit=crop&w=900&q=60",
   "https://images.unsplash.com/photo-1641225731207-1fda1739c7f7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1287&q=80",
   "https://images.unsplash.com/photo-1641077292901-54acf5d0cb3c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1287&q=80",
   "https://images.unsplash.com/photo-1641196575114-adb67f9cb728?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw2NXx8fGVufDB8fHx8&auto=format&fit=crop&w=900&q=60",
   "https://images.unsplash.com/photo-1641073448864-6ad590c9dfff?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw3Nnx8fGVufDB8fHx8&auto=format&fit=crop&w=900&q=60",
   "https://images.unsplash.com/photo-1641055119309-0e2429189959?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw5N3x8fGVufDB8fHx8&auto=format&fit=crop&w=900&q=60",
   "https://images.unsplash.com/photo-1641061371625-b673503d1589?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwxMDJ8fHxlbnwwfHx8fA%3D%3D&auto=format&fit=crop&w=900&q=60",
   "https://images.unsplash.com/photo-1641079203172-7b73e6c92e68?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1288&q=80",
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
     email = ''.join(random.choice(letters) for i in range(4)) + "@gmail.com"
     genderUser = random.choice(gender)
     age  = random.randint(22, 90)
     # sports = list(random.sample(sportsList, random.randint(2, 6)))
     sports = random.sample(sportsList2, random.randint(2, 4))
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
     dataWriter.writerow([_id, first_name, last_name, genderUser, age, sportsObjJSON, imagesJSON, description, email, locationJSON])
  csv_file.close()
