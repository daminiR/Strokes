export const LocationType = `
    city: String!,
    state: String!,
    country: String!
`;
export const FileUploadType = `
  img_idx: Int!,
  ReactNativeFile: FileUpload!
`
export const MessageType = `
 _id: ID!,
 sender: String!,
 receiver: String!,
 text: String!
 createdAt: String
`
export const DeletedType = `
 isDeleted: Boolean,
 deletedAt: String,
`
export const SportNodeType = `
    sportName: String!,
    gameLevel: Float!,
`

export const DataType = `
    img_idx: Int!,
    imageURL: String!,
    filePath: String!
`
export const ImageData = `
    img_idx: Int!,
    file: FileUpload!
`
export const RangeType = `
    min: Int!,
    max: Int!
`
export const FilterType = `
  ageRange: AgeRangeType!,
  gameLevel: GameLevelRangeType!
`;
export const FilterInputType = `
  ageRange: AgeRangeInput!,
  gameLevel: GameLevelRangeInput!
`;
export const PotentialMatchUserType = `
    _id: ID!
    firstName: String!
    age: Int!
    gender: String!
    sport: SportNode!
    description: String
    neighborhood: LocationType!
    image_set: [Data!]!
    createdAt: String,
    updatedAt: String
`
export const MatchQueueType = `
    _id: ID!
    interacted: Boolean!
    createdAt: String
    updatedAt: String
`
export const LikedByUserType = `
    _id: ID!
    firstName: String!
    age: Int!
    gender: String!
    sport: SportNode!
    description: String
    neighborhood: LocationType!
    image_set: [Data!]!
`
export const LikedByUserInputType = `
    _id: ID!
    firstName: String!
    age: Int!
    gender: String!
    sport: SportNodeInput
    description: String
    image_set: [DataInput!]!
    neighborhood: LocationInput!
`
export const userExistT = `
    isPhoneExist: Boolean!
    isDeleted: Boolean!
`
export const PotentialMatchUserInputType = `
    _id: ID!
    firstName: String!
    age: Int!
    gender: String!
    sport: SportNodeInput
    description: String
    image_set: [DataInput!]!
    neighborhood: LocationInput!
`
export const UserType = `
    firstName: String!
    lastName: String!
    _id: ID!
    age: Int!
    gender: String!
    sport: SportNode!
    neighborhood: LocationType!
    description: String
    image_set: [Data!]!
    matches : [PotentialMatch!]
    blocked_me : [PotentialMatch!]
    i_blocked : [PotentialMatch!]
    lastFetched: String
    matchQueue: [MatchQueueType!]
    likes : [String!]
    swipesPerDay: Int!
    sportChangesPerDay: Int!
    visableLikePerDay: Int!
    dislikes : [String!]
    likedByUSers: [LikedByUser!]
    deleted: DeletedType
    phoneNumber: String
    email: String
  `

export const UserInputType = `
    firstName: String!
    lastName: String!
    _id: ID!
    age: Int!
    gender: String!
    sport: SportNodeInput!
    neighborhood: LocationInput!
    description: String
    image_set: [DataInput!]!
    deleted: DeletedInput
    matches : [PotentialMatchInput!]
    blocked_me : [String!]
    i_blocked : [String!]
    likes : [String!]
    dislikes : [String!]
    swipesPerDay: Int!
    sportChangesPerDay: Int!
    visableLikePerDay: Int!
    lastFetched: String
    likedByUSers: [LikedByUserInput!]
    phoneNumber: String
    email: String
    matchQueue: [MatchQueueInput!]
  `
