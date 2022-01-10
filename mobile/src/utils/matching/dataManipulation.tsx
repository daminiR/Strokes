import _ from 'lodash'

const calculateOfflineMatches = (user) => {
    // here me out this needs to be tested but, offline matches will be the same as matches field. beacuse if the current user likes first
    // and then the matched user likes offline then matches field for both users are upserted, you cana get away with calling just matches -> test it htouhg
    //const dislikeIDs =  user.dislikes
    //const likedByUSers = user.likedByUSers
    //const trial = _.chain(likedByUSers).keyBy('_id').at(likesIds).filter().value()
    // if a user unmatches then it should be likedByusers - dislikes (why show disliked by user to the user again)
    //const matches = user.matches
    //console.log("trial",matches)
    //const trial = _.filter(matches, match => _.includes(dislikeIDs, match._id ))
    //console.log("trial", trial)
    //const trial = _.chain(likedByUSers).keyBy('_id').at(likesIds).filter().value()
    return user.matches

}

export {calculateOfflineMatches}
