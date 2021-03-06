import { Schema, Document } from 'mongoose'

export const UserSchema = new Schema({
  id: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: false },
  emailVerificationStatus: { type: Boolean, default: false },
  workspace: { type: Schema.Types.ObjectId, ref: 'Workspace' },
  friend: [{ type: Schema.Types.ObjectId, ref: 'User' }]
})

export interface IUser extends Document {
  _id: Schema.Types.ObjectId
  id: string
  password: string
  name: string
  email: string
  emailVerificationStatus: boolean
  workspace: Schema.Types.ObjectId
  friend: [Schema.Types.ObjectId]
}