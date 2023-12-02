import * as sendResponseModule from "../../utils/send-response";

export class SendResponseMock{
  public spiedMessage?: string;
  public mockedSendResponse: any
  setupMock(){
    this.mockedSendResponse = jest.spyOn(sendResponseModule, 'sendResponse')
        .mockImplementation(jest.fn(async({message, chatId, expressResp}) => {
            expressResp.status(200).send('OK')
            this.spiedMessage = message
        }))
  }
  get message(){
      return this.spiedMessage
  }

  get mock(){
      return this.mockedSendResponse
  }
}

export default new SendResponseMock()