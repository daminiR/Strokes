import {difference, union} from 'lodash'
// query likes and dislikes
// substract from all users



const createPatronList = (activeUsers, likes, dislikes, i_blocked, blocked_me, matches)=>{
// try to things one with mutlpl earray one with single array
    //const patron_list = difference(activeUsers, [likes, dislikes, i_blocked, blocked_me])
// thi si ssafer
    const to_exclude = union(likes, dislikes, i_blocked, blocked_me)
    const patron_list = difference(activeUsers, to_exclude)
    return patron_list
}
export {createPatronList}
