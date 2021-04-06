import {smoochClient} from '../../clients'

export const extractData = async (data) => {
  try {
    const appId = data.app.id
    const payload = data.events[0].payload
    const {
      user: {id: appUserId},
      conversation: {id: conversationId},
    } = payload

    const {
      data: {clients},
    } = await smoochClient(`/v2/apps/${appId}/users/${appUserId}/clients`)

    const appleClient = clients.find(({type}) => type === 'apple')

    const {intent} = appleClient.raw

    return {
      appId,
      appUserId,
      conversationId,
      intent,
    }
  } catch {
    console.log('Error: extractData')
    return {}
  }
}
