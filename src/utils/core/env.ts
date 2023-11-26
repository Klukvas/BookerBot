import dotenv from 'dotenv'

class Env{
  protected readonly _dbName: string
  protected readonly _dbUrl: string
  protected readonly _maxReservationHours: number
  protected readonly _maxReservationPerUser: number
  protected readonly _port: string
  
  constructor(){
    dotenv.config();
    this._dbName = process.env.DB_NAME || 'MissClickReservation'
    this._dbUrl = process.env.DB_URL || 'mongodb://localhost:27017'
    this._maxReservationHours = Number(process.env.MAX_RESERVATION_HOURS) || 12
    this._maxReservationPerUser = Number(process.env.MAX_RESERVARION_PER_USER) || 2
    this._port = process.env.PORT || '3000'
  }

  get dbName(){return this._dbName}
  
  get port(){return this._port}

  get dbUrl(){return this._dbUrl}

  get maxReservationHours(){return this._maxReservationHours}

  get maxReservationPerUser(){return this._maxReservationPerUser}
}

export default new Env();
