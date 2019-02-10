import { ObjectType, Field } from "type-graphql";
import { ObjectIdScalar } from "../scalars/ObjectId";
import { ObjectId } from "mongodb";
import User from "./user";

@ObjectType({description: 'Workspace Object'})
export default class Workspace{
  @Field(() => ObjectIdScalar, {nullable: false, description: 'Workspace _id(ObjectId)'})
  _id: ObjectId
  @Field(() => User, {nullable: false, description: 'Owner information(User)'})
  owner: User
  @Field(() => [User], {nullable: false, description: 'Participant list([User])'})
  participants: [User]
}