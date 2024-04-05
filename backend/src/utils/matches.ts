import _ from "lodash";
import { CHAT_TIMER } from "../constants";
export const filterMatches = (squash) => {
  const matches = squash.matches;
  const new_matches = _.filter(matches, (match) => {
    const unixTime = match.createdAt;
    const isArchived = match.archived;
    if (Date.now() - unixTime > CHAT_TIMER || isArchived) {
      return false;
    } else {
      return true;
    }
  });
  squash.matches = new_matches
  return squash
};
export const updateArchiveMatches = (squash) => {
  const matches = squash.matches;
  const ChatTimer = 1.21e+9
  const new_matches = _.filter(matches, (match) => {
    const unixTime = match.createdAt;
    const isArchived = match.archived;
    if (Date.now() - unixTime > ChatTimer || isArchived) {
      return false;
    } else {
      return true;
    }
  });
  squash.matches = new_matches
  return squash
};
