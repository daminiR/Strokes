import { types, flow, cast, SnapshotOrInstance, SnapshotOut, Instance, getRoot} from 'mobx-state-tree';
import { CognitoUser, CognitoUserAttribute, AuthenticationDetails, CognitoUserPool } from 'amazon-cognito-identity-js';
import { getRootStore } from './helpers/getRootStore';

const ImageDataModel = types.model({
  file: types.maybeNull(types.string),
  img_idx: types.integer,
})
const GameLevelModel = types.model({
  game_level: types.maybeNull(types.string),
  sport: types.maybeNull(types.string),
})
const NeighborhoodModel = types.model({
  city: types.maybeNull(types.string),
  state: types.maybeNull(types.string),
  country: types.maybeNull(types.string),
})

export const MatchModel = types
  .model("MatchModel", {
    _id: types.maybeNull(types.string), // Assuming you're providing a unique identifier when creating a user instance
    likes: types.maybeNull(types.integer), // Assuming you're providing a unique identifier when creating a user instance
    matches:
    displikes:
  })
  .actions((self) => ({
    setFromMongoDb(userData){
      self.likes = userData.likes
    },
    reset() {
      //self._id = ""
      //self.authPassword = ""
      //self.firstName = ""
      //self.lastName = ""
      //self.gender = ""
      //self.neighborhood = ""
      //self.description = ""
    },
    // Add other actions as needed
  }))
