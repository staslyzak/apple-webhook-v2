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
  // let lastMessage = null

  console.log({appId, appUserId, externalId, conversationId})

  if (!externalId) {
    console.log('Invalid intent')
    return res.json({message: 'Invalid intent'})
  }

  // try {
  //   const {data} = await smoochClient({
  //     method: 'GET',
  //     url: `/v1.1/apps/${appId}/appusers/${appUserId}/messages`,
  //   })

  //   lastMessage = data.messages[0]
  // } catch (error) {}

  try {
    const {data} = await smoochClient(`/v2/apps/${appId}/users/${externalId}`)

    user = data.user
    console.log('Use existing user')
  } catch (error) {
    const notFoundError = (error?.response?.data?.errors ?? []).find(
      ({code}) => code === 'user_not_found',
    )

    console.log(notFoundError)

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
          _id: appUserId,
        },
        discarded: {
          _id: user.id,
        },
      },
    })

    // await smoochClient({
    //   method: 'PATCH',
    //   url: `/v2/apps/${appId}/users/${user.id}`,
    //   data: {
    //     metadata: {
    //       messanger: 'ABC',
    //     },
    //   },
    // })

    // if (lastMessage) {
    //   await smoochClient({
    //     method: 'POST',
    //     url: `/v1.1/apps/${appId}/appusers/${user.id}/messages`,
    //     data: {
    //       role: 'appUser',
    //       type: 'text',
    //       text: lastMessage.text,
    //     },
    //   })
    // }

    // console.log('Message sent')
    console.log('Successfully merged')
    return res.json({message: 'Successfully merged'})
  } catch (error) {
    console.log(error.response.data)
    return res.json(error.response.data)
  }
}
