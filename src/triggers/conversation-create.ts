import {smoochClient} from '../clients'
import {getErrorMessage} from '../utils'

export const extractData = async (body) => {
  try {
    const {
      app: {id: appId},
      events: [
        {
          payload: {
            user: {id: appUserId},
            conversation: {id: conversationId},
          },
        },
      ],
    } = body

    const {data: dataClients} = await smoochClient(
      `/v2/apps/${appId}/users/${appUserId}/clients`,
    )

    const appleClient = dataClients.clients.find(({type}) => type === 'apple')

    return {
      appId,
      appUserId,
      conversationId,
      intent: appleClient?.raw?.intent,
    }
  } catch {
    return {}
  }
}

export const handler = async ({appId, appUserId, intent: externalId}) => {
  if (!externalId) {
    return {
      status: 400,
      message: 'Invalid intent',
    }
  }

  const user = await smoochClient(`/v2/apps/${appId}/users/${externalId}`)
    .then(({data}) => {
      console.log('Use existing user')
      return data.user
    })
    .catch(async (error) => {
      const notFoundError = (error?.response?.data?.errors ?? []).find(
        ({code}) => code === 'user_not_found',
      )

      if (notFoundError) {
        const {data} = await smoochClient({
          method: 'POST',
          url: `/v2/apps/${appId}/users`,
          data: {
            externalId,
          },
        })

        console.log('Use created user')
        return data.user
      }
    })

  try {
    if (user?.id) {
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

      return {
        status: 200,
        message: 'Successfully merged',
      }
    } else {
      throw new Error('User not found')
    }
  } catch (error) {
    return {
      status: 400,
      message: getErrorMessage(error),
    }
  }
}
