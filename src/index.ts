import express from 'express'

import config from './config'
import {triggers} from './triggers'

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.post('/', (req, res) => {
  // console.log('req.body', JSON.stringify(req.body, null, 2))
  // console.log('req.headers', req.headers)

  try {
    const triggerType = req.body.events[0].type
    console.log('user.id', req.body.events[0].payload.user.id)
    triggers[triggerType](req, res)
  } catch {
    console.log('Invalid trigger')
    res.status(400).json({message: 'Invalid trigger'})
  }
})

app.post('/auth', (req, res) => {
  res.status(400).json({message: 'Not implemented'})
})

app.listen(config.PORT, () =>
  process.env.NODE_ENV === 'development'
    ? console.log(`Server listens at http://localhost:${config.PORT}`)
    : null,
)
