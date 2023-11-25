import { IReserved } from "../../models"


type CreateSuggestionArgs = {
  currentReservation: IReserved
}

export async function createSuggestion(args: CreateSuggestionArgs) {
  const {currentReservation} = args
  if(currentReservation.reservedFrom && currentReservation.duration){
  }
    
}