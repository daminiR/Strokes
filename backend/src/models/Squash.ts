import { Types, model, Schema} from 'mongoose';
import { DeleteT, SquashDocument, LikedByUserT, PotentialMatchT, LocationT} from '../types/Squash.d'
const uri = process.env.ATLAS_URI as any
const GENDERS = ["Male", "Female"]
const LOCATIONS = [
  {
    city: "New York City",
    state: "NY",
    country: "US",
  },
  {
    city: "Cambridge",
    state: "MA",
    country: "US",
  },
  {
    city: "Boston",
    state: "MA",
    country: "US",
  },
  {
    city: "Sommerville",
    state: "MA",
    country: "US",
  },
  {
    city: "Chicago",
    state: "IL",
    country: "US",
  },
  {
    city: "Charleston",
    state: "SC",
    country: "US",
  },
  {
    city: "Las Vegas",
    state: "NV",
    country: "US",
  },
  {
    city: "Seattle",
    state: "WA",
    country: "US",
  },
  {
    city: "San Francisco",
    state: "CA",
    country: "US",
  },
  {
    city: "Washington",
    state: "DC",
    country: "US",
  },
  {
    city: "Las Vegas",
    state: "NV",
    country: "US",
  },
  {
    city: "Los Angeles",
    state: "NV",
    country: "US",
  },
  {
    city: "Austin",
    state: "Texas",
    country: "US",
  },
];
const CITIES = [
  'New York City',
  'Cambridge',
  'Boston',
  'Sommerville',
  'Chicago',
  'Charleston',
  'Las Vegas',
  'Seattle',
  'San Francisco',
  'Washington',
  'Los Angeles',
  'Austin',
];
const STATES = [
  "NY",
  "MA",
  "IL",
  "SC",
  "NV",
  "WA",
  "CA",
  "DC",
  "TX",
];
const COUNTRY = ["US"];
const SPORTS = [
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
]
const LocationSchema = new Schema({
  city: { type: String, enum: CITIES, required: true},
  state: { type: String, enum: STATES },
  country: { type: String, enum: COUNTRY },
});


const LEVELS = ['0', '1', '2']
const MAX_SPORTS_LIMIT = 5

const imageArrayMaxLimit = val => {
  return (Array.isArray(val) && val.length <= 6)
}
const sportsArrayMaxLimit = val => {
  return (Array.isArray(val) && val.length <= MAX_SPORTS_LIMIT)
}

const imageArrayMinLimit = val => {
  return (Array.isArray(val) && val.length >= 1)
}

var validateEmail = (email) => {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};
const _idValidator = _id => {
 return (_id === typeof(String))
}
// TODO: need to decide on what age requirement you need for your app -> 18 for now, also max requirement?
// TODO: need to figure away to allow enum values only once!
// TODO: need to check if age above 40s is really the persons age
var squashSchema = new Schema({
  _id: {
    type: String!,
    required: true,
    //validate: [
    //{
    //validator: _idValidator,
    //message: "_id provided is not an ObjectID",
    //},
    //],
  },
  first_name: {
    type: String!,
    required: true,
    minlength: 3,
    maxlength: 30,
  },
  last_name: {
    type: String!,
    required: true,
    minlength: 3,
    maxlength: 30,
  },
  visableLikePerDay: {
    type: Number,
    required: true,
    //TODO: fix the age and bithday category asap
    //validate: {
    //validator: Number.isInteger,
    //message: "{VALUE} is not an integer value",
    //},
  },
  sportChangesPerDay: {
    type: Number,
    required: true,
    //TODO: fix the age and bithday category asap
    //validate: {
    //validator: Number.isInteger,
    //message: "{VALUE} is not an integer value",
    //},
  },
  swipesPerDay: {
    type: Number,
    required: true,
    //TODO: fix the age and bithday category asap
    //validate: {
    //validator: Number.isInteger,
    //message: "{VALUE} is not an integer value",
    //},
  },
  age: {
    type: Number,
    required: true,
    min: 18,
    max: 90,
    //TODO: fix the age and bithday category asap
    //validate: {
    //validator: Number.isInteger,
    //message: "{VALUE} is not an integer value",
    //},
  },
  gender: {
    type: String,
    required: true,
    enum: GENDERS,
  },
  sports: {
    type: [
      {
        game_level: {type: String, enum: LEVELS},
        sport: { type: String, enum: SPORTS },
      },
    ],
    required: true,
    validate: [
      {
        validator: imageArrayMinLimit,
        message: "Cannot have no sport, choose atleast one",
      },
      {
        validator: sportsArrayMaxLimit,
        message: "Cannot have more than 5 chossen sports at a time",
      },
    ],
  },
  location: {
    type: LocationSchema,
    required: true,
  },
  description: {
    type: String,
    maxlength: 300,
  },
  image_set: {
    type:
    [
      {
        img_idx: { type: Number },
        imageURL: { type: String },
        filePath: { type: String },
      }
    ],
    required: true,
    validate: [
      {
        validator: imageArrayMinLimit,
        message: "Cannot have no images",
      },
      {
        validator: imageArrayMaxLimit,
        message: "No more than 6 images",
      },
    ],
  },
  phoneNumber: {
    type:String,
    required: false,
  },
  email: {
    type:String,
     trim: true,
     lowercase: true,
     unique: true,
     required: true,
     validate: [validateEmail, 'Please fill a valid email address'],
     match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
  },
  likes: {
    type:[String],
    //type:<PotentialMatchT>{},
    required: false,
  },
  likedByUSers: {
    type:<LikedByUserT>{},
    required: false,
  },
  dislikes: {
    type:[String],
    required: false,
  },
  i_blocked: {
    type:<PotentialMatchT>{},
    required: false,
  },
  blocked_me: {
    type:<PotentialMatchT>{},
    required: false,
  },
  matches: {
    type:<PotentialMatchT>{},
    required: false,
    timestamps: true,
  },
  // new additions
  deleted: {
    type:<DeleteT>{},
    required: false,
  },
  active: {
    type:Boolean,
    required: false,
  },
  blockedByAdmin: {
    type:Boolean,
    required: false,
  },
},
{timestamps: true})
const Squash = model<SquashDocument>('Squash', squashSchema)
export default Squash
