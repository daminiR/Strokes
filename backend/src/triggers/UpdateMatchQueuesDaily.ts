//exports = async function() {
  //const mongodb = context.services.get("mongodb-atlas");
  //const usersCollection = mongodb.db("test").collection("users");
  //const potentialMatchPoolsCollection = mongodb.db("test").collection("potentialMatchPools");
  //const likesCollection = mongodb.db("test").collection("likes");
  //const currentDate = new Date();

  //// Fetch all user profiles
  //const users = await usersCollection.find({}).toArray();

  //for (const user of users) {
    //// Fetch the list of user IDs that the current user has already liked
    //const likesQuery = await likesCollection.find({ likerId: user._id }).toArray();
    //const likedUserIds = likesQuery.map(like => like.likedId);
    //// Fetch the user's PotentialMatchPool document to get the filters and dislikes
    //const potentialMatchPool = await potentialMatchPoolsCollection.findOne({ userId: user._id });
    //// Continue if there's no PotentialMatchPool for the user
    //if (!potentialMatchPool) {
      //console.log(`No PotentialMatchPool found for user ${user._id}. Skipping.`);
      //continue;
    //}
    //// Fetch the disliked user IDs from the PotentialMatchPool document
    //const dislikedUserIds = potentialMatchPool.dislikes.map(dislike => dislike._id);

    //// Use the filters from the PotentialMatchPool document or default values if not present
    //const filters = potentialMatchPool.filters || {};
    //const ageFilter = filters.age || { min: 18, max: 100 };
    //const gameLevelFilter = filters.gameLevel || { min: 1, max: 10 };
    //const matchCriteria = {
      //_id: { $ne: user._id, $nin: [...likedUserIds, ...dislikedUserIds] },
      //age: { $gte: ageFilter.min, $lte: ageFilter.max },
      //"sport.gameLevel": { $gte: gameLevelFilter.min, $lte: gameLevelFilter.max }
    //};
    //// Fetch potential matches based on criteria
    //const potentialMatchesQuery = await usersCollection.aggregate([
      //{ $match: matchCriteria },
      //{ $sample: { size: 30 } }, // Randomly select 30 users
      //{ $project: {
          //firstName: 1,
          //imageSet: 1,
          //age: 1,
          //neighborhood: 1,
          //gender: 1,
          //sport: 1,
          //description: 1,
        //}}
    //]).toArray();
    //// Transform potential matches for the PotentialMatchPool document
    //const potentialMatchPoolData = potentialMatchesQuery.map(match => ({
      //matchUserId: match._id,
      //firstName: match.firstName,
      //imageSet: match.imageSet,
      //age: match.age,
      //neighborhood: match.neighborhood,
      //gender: match.gender,
      //sport: match.sport,
      //description: match.description,
      //createdAt: currentDate,
      //updatedAt: currentDate,
      //interacted: false
    //}));

    //// Upsert PotentialMatchPool document for the user
    //await potentialMatchPoolsCollection.updateOne(
      //{ userId: user._id },
      //{
        //$set: {
          //userId: user._id,
          //potentialMatches: potentialMatchPoolData,
          //swipesPerDay: 30,
          //lastUpdated: currentDate
        //}
      //},
      //{ upsert: true }
    //);
  //}
  //console.log("Potential match pools updated for all users, excluding already liked and disliked.");
//};

