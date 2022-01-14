import {difference, union} from 'lodash'
import {sanitizeCard} from './swipeFuntions'
import _ from 'lodash'
import {PatronListType, Sport, ImageSetT} from '@localModels'
import { sportsList, defaultGameLevel, defaultAgeRange, SWIPIES_PER_DAY_LIMIT} from '@constants'

export const patronCard = (card) => {
    let sports  = _.map(card.sports, (sportObj) => {
      return _.omit(sportObj, '__typename') as Sport;
    })
     let image_set  = _.map(card.image_set, (imageObj) => {
    const extended = _.extend({"filePath" : "temp"}, imageObj)
    return _.omit(extended, '__typename') as ImageSetT;
    })
    const  potentialMatch: PatronListType= {
       "first_name": card.first_name,
       "age": card.age,
       "_id": card._id,
       "gender": card.gender,
       "sports": sports,
       "description": card.description,
       "image_set": image_set,
       "location": card.location
   }
    return potentialMatch
}

export const byGameLevel = (gameLevels) =>{
    var filterByGameLevel = Object.entries(gameLevels).map(
      ([key, value]) => {
        switch (key) {
          case 'gameLevel0': {
            if (value == true) {
              return "0";
            }
          }
          case 'gameLevel1': {
            if (value == true) {
              return "1";
            }
          }
          case 'gameLevel2': {
            if (value == true) {
              return "2";
            }
          }
        }
      }
    )
  filterByGameLevel = _.filter(filterByGameLevel, filterObj => filterObj != null)
  return  filterByGameLevel
}
const filterByFieldsByUser = (patron_list, filters) => {
  //TODO: to maintain structure cange gamelevel backend to match filter gamelevel style --> done!
    const filterBySport = _.find(filters.sportFilters, sportObj => {return sportObj.filterSelected == true}).sport
    const filterByAge = filters.ageRange
    const filterByGameLevel = byGameLevel(filters.gameLevels)
    const filterFunctionSport = (matchObj) => {
        const isSportInUser = _.some(matchObj.sports, (sportObj) => {
            if (filterBySport == null) {
              return true;
            } else {
                const sportIncluded = sportObj.sport == filterBySport
                const gameLevelIncluded = _.includes(filterByGameLevel, sportObj.game_level)
              return sportIncluded && gameLevelIncluded
            }
        })
        const isUserInAgeRange = matchObj.age >= filterByAge.minAge && matchObj.age <= filterByAge.maxAge
        return isSportInUser && isUserInAgeRange
    }
    const moreFilter = _.filter(patron_list, filterFunctionSport)
    //const toLimit = moreFilter.length - SWIPIES_PER_DAY_LIMIT
    //return _.drop(moreFilter, toLimit )
    return moreFilter
}
const filterByCity = (currentUseLocation, patron_list) => {
    // TODO: refine overtime
    const newPatronList = _.filter(patron_list, _.iteratee({"location":{"city": currentUseLocation.city, "state": currentUseLocation.state}}))
    return newPatronList
}
const createPatronList = (currentUser, allUsers, filters) => {
  //bounded arrays will be filtered in mongodb
  //unbounded wil not be filtered for performance
    //const currentUseLocation = currentUser.location
  // TODO: add a few more of likedBYusers to get some matches started
    const swipesLeft = currentUser.swipesLeft
    const activeUsers = _.map(allUsers, (card) => {return patronCard(card)})
    const likes = currentUser?.likes ? currentUser.likes : []
    //const matches = currentUser?.matches ? currentUser.likes : []
    const dislikes = currentUser?.dislikes ? currentUser.dislikes : []
    const exclude = _.concat(likes, dislikes)
    const patron_list = _.slice(_.filter(activeUsers, userObj => !_.includes(exclude, userObj._id)), swipesLeft)
    console.log("swipes left", patron_list.length)
    //const newPatronList2 = _.slice(filterByFieldsByUser(patron_list  , filters), 0, SWIPIES_PER_DAY_LIMIT)
    //return newPatronList2
    return patron_list
}
export {createPatronList}
