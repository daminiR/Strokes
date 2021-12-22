import _ from 'lodash'

const calculateOfflineMatches = (user) => {
    const likes =  user.likes
    const likedByUSers =  user.likedByUSers
    const totalMatches = _.intersectionBy(likes, likedByUSers, '_id')
    return totalMatches

}

export {calculateOfflineMatches}
