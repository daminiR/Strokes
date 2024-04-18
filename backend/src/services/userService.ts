//import User from "../models/User"; // Adjust the path as necessary
//import { PotentialMatchPool } from "../models/PotentialMatchPool"; // Assuming you have a model for PotentialMatchPool
//import { Document } from 'mongoose';

//interface Criteria {
  //age: number;
  //sport: { gameLevel: number };
//}
//interface Sport {
  //gameLevel: number;
  //sportName: string;
//}

//interface ImageSetT {
  //img_idx: number;
  //imageURL: string;
  //filePath: string;
//}

//interface LocationType {
  //city: string;
  //state: string;
  //country: string;
//}

//// Define a type for potential match data that includes the needed properties.
//export interface PotentialMatchType {
  //_id: string; // Unique identifier for the user
  //firstName: string; // User's first name
  //lastName: string; // User's last name
  //age: number; // User's age
  //gender: string; // User's gender
  //sport: Sport; // Details about the sport the user plays, including level and name
  //description: string; // A short description or bio of the user
  //imageSet: ImageSetT[]; // Array of images related to the user
  //neighborhood: LocationType; // Information about the user's neighborhood
//}


//// Adjusted return type to use PotentialMatchType or any appropriate type
//async function fetchPotentialMatchesForNewPlayer(userId: string, criteria: Criteria): Promise<PotentialMatchType[]> {
  //const { age, sport } = criteria;

  //try {
    //const potentialMatches = await User.find({
      //_id: { $ne: userId },
      //age: { $gte: age - 5, $lte: age + 5 },
      //"sport.gameLevel": {
        //$gte: sport.gameLevel - 1,
        //$lte: sport.gameLevel + 1,
      //},
    //})
      //.limit(30)
      //.select(
        //"firstName lastName age gender sport description imageSet neighborhood"
      //)
      //.lean() // This ensures you get plain JavaScript objects instead of Mongoose Documents.
      //.exec();

    //// Map the query result to match the PotentialMatchType structure
    //return potentialMatches.map((user) => ({
      //_id: user._id.toString(), // Convert ObjectId to string
      //firstName: user.firstName,
      //lastName: user.lastName,
      //age: user.age,
      //gender: user.gender,
      //sport: user.sport,
      //description: Array.isArray(user.description)
        //? user.description.join(" ")
        //: user.description, // Correctly handle the description field
      //imageSet: user.imageSet,
      //neighborhood: user.neighborhood,
    //}));
  //} catch (error) {
    //console.error("Error fetching potential matches for new player:", error);
    //throw error; // Rethrow the error for handling by the caller
  //}
//}

//export { fetchPotentialMatchesForNewPlayer };

