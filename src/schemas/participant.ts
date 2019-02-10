import { Schema, Document } from 'mongoose'

export const ParticipantSchema = new Schema({
  id: { type: String, required: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: false },
  workspace: { type: Schema.Types.ObjectId, ref: 'Workspace' },
  friend: [{ type: Schema.Types.ObjectId, ref: 'User' }]
})

export interface IParticipant extends Document {
  _id: Schema.Types.ObjectId
  id: string
  password: string
  name: string
  email: string
  workspace: Schema.Types.ObjectId
  friend: [Schema.Types.ObjectId]
}