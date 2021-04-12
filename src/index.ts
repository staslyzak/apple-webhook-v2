import express from 'express'

import config from './config'
import {triggers} from './triggers'

const app = express()

console.log(config)

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use((req, res, next) => {
  if (req.headers['x-api-key'] === config.WEBHOOK_SECRET) {
    next()
  } else {
    console.log('Unauthorized')
    return res.json({message: 'Unauthorized'})
  }
})

app.post('/', (req, res) => {
  try {
    const triggerType = req.body.events[0].type
    triggers[triggerType](req, res)
  } catch {
    console.log('Invalid trigger')
    res.status(400).json({message: 'Invalid trigger'})
  }
})

app.post('/auth', (req, res) => {
  res.status(400).json({message: 'Not implemented'})
})

app.listen(config.PORT, () => console.log(`Server is up`))
