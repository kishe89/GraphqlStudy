import { Resolver, Query, Arg, Mutation, InputType, Args } from 'type-graphql'
import User from '../objects/user'
import { models, Model } from 'mongoose'
import { IUser } from '../schemas/user'
import InputUser from '../argument_objects/InputUser';
import ModifyUser, { ArgsUser } from '../argument_objects/ModifyUser';
import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config()
@Resolver()
export default class UserResolver {
    readonly users: Model<IUser> = models.User
    @Query(returns => User, { nullable: true, description: 'Find One User' })
    async user(@Arg('id') id: String): Promise<User | null> {
        return await this.users.findOne({ id }).lean()
    }
    @Mutation(returns => User, { nullable: false, description: 'Create User' })
    async signUp(@Arg('user') user: InputUser): Promise<User> {
        const savedUser = await this.users.create({ ...user })
        return savedUser.toObject()
    }
    @Mutation(returns => User, { nullable: false, description: 'Modify User' })
    async modifyUser(@Args() { _id }: ArgsUser, @Arg('modify') modify: ModifyUser): Promise<User> {
        return await this.users.findOneAndUpdate({ _id }, { $set: { ...modify } }, { new: true }).lean()
    }
    @Query(returns => Boolean, { nullable: false, description: 'Email Send' })
    async sendEmail(@Args() { _id }: ArgsUser): Promise<Boolean> {
        const user = await this.users.findOne({_id}).lean()
        const transport = nodemailer.createTransport({
            service: 'Gmail',
            secure: true,
            auth: {
                type: 'OAuth2',
                user: process.env.GMAIL_ID,
                clientId: process.env.GMAIL_CLIENT_ID,
                clientSecret: process.env.GMAIL_CLIENT_SECRET,
                refreshToken: process.env.GMAIL_REFRESH_TOKEN,
                accessToken: process.env.GMAIL_ACCESS_TOKEN,
                expires: 3600
            }
        })
        const sendResult = await transport.sendMail({
            from: {
                name: '인증관리자',
                address: process.env.GMAIL_ID
            },
            subject: '내 서비스 인증 메일',
            to: [user.email],
            text: 'Hello World'
        })
        return sendResult.accepted.length>0
    }
}