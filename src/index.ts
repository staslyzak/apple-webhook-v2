import express from 'express'

import config from './config'
import {triggers} from './triggers'

const app = express()

console.log('IN', JSON.stringify(config, null, 2))

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use((req, res, next) => {
  if (req.headers['x-api-key'] === config.WEBHOOK_SECRET) {
    next()
  } else {
    const response = {
      status: 403,
      message: 'Unauthorized',
    }

    console.log('IN', JSON.stringify(response, null, 2))
    return res.status(response.status).json(response)
  }
})

app.post('/', async (req, res) => {
  try {
    const triggerType = req.body.events[0].type
    const {handler, extractData} = triggers[triggerType]
    const extractedData = await extractData(req.body)

    console.log(
      'IN',
      JSON.stringify(
        {
          trigger: triggerType,
          ...extractedData,
        },
        null,
        2,
      ),
    )

    const response = await handler(extractedData)

    console.log('OUT', JSON.stringify(response, null, 2))

    res.json(response)
  } catch {
    const response = {
      status: 400,
      message: 'Invalid trigger',
    }

    console.log('OUT', JSON.stringify(response, null, 2))
    res.status(response.status).json(response)
  }
})

app.post('/auth', (req, res) => {
  const response = {
    status: 400,
    message: 'Not implemented',
  }

  res.status(response.status).json(response)
})

app.listen(config.PORT, () => console.log(`Server is up`))
