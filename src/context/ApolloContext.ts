import jsonwebtoken from 'jsonwebtoken'
import User from '../objects/user';
import dotenv from 'dotenv'
dotenv.config()
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY
export const ApolloContext = async ({req}):Promise<ApolloContextInterface> =>{
  let user = undefined
  let verified = undefined
  let error = undefined
  if(req.headers.authorization){
    try{
      verified = await jsonwebtoken.verify(req.headers.authorization,JWT_SECRET_KEY)
    }catch(e){
      error = e
    }
  }
  if(verified){
    user = {
      ...verified
    }
  }
  return {
    jwt: jsonwebtoken,
    invalidToken: error,
    user: user,
    JWT_SECRET_KEY: JWT_SECRET_KEY,
    Authorization: req.headers.authorization
  }
}

export interface ApolloContextInterface{
  jwt: any
  invalidToken: Error
  user: User
  JWT_SECRET_KEY: string
  Authorization: string | undefined
}