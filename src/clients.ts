import axios from 'axios'
import config from './config'

export const smoochClient = axios.create({
  baseURL: `${config.SMOOCH_URL}`,
})

smoochClient.defaults.headers.common['Content-Type'] = 'application/json'
smoochClient.defaults.headers.common.Authorization = `Basic ${config.SMOOCH_TOKEN}`

export const zendeskClient = axios.create({
  baseURL: `${config.ZENDESK_URL}/api/v2`,
})

zendeskClient.defaults.headers.common['Content-Type'] = 'application/json'
zendeskClient.defaults.headers.common.Authorization = `Basic ${config.ZENDESK_TOKEN}`
