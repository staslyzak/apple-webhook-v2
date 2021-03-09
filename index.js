require('dotenv').config()
const express = require('express')
const axios = require('axios')
const bodyParser = require('body-parser')

const {extractData, generateBasicToken} = require('./utils')

const app = express()

const {
  PORT = 3000,
  ZENDESK_URL,
  ZENDESK_LOGIN,
  ZENDESK_PASSWORD,
  SMOOCH_KEY_ID,
  SMOOCH_SECRET,
} = process.env

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

app.post('/', async (req, res) => {
  console.log(req.body)
  const {ticketId, userId, appId, appUserId} = extractData(req.body)

  res.status(200).json({message: 'Sucess'})
})

app.listen(PORT, () =>
  console.log(`Dev server listen as http://localhost:${PORT}`),
)
