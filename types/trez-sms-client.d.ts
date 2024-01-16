declare module 'trez-sms-client' {
  import { RequestPromiseAPI } from 'request-promise'
  import { SoapClient } from 'soap'

  class TrezSMSClient {
    rp: RequestPromiseAPI
    soap: SoapClient
    username: string
    password: string
    auth: string
    baseUrl: string
    soapUrl: string

    constructor(username: string, password: string)

    autoSendCode(number: string, footer: string): Promise<string>

    manualSendCode(number: string, textWithCode: string): Promise<number>

    checkCode(number: string, userCode: string): Promise<boolean>
    getMessageStatus(code: string)
    getCodeMessage(code: number): Promise<string>
  }

  export = TrezSMSClient
}
