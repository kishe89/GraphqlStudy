import { Resolver, Query, Arg, Mutation, InputType, Args, FieldResolver, Root, Ctx, Authorized } from 'type-graphql'
import User from '../objects/user'
import { models, Model } from 'mongoose'
import { IUser } from '../schemas/user'
import InputUser from '../argument_objects/InputUser';
import ModifyUser, { ArgsUser } from '../argument_objects/ModifyUser';
import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
import { IWorkspace } from '../schemas/workspace';
import Workspace from '../objects/workspace';
import { ApolloContextInterface } from '../context/ApolloContext';
import { ApolloError } from 'apollo-server-core';
import bcrypt from 'bcrypt'
dotenv.config()
@Resolver(() => User)
export default class UserResolver {
  readonly users: Model<IUser> = models.User
  readonly workspaces: Model<IWorkspace> = models.Workspace
  @Authorized()
  @Query(returns => User, { nullable: true, description: 'Find One User' })
  async user(@Arg('id') id: String, @Ctx() apolloContext: ApolloContextInterface): Promise<User | null> {
    return await this.users.findOne({ id }).lean()
  }
  @Query(returns => String, { nullable: true, description: 'Find One User' })
  async signIn(@Arg('id') id: String,
    @Arg('password') password: String,
    @Ctx() apolloContext: ApolloContextInterface): Promise<String> {
    const user = await this.users.findOne({ id })
      .select(['_id', 'id', 'password','email', 'name', 'emailVerificationStatus'])
      .lean()
    const verified = await bcrypt.compare(password,user.password)
    if(!verified){
      throw new ApolloError('Invalid Password')
    }
    const token = await apolloContext.jwt.sign(user, apolloContext.JWT_SECRET_KEY)
    return token
  }
  @FieldResolver(returns => Workspace, { nullable: true, description: 'User\'s workspace' })
  async workspace(@Root() user: User): Promise<Workspace> {
    return await this.workspaces.findOne({ 'owner._id': user._id }).lean()
  }
  @Mutation(returns => User, { nullable: false, description: 'Create User' })
  async signUp(@Arg('user') user: InputUser): Promise<User> {
    let savedUser
    let workspace
    try {
      const encryptedPassword = await bcrypt.hash(user.password, 14)
      user.password = encryptedPassword
      savedUser = await this.users.create({ ...user })
    } catch (e) {
      console.log('user')
      throw e
    }

    try {
      workspace = await this.workspaces.create({ owner: savedUser.toObject() })
    } catch (e) {
      console.log('workspace')
      throw e
    }

    savedUser.workspace = workspace._id
    console.log(workspace._id)
    const updatedUser = await savedUser.save()
    return updatedUser.toObject()
  }
  @Mutation(returns => User, { nullable: false, description: 'Modify User' })
  async modifyUser(@Args() { _id }: ArgsUser, @Arg('modify') modify: ModifyUser): Promise<User> {
    return await this.users.findOneAndUpdate({ _id }, { $set: { ...modify } }, { new: true }).lean()
  }
  @Query(returns => Boolean, { nullable: false, description: 'Modify User' })
  async authEmail(@Arg('token') token: String, @Ctx() { jwt, JWT_SECRET_KEY }: ApolloContextInterface): Promise<boolean> {
    const verified = jwt.verify(token, JWT_SECRET_KEY)
    if (verified) {
      const user = await this.users.findOneAndUpdate({ _id: verified._id },
        { $set: { emailVerificationStatus: true } },
        { new: true })
        .lean()
      if (!user) {
        throw new ApolloError('Not Found User')
      }
      return true
    }
    throw new ApolloError('Invalid Token. please retry sendEmail')
  }
  @Query(returns => Boolean, { nullable: false, description: 'Email Send' })
  async sendEmail(@Args() { _id }: ArgsUser, @Ctx() { jwt, JWT_SECRET_KEY }: ApolloContextInterface): Promise<Boolean> {
    const user = await this.users.findOne({ _id }).lean()
    const token = jwt.sign(user, JWT_SECRET_KEY)
    const encodedToken = encodeURI('"' + token + '"')
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
      html: '<h3>내 서비스</h3>' +
        '<a href = "http://localhost:3000/graphql?query=query {authEmail(token:' + encodedToken + ')}">' +
        'http://localhost:3000/graphql?query=query {authEmail(token:' + encodedToken + ')}</a>'
    })
    return sendResult.accepted.length > 0
  }
}