import { ObjectType, Field } from "type-graphql";
import { IsEmail } from "class-validator";
import { ObjectIdScalar } from "../scalars/ObjectId";
import { ObjectId } from "mongodb";

@ObjectType({description:'Represent User Infomation'})
export default class User{
    @Field(() => ObjectIdScalar, {nullable: false, description: 'User Object Id'})
    readonly _id!: ObjectId
    @Field(() => String, {nullable: false, description: 'User Id'})
    id!: string
    @Field(() => String, {nullable: false, description: 'User Password'})
    password!: string
    @Field(() => String, {nullable: false, description: 'User Name'})
    name!: string
    @IsEmail()
    @Field(() => String, {nullable: true, description: 'User Eamil'})
    email?: string
}