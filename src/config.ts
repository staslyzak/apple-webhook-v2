import dotenv from 'dotenv'

dotenv.config()

const generateBasicToken = (username, password) =>
  Buffer.from(`${username}:${password}`).toString('base64')

const {
  PORT = 3001,
  ZENDESK_URL,
  ZENDESK_LOGIN,
  ZENDESK_PASSWORD,
  SMOOCH_KEY_ID,
  SMOOCH_SECRET,
  WEBHOOK_SECRET,
} = process.env

export default {
  PORT,
  WEBHOOK_SECRET,
  ZENDESK_URL,
  SMOOCH_URL: 'https://api.smooch.io',
  ZENDESK_TOKEN: generateBasicToken(ZENDESK_LOGIN, ZENDESK_PASSWORD),
  SMOOCH_TOKEN: generateBasicToken(SMOOCH_KEY_ID, SMOOCH_SECRET),
}
