import User from '../../models/User';
import _ from 'lodash'
export const resolvers = {
  Mutation: {
    updateAllUserSchema: async (root, _id, context) => {
      console.log("started")
      const filter = { "matches": {$exists: true}}
      const filter2 = {}
      const options = {
        $set: {
          "matches.$[].archived": false,
          "matches.$[].createdAt": new Date(),
        },
      };
      const sportsRemoved = [
        "Kickball",
        "Hiking",
        "Swimming",
        "Kick boxing",
        "Bouldering",
        "Badminton",
        "Hockey",
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
        "Boxing",
      ];
      const options2 = {
        $pull: {
          "sports": { "sport": {$in: sportsRemoved} },
        },
      };
      User.updateMany(
        filter2,
        options2,
        { timestamps: true }
      )
        .then(() => {
          console.log("done");
        })
        .catch((err) => {
          console.log(err);
        })
      return "done"
    },
  }
}
