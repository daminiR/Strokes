import { faker } from '@faker-js/faker';
import fs from 'fs';
//import csv from 'fast-csv';
import { write, format } from 'fast-csv';
import { CITIES } from '../../constants/index';

const FAKE_DATA_COUNT = 1000

interface Sport {
  gameLevel: number;
  sportName: string;
}

interface Neighborhood {
  city: string;
  state: string;
  country: string;
}

interface ImageSet {
  img_idx: number;
  imageURL: string;
  filePath: string;
}

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  age: number;
  gender: string;
  sport: Sport
  neighborhood: Neighborhood;
  description: string;
  image_set: ImageSet[];
  phoneNumber: string;
  email: string;
}


function generateUser(): User {
  const image1 = faker.image.url();
  const image2 = faker.image.url();
  const image3 = faker.image.url();
  return {
    _id: faker.datatype.uuid(),
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    age: faker.datatype.number({ min: 18, max: 100 }),
    gender: faker.helpers.arrayElement(['male', 'female']),
    sport: {
      gameLevel: faker.datatype.number({ min: 1, max: 7 }),
      sportName: "Squash",
    },
    neighborhood: {
      city: faker.helpers.arrayElement(CITIES),
      state: "MA",
      country: "US",
    },
    description: "hi i play squash too!",
    image_set: [
      { img_idx: 1, imageURL: image1, filePath: image1 },
      { img_idx: 2, imageURL: image2, filePath: image2 },
      { img_idx: 3, imageURL: image3, filePath: image3 },
    ],
    phoneNumber: `+${faker.phone.number()}`,
    email: faker.internet.email(),
  };
}

function generateMultipleUsers(count: number): User[] {
  return Array.from({ length: count }, generateUser);
}

const users = generateMultipleUsers(FAKE_DATA_COUNT);
const csvStream = format({ headers: true });
const writableStream = fs.createWriteStream('/home/damini/activityBook/backend/src/test/mockData/fakeUsers.csv');

writableStream.on('finish', () => {
  console.log('Done writing users to CSV');
});

csvStream.pipe(writableStream);
//users.forEach((user: User) => csvStream.write(user));users.forEach((user: User) => csvStream.write(user));
users.forEach((row: any) => {
  csvStream.write({
    _id: row._id,
    firstName: row.firstName,
    lastName: row.lastName,
    age: row.age,
    gender: row.gender,
    sport: row.sport.sportName,
    gameLevel: row.sport.gameLevel,
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
