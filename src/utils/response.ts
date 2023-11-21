// export class Response{

//     protected status: number
//     protected response: string
//     protected sendResponse: boolean

//     constructor(status: number, response: string, sendResponse?: boolean = true){
//         this.status = status
//         this.response = response
//         this.sendResponse = sendResponse
//     }
// }

type BuildResponseContinueArgs = {
    sendResponse?: true
    status?: number
    responseMessage: string
}
type BuildResponseSendArgs = {
    sendResponse: false
    status: never
    responseMessage: never
}

type BuildResponseContinueResult = {
    sendResponse: true
    responseData: {
        status: number
        responseMessage: string
    }
}
type BuildResponseSendResult = {
    sendResponse: false
}
type BuildResponseArgs = BuildResponseContinueArgs | BuildResponseSendArgs

type BuildResponseResult = BuildResponseContinueResult | BuildResponseSendResult

export function buildResponse(args: BuildResponseArgs): BuildResponseResult {
    const {
        responseMessage = '', 
        status = 200, 
        sendResponse = true
    } = args
    if(sendResponse){
        return {
            sendResponse: sendResponse,
            responseData:{
                status: status,
                responseMessage: responseMessage
            }
        }
    }
    return {sendResponse: sendResponse}
     
}