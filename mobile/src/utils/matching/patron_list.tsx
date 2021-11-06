import {difference, union} from 'lodash'
import {sanitizeCard} from './swipeFuntions'
import _ from 'lodash'
import {PatronListType, Sport, ImageSetT} from '../../localModels/UserSportsList'

//const createPatronList = (allUsers, likes, dislikes, i_blocked, blocked_me, matches)=>{
export const patronCard = (card) => {
    let sports  = _.map(card.sports, (sportObj) => {
      return _.omit(sportObj, '__typename') as Sport;
    })
     let image_set  = _.map(card.image_set, (imageObj) => {
    const extended = _.extend({"filePath" : "temp"}, imageObj)
    return _.omit(extended, '__typename') as ImageSetT;
    })
    //const sports = card.sports
    console.log("sportssssssssssss",  sports)
    const  potentialMatch: PatronListType= {
       "first_name": card.first_name,
       "age": card.age,
       "_id": card._id,
       "gender": card.gender,
       "sports": sports,
       "description": card.description,
       "image_set": image_set,
       "likes": card.likes
   }
    return potentialMatch
}
const createPatronList = (allUsers, likes, dislikes, matches) => {
    const activeUsers = _.map(allUsers, (card) => {return patronCard(card)})
    console.log("////// activeUsers", activeUsers)
    const exclude = _.concat(likes, dislikes, matches)
    const patron_list = _.differenceBy(activeUsers, exclude, '_id')
    return patron_list
}
export {createPatronList}
