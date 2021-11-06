import { dislikesVar, likesVar} from '../../cache'
import {MAX_LIKES, MAX_DISLIKES} from '../../constants'
import _ from 'lodash'
import {PotentialMatchType, Sport, ImageSetT} from '../../localModels/UserSportsList'

    //Have a separate bloom filter to check if it is a match ... there can be false positives but since the majority will be 'not matched yet' this will save a lot of database queries
    //If it is not a match yet and you need to store the swiped up data entry, keep multiple such entries in memory/redis for a while and then bulk insert in the database
    //update bloom filter real-time (Note: there could be a momentary mismatch between bloom and database till the bulk insert is done.)


      //////squashItemsVar([...squashItems, data.createSquash._id])
export const sanitizeCard = (card) => {
    let sports  = _.map(card.sports, (sportObj) => {
      return _.omit(sportObj, '__typename') as Sport;
    })
     let image_set  = _.map(card.image_set, (imageObj) => {
    const extended = _.extend({"filePath" : "temp"}, imageObj)
    return _.omit(extended, '__typename') as ImageSetT;
    })
    //const sports = card.sports
    console.log("sportssssssssssss",  sports)
    const  potentialMatch: PotentialMatchType= {
       "first_name": card.first_name,
       "age": card.age,
       "_id": card._id,
       "gender": card.gender,
       "sports": sports,
       "description": card.description,
       "image_set": image_set
   }
    return potentialMatch
}
const swipeRightLiked = async (currentUser,_id, card, updateLikes, updateMatches) => {
    // push all ids when likes or dislikes and bulk send mutation

    // if potential match likes current user upsert a match array

    // update mutation for both users
    const matchUSerLikedIDs = _.find(card.matches, match => { return match._id})
    console.log("////// card //////", card)
    if (_.includes(card.matches, currentUser._id)){
        console.log("included")
    //const userMatchingData = sanitizeCard(currentUser)
    //const matchedUser = sanitizeCard(card)
    //updateMatches(_id, card._id, userMatchingData, matchedUser)
    }

    console.log("////////log//////", _id)
    var array = likesVar()
    if (array.length  == MAX_LIKES){
        // update mutation for likes
        updateLikes({variables: {
            _id: _id,
            likes: array
        }})
        array = []
    }
    const potentialMatch = sanitizeCard(card)
    array.push(potentialMatch)
    likesVar(array)
    console.log(likesVar())
}
const swipeLeftDisliked = async (_id, card, updateDislikes) => {
    // push all ids when likes or dislikes and bulk send mutation
    var array = dislikesVar()
    if (array.length  == MAX_DISLIKES){
        //update mutation for dislikes
        updateDislikes({variables: {
            _id: _id,
            dislikes: array
        }})
        array = []
    }
    const potentialMatch = sanitizeCard(card)
    array.push(potentialMatch)
    dislikesVar(array)
    console.log(dislikesVar())
}
export {swipeLeftDisliked, swipeRightLiked}
