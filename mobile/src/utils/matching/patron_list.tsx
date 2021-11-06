import {difference, union} from 'lodash'
import {sanitizeCard} from './swipeFuntions'
import _ from 'lodash'
import {PotentialMatchType, Sport, ImageSetT} from '../../localModels/UserSportsList'

//const createPatronList = (allUsers, likes, dislikes, i_blocked, blocked_me, matches)=>{
const createPatronList = (allUsers, likes, dislikes, matches) => {
    const activeUsers = _.map(allUsers, (card) => {return sanitizeCard(card)})
    console.log("////// dilikes", dislikes)
    const exclude = _.concat(likes, dislikes, matches)
    const patron_list = _.differenceBy(activeUsers, exclude, '_id')
    return patron_list
}
export {createPatronList}
