import { NextFunction, Request, Response } from 'express';
import { SessionData } from 'express-session';
import * as bcrypt from 'bcrypt';
import env from '../utils/core/env';

interface CustomSession extends SessionData {
  token: string;
}

export async function sessionChecker(req: {session: CustomSession}, res: Response, next: NextFunction) {
  console.log('req.session: ', req.session)
  try {
    if (req.session.token) {
      const isTokenMatching = await bcrypt.compare(env.userHardToken, req.session.token);
      console.log('isTokenMatching: ', isTokenMatching)
      if(isTokenMatching){
        next();
      }else{
        res.render('login', {errorMessage: 'token mismatch'});  
      }
    } else {
      res.render('login', {errorMessage: ''});
    }
  } catch (error) {
    console.error('Error checking session:', error);
    res.status(500).send('Internal Server Error');
  }
}
