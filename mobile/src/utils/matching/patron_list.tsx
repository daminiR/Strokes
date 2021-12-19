import {difference, union} from 'lodash'
import {sanitizeCard} from './swipeFuntions'
import _ from 'lodash'
import {PatronListType, Sport, ImageSetT} from '../../localModels/UserSportsList'
import { sportsList, defaultGameLevel, defaultAgeRange} from '../../constants'

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
       "likes": card.likes,
       "location": card.location
   }
    return potentialMatch
}

const filterByFieldsByUser = (patron_list, filters) => {
    //TODO: to maintain structure cange gamelevel backend to match filter gamelevel style
    const filterBySport = _.find(filters.sportFilters, sportObj => {return sportObj.filterSelected == true}).sport
    console.log("sport in retrive ",filterBySport)
    console.log("filterbysport",filterBySport)
    const filterByAge = filters.ageRange
    console.log("filter by age",filterByAge)
    const filterByGameLevel = Object.entries(filters.gameLevels).map(
      ([key, value]) => {
        switch (key) {
          case 'gameLevel0': {
            if (value == true) {
              return 0;
            }
          }
          case 'gameLevel1': {
            if (value == true) {
              return 1;
            }
          }
          case 'gameLevel2': {
            if (value == true) {
              return 2;
            }
          }
        }
      },
    );
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
    console.log("aa///////", moreFilter)
    return moreFilter
}
const filterByCity = (currentUseLocation, patron_list) => {
    // TODO: refine overtime
    const newPatronList = _.filter(patron_list, _.iteratee({"location":{"city": currentUseLocation.city, "state": currentUseLocation.state}}))
    return newPatronList
}
const createPatronList = (currentUseLocation, allUsers, likes, dislikes, matches, filters) => {
    const activeUsers = _.map(allUsers, (card) => {return patronCard(card)})
    const exclude = _.concat(likes, dislikes, matches)
    const patron_list = _.differenceBy(activeUsers, exclude, '_id')
    const newPatronList = filterByCity(currentUseLocation, patron_list)
    const newPatronList2 = filterByFieldsByUser(newPatronList, filters)
    return newPatronList2
}
export {createPatronList}
