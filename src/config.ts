import dotenv from 'dotenv'

dotenv.config()

const generateBasicToken = (username, password) =>
  Buffer.from(`${username}:${password}`).toString('base64')

const {
  PORT = 3000,
  ZENDESK_URL,
  ZENDESK_LOGIN,
  ZENDESK_PASSWORD,
  SMOOCH_KEY_ID,
  SMOOCH_SECRET,
} = process.env

export default {
  PORT,
  ZENDESK_URL,
  SMOOCH_URL: 'https://api.smooch.io',
  ZENDESK_TOKEN: generateBasicToken(ZENDESK_LOGIN, ZENDESK_PASSWORD),
  SMOOCH_TOKEN: generateBasicToken(SMOOCH_KEY_ID, SMOOCH_SECRET),
}
