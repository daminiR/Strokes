import Squash from '../models/Squash';
import Message from '../models/Messages';
import { GraphQLUpload } from 'graphql-upload'
import { ObjectId} from 'mongodb'
import { sanitizeFile } from '../utils/fileNaming'
import * as path from 'path';
import _ from 'lodash'
import {Data, DisplayData} from '../types/Squash'
import {
  deleteAllUserImages,
  creatGCUpload,
  deleteFilesFromGC,
  deleteFromGC,
} from "../utils/googleUpload";
import {
  SWIPIES_PER_DAY_LIMIT,
  LIKES_PER_DAY_LIMIT,
  SPORT_CHANGES_PER_DAY,
  dest_gcs_images,
  POST_CHANNEL
} from "../constants/";
export const resolvers = {
  Query: {
    matchesNotOptim: async (parents, { _id, offset, limit, location, sport, game_levels, ageRange, dislikes}, context, info) => {
      //const users = await Squash.find({$and : [{ _id: { $ne: _id }}, {active: true}]}).limit(limit);
      //// it is imperitive all the filter items are indexed!
      const minAge = ageRange.minAge;
      const maxAge = ageRange.maxAge;
      const filter = {
        $and: [
          {
            _id: { $ne: _id },
          },
          {
            "location.city": location.city,
          },
          {
            "likes._id": {$ne: _id},
          },
          {
            active: true,
          },
          {
            //sports: { sport: sport, game_level: { $in: game_levels  } },
            sports: {
              $elemMatch: { sport: sport, game_level: { $in: ["2", "0"] } },
            },
          },
          {
            age: { $gt: minAge, $lt: maxAge },
          },
        ],
      };
      const users = await Squash.find(filter).skip(offset).limit(limit);
      console.log("All users that are a potential match to current!", users.length);
      return users;
    },
    queryProssibleMatches: async (parents, { _id, offset, limit, location, sport, game_levels, ageRange}, context, info) => {
      const usersFiltered = await Squash.find({$and : [{ _id: { $ne: _id }}, {active: true}]}).limit(limit);
      //// it is imperitive all the filter items are indexed!
      //just for testing!
      const matchingestingFIlter = [
        "wLP3M9NMuVb0HZ6YgRflMlZZtZs1",
        "PjLHYn4RGldeDEP4o5NSDFwgRaJ3",
        "raFZfxCKnkPyLctuDScZZoPxg383",
        "PjLHYn4RGldeDEP4o5NSDFwgRaJ3",
        "apGe4DCTAJMEK28yhjvycW0vwxt1",
        "rpdiszrxocuawphcjwfpfartqmjw",
        "bpikrcdgfptbmcfdxiuhsjtyixvw",
        "pkimewhaimvhcbffqeomhaxrvago",
        "umfiemicigdyoewibrkdwcqvqllq",
        "ezwviwnqurrlxkwfgoapxfsheluo",
        "tqcnpdeqhnxwszstoqjzeytezloy",
        "idzlmexjvinaeazrhtmtcikkzdae",
        "eqiibyvrqlepzlszreecrlxnjmgb",
        "vrgffumzkdkiqccwtmppfxqgkfuz",
        "xbymfauwsmsxqiltefpifsewejsn",
        "qydkdyxagzlmmwhwneysttezjtbc",
        "tpxwhbgxczdchqtoctketztpxwvm",
        "ppajvinskckeuuzpokvwbyuquxzl",
        "nakikrbjpuebtczseojwtkancxki",
        "onzhxkhugnsacdjlicyqnheprxsq",
        "efvtocugfomuixmsjthqdglmfzsr",
        "fmyuiatkqbnlspmtkgcdypwtwdls",
        "mpmcgtuzyljycxqhtumrshvglnob",
        "shfycwppdykpzlavlzohrszpnklw",
        "onifaweiyfdmqnixzgfyqwmkotic",
        "krnsxazpljpdkapztjvlxzsxnmkc",
        "pejvchkzlidjyuzpqbgsgfgxqckp",
        "esjcajqstsrbpyxqcbalypltaxli",
        "tyhhqcivlnrjhboxfyeshxytgkdu",
        "sckvatjzhcrxmjavtejhdzjlqwso",
        "wbunwiospcfrjtzddydmgfzzqqfv",
        "rqukfbpkivnkoazcesdfkstlstin",
        "bmuvqdedmagznvvwkccwmsfpukzs",
      ];
      const minAge = ageRange.minAge;
      const maxAge = ageRange.maxAge;
      const filter = {
        $and: [
          {
            _id: { $ne: _id },
          },
          {
            "location.city": location.city,
          },
          {
            active: true,
          },
          {
            sports: {
              $elemMatch: { sport: sport, game_level: { $in: game_levels } },
            },
          },
          {
            age: { $gt: minAge, $lt: maxAge },
          },
        ],
      };
      const test_filter = { _id: { $in: matchingestingFIlter } };
      const fieldsNeeded = {
        _id: 1,
        first_name: 1,
        age: 1,
        gender: 1,
        sports: 1,
        description: 1,
        image_set: 1,
        location: 1,
      };
      const users = await Squash.find(test_filter, fieldsNeeded)
        .skip(offset)
        .limit(limit);
      return users;
    },
  },
  Mutation: {
    updateMatches: async (parents, { currentUserId, potentialMatchId, currentUser, potentialMatch}, context, info) => {
        const doc = await Squash.findOneAndUpdate(
          { _id: currentUserId },
          { $addToSet: { matches: potentialMatch } },
          { new: true }
        );
        const potentialMatchDoc = await Squash.findOneAndUpdate(
          { _id: potentialMatchId },
          { $push: { matches: currentUser} },
          { new: true }
        );
        console.log("doc user", doc)
        console.log("doc match", potentialMatchDoc)
      return potentialMatchDoc;
    },
  }
}
