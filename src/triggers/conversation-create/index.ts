import {smoochClient} from '../../clients'
import {extractData} from './extract-data'

export const handler = async (req, res) => {
  const {
    appId,
    appUserId,
    intent: externalId,
    conversationId,
  } = await extractData(req.body)

  let user = null

  console.log({appId, appUserId, externalId, conversationId})

  if (!externalId) {
    console.log('Invalid intent')
    return res.json({message: 'Invalid intent'})
  }

  try {
    const {data} = await smoochClient(`/v2/apps/${appId}/users/${externalId}`)

    user = data.user
    console.log('Use existing user')
  } catch (error) {
    const notFoundError = (error?.response?.errors ?? []).find(
      ({code}) => code === 'user_not_found',
    )
    console.log(error.response.errors, notFoundError)

    if (notFoundError) {
      const {data} = await smoochClient({
        method: 'POST',
        url: `/v2/apps/${appId}/users`,
        data: {
          externalId,
        },
      })

      user = data.user
      console.log('Use created user')
    }
  }

  try {
    await smoochClient({
      method: 'POST',
      url: `/v1.1/apps/${appId}/appusers/merge`,
      data: {
        surviving: {
          _id: user.id,
        },
        discarded: {
          _id: appUserId,
        },
      },
    })

    console.log('Merged')
  } catch (error) {
    console.log(error)
    return res.json(error.response)
  }

  try {
    const {data} = await smoochClient({
      method: 'GET',
      url: `/v2/apps/${appId}/conversations/${conversationId}/messages`,
    })

    const [lastMessage] = data.messages

    console.log('lastMessage', lastMessage)

    await smoochClient({
      method: 'POST',
      url: `/v2/apps/${appId}/conversations/${conversationId}/messages`,
      data: {
        author: lastMessage.author,
        content: lastMessage.content,
      },
    })

    return res.json({message: 'Successfully merged'})
  } catch (error) {
    console.log(error)
    return res.json(error.response)
  }
}
