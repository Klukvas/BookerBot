import express, { Express } from "express";
import Env from './env';
import telegramNewMessageRouter from '../../routers/telegram'
import logger from './logger'
import connectToDb from "./db";
import path from "path";
import adminRouter from "../../routers/admin";
import bodyParser from "body-parser"
class App{
  
  public app: Express
  public env: typeof Env

  constructor(){
    this.env = Env
    this.app = express()
    this.app.use(express.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(bodyParser.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.set("views", 'src/public');
    this.app.use(express.static('src/public'));
    this.app.set('view engine', 'ejs');
    this.app.use('/', telegramNewMessageRouter)
    this.app.use('/admin', adminRouter)
  }

  listen(){
    this.app.listen(this.env.port, async () => {
      logger.info(`App is running at http://localhost:${this.env.port}`);
      await connectToDb();
    });
  }
}

export default App
