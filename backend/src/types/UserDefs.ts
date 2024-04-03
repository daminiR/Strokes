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
export const SquashNodeType = `
    sport: String!,
    game_level: Float!,
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
export const GameLevelRangeType = `
    minGameLevel: Int!,
    maxGameLevel: Int!
`
export const AgeRangeType = `
    minAge: Int!,
    maxAge: Int!
`
export const FilterType = `
  ageRange: String,
  game_level: String
`;
export const PotentialMatchUserType = `
    _id: ID!
    firstName: String!
    age: Int!
    gender: String!
    sports: [SquashNode!]!
    description: String
    neighborhood: LocationType!
    image_set: [Data!]!
`
export const MatchQueueType = `
    _id: ID!
    interacted: Boolean!
`
export const LikedByUserType = `
    _id: ID!
    firstName: String!
    age: Int!
    gender: String!
    sports: [SquashNode!]!
    description: String
    neighborhood: LocationType!
    image_set: [Data!]!
`
export const LikedByUserInputType = `
    _id: ID!
    firstName: String!
    age: Int!
    gender: String!
    sports: [SquashNodeInput!]!
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
    sports: [SquashNodeInput!]!
    description: String
    image_set: [DataInput!]!
    neighborhood: LocationInput!
`
export const SquashType = `
    firstName: String!
    lastName: String!
    _id: ID!
    age: Int!
    gender: String!
    sports: [SquashNode!]!
    neighborhood: Location!
    description: String
    image_set: [Data!]!
    matches : [PotentialMatch!]
    blocked_me : [PotentialMatch!]
    i_blocked : [PotentialMatch!]
    matchQueue: [MatchQueue!]
    likes : [String!]
    swipesPerDay: Int!
    sportChangesPerDay: Int!
    visableLikePerDay: Int!
    dislikes : [String!]
    likedByUSers: [DeletedType!]
    deleted: DeletedT
    phoneNumber: String
    email: String
  `

export const SquashInputType = `
    firstName: String!
    lastName: String!
    _id: ID!
    age: Int!
    gender: String!
    sports: [SquashNodeInput!]!
    neighborhood: LocationInput!
    description: String
    image_set: [DataInput!]!
    deleted: DeletedInput
    matches : [PotentialMatchInput!]
    blocked_me : [PotentialMatchInput!]
    i_blocked : [PotentialMatchInput!]
    likes : [String!]
    dislikes : [String!]
    swipesPerDay: Int!
    sportChangesPerDay: Int!
    visableLikePerDay: Int!
    likedByUSers: [LikedByUserInput!]
    phoneNumber: String
    email: String
    matchQueue: [MatchQueueInput!]
  `
