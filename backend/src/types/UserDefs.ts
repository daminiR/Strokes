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
  age: AgeRangeType!,
  gameLevel: GameLevelRangeType!
`;
export const FilterInputType = `
  age: AgeRangeInput!,
  gameLevel: GameLevelRangeInput!
`;
export const PotentialMatchUserType = `
    matchUserId: ID!
    firstName: String!
    age: Int!
    gender: String!
    sport: SportNode!
    description: String
    neighborhood: LocationType!
    imageSet: [Data!]!
    createdAt: String,
    updatedAt: String
    interacted: Boolean!
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
    imageSet: [Data!]!
`
export const UserStatsType = `
    _id: ID!
    visibleLikePerDay: Int
    filtersChangesPerDay: Int
    lastFetchedFromTrigger: String
    dislikes: [String]
`
export const LikedByUserInputType = `
    _id: ID!
    firstName: String!
    age: Int!
    gender: String!
    sport: SportNodeInput
    description: String
    imageSet: [DataInput!]!
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
    imageSet: [DataInput!]!
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
    imageSet: [Data!]!
    blocked_me : [PotentialMatch!]
    i_blocked : [PotentialMatch!]
    lastFetchedFromTrigger: String
    matchQueue: [MatchQueueType!]
    visableLikePerDay: Int!
    dislikes : [String!]
    deleted: DeletedType
    phoneNumber: String
    email: String
    filtersChangesPerDay: Int!
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
    filtersChangesPerDay: Int!
    imageSet: [DataInput!]!
    deleted: DeletedInput
    blocked_me : [String!]
    i_blocked : [String!]
    dislikes : [String!]
    visableLikePerDay: Int!
    lastFetchedFromTrigger: String
    phoneNumber: String
    email: String
    matchQueue: [MatchQueueInput!]
    preferences: FilterInput!
    preferencesHash: String!
  `
