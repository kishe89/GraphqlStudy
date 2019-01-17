import { InputType, Field } from "type-graphql";

@InputType({description: 'Required properties to create User Object'})
export default class InputUser{
    @Field(() => String, {nullable: false, description: 'User id'})
    id!:string
    @Field(() => String, {nullable: false, description: 'User password'})
    password!:string
    @Field(() => String, {nullable: false, description: 'User email'})
    email!:string
    @Field(() => String, {nullable: false, description: 'User name'})
    name!:string
}
