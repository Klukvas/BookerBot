import { generateTelegramMessage } from "../core/generate-telegram-message";
import { sendRequestToBot } from "../infra/send-request-to-bot";
import { TestRequest } from "../types/request";

type ExpectedList = {
    expectedText?: never;
    expectedTextList: string[];
  };
  
  type ExpectedText = {
    expectedText: string;
    expectedTextList?: never;
  };
  
  type SendUserResponseToBotArgs = {
    userMessage: string;
  } & TestRequest & (ExpectedList | ExpectedText);

  
export async function sendUserResponseToBot(args: SendUserResponseToBotArgs) {
    const {request, userMessage, expectedTextList, expectedText} = args
  const message = generateTelegramMessage({messageText: userMessage})
  const {response, repliedMessage} = await sendRequestToBot({request, message: message})
  if(expectedText){
    expect(repliedMessage?.trim()).toBe(expectedText)
  }else{
    for(const item of expectedTextList!){
      expect(repliedMessage).toContain(item)
    }
  }
  expect(response.statusCode).toBe(200)
    
}