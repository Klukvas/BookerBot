import express, { Express } from "express";
import Env from './env';
import telegramNewMessageRouter from '../../routers/telegram'
import logger from './logger'
import connectToDb from "./db";

class App{
  
  public app: Express
  public env: typeof Env

  constructor(){
    this.env = Env
    this.app = express()
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use('/', telegramNewMessageRouter)
  }

  listen(){
    this.app.listen(this.env.port, async () => {
      logger.info(`App is running at http://localhost:${this.env.port}`);
      await connectToDb();
    });
  }
}

export default App
