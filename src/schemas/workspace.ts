import { Schema, Document } from "mongoose";
import { IParticipant, ParticipantSchema } from "./participant";

export const WorkspaceSchema = new Schema({
  owner: { type: ParticipantSchema, required: true },
  participants: [{ type: ParticipantSchema }],
})

export interface IWorkspace extends Document {
  owner: IParticipant
  participants: [IParticipant]
}