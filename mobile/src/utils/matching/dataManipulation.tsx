import _ from 'lodash'

const calculateOfflineMatches = (user) => {
    const likesIds =  user.likes
    const likedByUSers = user.likedByUSers
    const trial = _.chain(likedByUSers).keyBy('_id').at(likesIds).filter().value()
    return trial

}

export {calculateOfflineMatches}
