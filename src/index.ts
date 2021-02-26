import { TData, IAuth, IRegister, TResponses, IgetOrderStatus } from './types'
import axios, { AxiosInstance } from 'axios'
import qs from 'qs'

export class AlfaBankBy {
  axios: AxiosInstance

  #auth: IAuth = {
    token: '',
    userName: '',
    password: '',
  }

  constructor({ token, userName, password }: IAuth = {}) {
    this.#auth = Object.assign(this.#auth, { token, userName, password })
    this.axios = axios.create({})
  }

  private async request(url: string, data: Partial<TData> = {}) {
    try {
      const res = await this.axios.post(
        `https://web.rbsuat.com/ab_by${url}`,
        qs.stringify({
          ...data,
          ...this.#auth,
        })
      )

      console.log(res)

      const resp = res.data as TResponses

      if ('errorCode' in resp) {
        return {
          errorCode: resp.errorCode,
          errorMessage: resp.errorMessage,
        }
      }

      return resp
    } catch (e) {
      return {
        errorCode: 'axios',
      }
    }
  }

  async register(data: IRegister) {
    return await this.request('/rest/register.do', data)
  }

  async getOrderStatus(data: IgetOrderStatus) {
    return await this.request('/rest/getOrderStatus.do', data)
  }
}

/**
 * Функция для конвертирование в минимальных единицах
 * С учетом проблем плавающей точки
 * 10.20 - 1020
 */
export const toAmount = (value: number) => {
  return parseFloat((value * 100).toFixed(2))
}
