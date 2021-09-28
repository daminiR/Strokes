import * as crypto  from 'crypto'
import moment from 'moment'

const generateRandomString = (size) : string => {
    const random_string = '-'.concat(crypto.randomBytes(size).toString('hex'))
    return random_string
}
export const sanitizeFile = (filename: string,  _uid: string) : string => {
    const curTime = moment().format("YYYYMMDDhhmmss")
    const random_string = generateRandomString(10)
    let sanitizedName = curTime.concat(random_string)
    sanitizedName = sanitizedName.concat('-'.concat(_uid))
    sanitizedName = sanitizedName.concat('-'.concat(filename))
    return sanitizedName
}
