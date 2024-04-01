import { faker } from '@faker-js/faker'
import fs from 'fs';
import csv from 'fast-csv';

function generateUser() {
  const image1 = faker.image.avatar()
  const image2 = faker.image.avatar()
  const image3 = faker.image.avatar()
  return {
    _id: faker.datatype.uuid(),
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    age: faker.datatype.number({min: 18, max: 100}),
    gender: faker.helpers.arrayElement(['male', 'female']),
    sports: [{
      game_level: faker.datatype.float({min: 1, max: 7}),
      sport: "Squash"
    }],
    neighborhood:
    {
    city: faker.address.city(),
    state: "MA",
    country: "US"
},
      description: "hi i play squash too!",
      image_set: [
        {
        img_idx: 1,
          imageURL: image1,
          filePath: image1
      },
        {
        img_idx: 2,
          imageURL: image2,
          filePath: image2
      },
        {
        img_idx: 3,
          imageURL: image3,
          filePath: image3
      }
      ],
      phoneNumber: "+" + faker.phone.number(),
      email: faker.internet.email()
  };
}
function generateMultipleUsers(count) {
  const users = [];
  for (let i = 0; i < count; i++) {
    users.push(generateUser());
  }
  return users;
}
const users = generateMultipleUsers(10);
const csvStream = csv.format({ headers: true });
const writableStream = fs.createWriteStream('/home/damini/activityBook/backend/src/test/mockData/fakeUsers.csv');

writableStream.on('finish', () => {
  console.log('Done writing users to CSV');
});

csvStream.pipe(writableStream);
users.forEach(row => {
  csvStream.write({
    _id: row._id,
    firstName: row.firstName,
    lastName: row.lastName,
    age: row.age,
    gender: row.gender,
    sport: row.sports[0].sport,
    game_level: row.sports[0].game_level,
    city: row.neighborhood.city,
    state: row.neighborhood.state,
    country: row.neighborhood.country,
    description: row.description,
    img_idx1: 1,
    imageURL1: row.image_set[0].imageURL,
    filePath1: row.image_set[0].filePath,
    img_idx2: 2,
    imageURL2: row.image_set[1].imageURL,
    filePath2: row.image_set[1].filePath,
    img_idx3: 3,
    imageURL3: row.image_set[2].imageURL,
    filePath3: row.image_set[2].filePath,
    phoneNumber: row.phoneNumber,
    email: row.email,
      });
});
csvStream.end();
