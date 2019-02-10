import { Resolver, Query, Mutation, Arg } from "type-graphql";
import Workspace from "../objects/workspace";
import { IWorkspace } from "../schemas/workspace";
import { models, Model } from "mongoose";
import { ObjectId } from "mongodb";
import { IUser } from "../schemas/user";

@Resolver(() => Workspace)
export default class WorkspaceResolver {
  readonly _workspace: Model<IWorkspace> = models.Workspace
  readonly _user: Model<IUser> = models.User
  @Query(() => Workspace, { nullable: false, description: 'Workspace Query' })
  async workspace(): Promise<Workspace> {
    return await this._workspace.find({}).lean()
  }
  @Mutation(() => Workspace, { nullable: false, description: 'Add Participant to Workspace' })
  async addParticipant(@Arg('user') _id: ObjectId, @Arg('workspace') w_id: ObjectId): Promise<Workspace> {
    const user = await this._user.findOne({ _id }).lean()
    const workspace = await this._workspace
      .findOneAndUpdate({ _id: w_id }, { $addToSet: { participants: user } }, { new: true })
      .lean()
    return workspace
  }
}