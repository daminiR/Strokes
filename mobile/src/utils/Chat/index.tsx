
const createMessageObject = (messageObj, currentUserID, matchedUserProfileImage) => {
 const messageInitiator = messageObj.sender == currentUserID ? 1 : 2
 const sanitized = {
   _id: messageObj._id,
   text: messageObj.text,
   user: {
     _id: messageInitiator,
     avatar: matchedUserProfileImage,
   }
 }
 return sanitized;
}

export {createMessageObject}
