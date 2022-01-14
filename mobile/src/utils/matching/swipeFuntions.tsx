import { dislikesVar, likesVar} from '../../cache'
import React from 'react'
import {MAX_DISLIKES, MAX_LIKES} from '@constants'
import _ from 'lodash'
import {PotentialMatchType, Sport, ImageSetT, LocationT} from '@localModels'
import { Card } from 'react-native-card-stack-swiper';
import {CardItem} from '../../components/CardItem/CardItem';
import {TouchableOpacity} from 'react-native';

    //Have a separate bloom filter to check if it is a match ... there can be false positives but since the majority will be 'not matched yet' this will save a lot of database queries
    //If it is not a match yet and you need to store the swiped up data entry, keep multiple such entries in memory/redis for a while and then bulk insert in the database
    //update bloom filter real-time (Note: there could be a momentary mismatch between bloom and database till the bulk insert is done.)


      //////squashItemsVar([...squashItems, data.createSquash._id])

const renderMatchCard = (card) => {
      const profileImage = card.profileImage
      const title = card.first_name +', ' + card.age
      return (
        <TouchableOpacity style={{padding: 5}}>
                <CardItem
                  profileImage={profileImage}
                  profileTitle={title}
                  variant
                />
              </TouchableOpacity>

      )
}
const renderMatches =  (card, index) => {
      const image_set_copy = card.image_set
      const min_idx_obj = image_set_copy.reduce((res, obj) => {return (obj.img_idx < res.img_idx)? obj: res})
      const image_set_copy2 = card.image_set.filter(imgObj => imgObj.img_idx != min_idx_obj.img_idx)
      const title = card.first_name +', ' + card.age
      const location = card.location.city
            return (
              <Card key={index}>
                <CardItem
                  profileImage={min_idx_obj}
                  image_set={image_set_copy2}
                  description={card.description}
                  location={location}
                  profileTitle={title}
                  sportsList={card.sports}
                  onPressLeft={() => this.swiper.swipeLeft()}
                  onPressRight={() => this.swiper.swipeRight()}
                />
              </Card>
            );
}

export const sanitizeCard = (card) => {
    let sports  = _.map(card.sports, (sportObj) => {
      return _.omit(sportObj, '__typename') as Sport;
    })
     let image_set  = _.map(card.image_set, (imageObj) => {
    const extended = _.extend({"filePath" : "temp"}, imageObj)
    return _.omit(extended, '__typename') as ImageSetT;
    })
    const  potentialMatch: PotentialMatchType= {
       "first_name": card.first_name,
       "location": _.omit(card.location, "__typename") as LocationT,
       "age": card.age,
       "_id": card._id,
       "gender": card.gender,
       "sports": sports,
       "description": card.description,
       "image_set": image_set
   }
    return potentialMatch
}
const swipeRightLiked = async (currentUser,_id, card, updateLikes, updateMatches, setMatched) => {
    // push all ids when likes or dislikes and bulk send mutation
    // if potential match likes current user upsert a match array
    // update mutation for both users
    //const matchUSerLikedIDs = _.find(card.matches, match => { return match._id})
    const userMatchingData = sanitizeCard(currentUser)
    var array = likesVar()
    const potentialMatch = card._id
    array.push(potentialMatch)
    likesVar(array)
    // test //
    updateLikes({variables: {
            _id: _id,
            likes: array,
            currentUserData: userMatchingData
        }})

    // to slow ith liks condition
    const likedByIDs = _.map(currentUser.likedByUSers, likedByObj => {return likedByObj._id})
    if (_.includes(likedByIDs, card._id)){
    const matchedUser = sanitizeCard(card)
    setMatched(true)
    updateMatches({variables: {currentUserId: _id,
                  potentialMatchId: card._id,
                  currentUser: userMatchingData,
                  potentialMatch: matchedUser}})
    }
}
const swipeLeftDisliked = async (_id, card, updateDislikes) => {
    // push all ids when likes or dislikes and bulk send mutation
    var array = dislikesVar()
    //if (array.length  == MAX_DISLIKES){
        //update mutation for dislikes
    updateDislikes({variables: {
            _id: _id,
            dislikes: array
        }})
        array = []
    //}
    const potentialMatch = card._id
    array.push(potentialMatch)
    dislikesVar(array)
    console.log(dislikesVar())
}
export {renderMatchCard, renderMatches, swipeLeftDisliked, swipeRightLiked}
