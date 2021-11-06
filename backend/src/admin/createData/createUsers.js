import crypto from 'crypto'
const numUsers = 2
for (let i = 0; i < numUsers; i++){

const _id = crypto.randomBytes(64).toString('hex')
const first_name = crypto.randomBytes(64).toString('hex')
    console.log(first_name)

}
