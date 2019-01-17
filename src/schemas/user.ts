import {Schema, Document} from 'mongoose'

export const UserSchema = new Schema({
    id: {type: String, required: true},
    password: {type: String, required: true},
    name: {type: String, required: true},
    email: {type: String, required: false},
    friend: [{type: Schema.Types.ObjectId, ref: 'User'}]
})

export interface IUser extends Document{
    _id: Schema.Types.ObjectId
    id: string
    password: string
    name: string
    email: string
    friend: [Schema.Types.ObjectId]
}