import { InputType, Field, ArgsType } from "type-graphql";
import { ObjectIdScalar } from "../scalars/ObjectId";
import { ObjectId } from "mongodb";
import { IsEmail } from "class-validator";
@ArgsType()
export class ArgsUser {
    @Field(() => ObjectIdScalar, { nullable: false, description: 'User _id(ObjectId)' })
    _id: ObjectId
}
@InputType({ description: 'Required properties to create User Object' })
export default class ModifyUser {
    @Field(() => String, { nullable: true, description: 'User password' })
    password!: string
    @Field(() => String, { nullable: true, description: 'User email' })
    email!: string
    @Field(() => String, { nullable: true, description: 'User name' })
    name!: string
}
