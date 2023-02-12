import _ from "lodash";
export const filterMatches = (squash) => {
  const matches = squash.matches;
  // tesing with 1 day
  //const ChatTimer = 8.64e+7
  //ideally 14 days
  const ChatTimer = 1.21e+9
  //test with 30 minutes
  //const ChatTimer = 1.8e6;
  const new_matches = _.filter(matches, (match) => {
    const unixTime = match.createdAt;
    const isArchived = match.archived;
    if (Date.now() - unixTime > ChatTimer || isArchived) {
      //const params = {
      // these chats are archived
      return false;
    } else {
      // else we have new amd recent chats
      return true;
    }
  });
  squash.matches = new_matches
  return squash
};
export const updateArchiveMatches = (squash) => {
  const matches = squash.matches;
  // tesing with 1 day
  //const ChatTimer = 8.64e+7
  //ideally 14 days
  const ChatTimer = 1.21e+9
  //test with 30 minutes
  //const ChatTimer = 1.8e6;
  const new_matches = _.filter(matches, (match) => {
    const unixTime = match.createdAt;
    const isArchived = match.archived;
    if (Date.now() - unixTime > ChatTimer || isArchived) {
      //const params = {
      // these chats are archived
      return false;
    } else {
      // else we have new amd recent chats
      return true;
    }
  });
  squash.matches = new_matches
  return squash
};
