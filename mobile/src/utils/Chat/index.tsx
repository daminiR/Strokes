
const createMessageObject = (messageObj, currentUserID, matchedUserProfileImage) => {
console.log("mesobj", matchedUserProfileImage)
 const messageInitiator = messageObj.sender == currentUserID ? 1 : 2
 const sanitized = {
   _id: messageObj._id,
   text: messageObj.text,
   user: {
     _id: messageInitiator,
     avatar: matchedUserProfileImage,
   }
 }
  //console.log("sinitized", sanitized)
 return sanitized;
}

export {createMessageObject}
