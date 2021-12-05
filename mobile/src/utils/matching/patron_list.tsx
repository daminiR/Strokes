import {difference, union} from 'lodash'
import {sanitizeCard} from './swipeFuntions'
import _ from 'lodash'
import {PatronListType, Sport, ImageSetT} from '../../localModels/UserSportsList'
import { sportsList, defaultGameLevel, defaultAgeRange} from '../../constants'
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
       "likes": card.likes,
       "location": card.location
   }
    return potentialMatch
}

const filterByFieldsByUser = ({patron_list, filterBySport, filterByAge = defaultAgeRange, filterByGameLeve = defaultGameLevel}) => {
    // filter by sport
    //console.log("all sport filter before", patron_list)
    //filterBySport = 'Tennis'
    //filterByGameLeve = [1]
    //filterBySport = null
    const filterFunctionSport = (matchObj) => {
        const isSportInUser = _.some(matchObj.sports, (sportObj) => {
            if (filterBySport == null) {
              return true;
            } else {
                const sportIncluded = sportObj.sport == filterBySport
                const gameLevelIncluded = _.includes(filterByGameLeve, sportObj.game_level)
              return sportIncluded && gameLevelIncluded
            }
        })
        const isUserInAgeRange = matchObj.age >= filterByAge.minAge && matchObj.age <= filterByAge.maxAge
        return isSportInUser && isUserInAgeRange
    }
    const moreFilter = _.filter(patron_list, filterFunctionSport)
    console.log("all sport filter", moreFilter)
    console.log( "valeu", _.includes([1, 2, 3], 1))
    return moreFilter
}
const filterByCity = (currentUseLocation, patron_list) => {
    // TODO: refine overtime
    const newPatronList = _.filter(patron_list, _.iteratee({"location":{"city": currentUseLocation.city, "state": currentUseLocation.state}}))
    return newPatronList
}
const createPatronList = (currentUseLocation, allUsers, likes, dislikes, matches) => {
    const activeUsers = _.map(allUsers, (card) => {return patronCard(card)})
    const exclude = _.concat(likes, dislikes, matches)
    const patron_list = _.differenceBy(activeUsers, exclude, '_id')
    const newPatronList = filterByCity(currentUseLocation, patron_list)
    // test//
    //const trial = filterByFieldsByUser({patron_list : patron_list})
    return newPatronList
}
export {createPatronList}
