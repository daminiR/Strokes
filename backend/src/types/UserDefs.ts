export const LocationType = `
    city: String!,
    state: String!,
    country: String!
`;
 export const MessageType = `
 _id: ID!,
 sender: String!,
 receiver: String!,
 text: String!
 createdAt: String
`;
 export const DeletedType = `
 isDeleted: Boolean,
 deletedAt: String,
`;
export  const SquashNodeType = `
    sport: String!,
    game_level: String!,
`
export const DataType = `
    img_idx: Int!,
    imageURL: String!,
    filePath: String!
`
export const ImageData = `
    file: FileUpload!
`
export const ageRange = `
    minAge: Int!,
    maxAge: Int!
`
export const PotentialMatchUserType = `
    _id: ID!
    first_name: String!
    age: Int!
    gender: String!
    sports: [SquashNode!]!
    description: String
    location: LocationType!
    image_set: [Data!]!
`
export const LikedByUserType = `
    _id: ID!
    first_name: String!
    age: Int!
    gender: String!
    sports: [SquashNode!]!
    description: String
    location: LocationType!
    image_set: [Data!]!
`
export const LikedByUserInputType = `
    _id: ID!
    first_name: String!
    age: Int!
    gender: String!
    sports: [SquashNodeInput!]!
    description: String
    image_set: [DataInput!]!
    location: LocationInput!
`
export const userExistT = `
    isPhoneExist: Boolean!
    isDeleted: Boolean!
`
export const PotentialMatchUserInputType = `
    _id: ID!
    first_name: String!
    age: Int!
    gender: String!
    sports: [SquashNodeInput!]!
    description: String
    image_set: [DataInput!]!
    location: LocationInput!
`
export const SquashType = `
    first_name: String!
    last_name: String!
    _id: ID!
    age: Int!
    gender: String!
    sports: [SquashNode!]!
    location: Location!
    description: String
    image_set: [Data!]!
    matches : [PotentialMatch!]
    blocked_me : [PotentialMatch!]
    i_blocked : [PotentialMatch!]
    likes : [String!]
    swipesPerDay: Int!
    sportChangesPerDay: Int!
    visableLikePerDay: Int!
    dislikes : [String!]
    likedByUSers: [LikedByUser!]
    deleted: DeletedT
    phoneNumber: String
    email: String
  `

export const SquashInputType = `
    first_name: String!
    last_name: String!
    _id: ID!
    age: Int!
    gender: String!
    sports: [SquashNodeInput!]!
    location: LocationInput!
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
  `
