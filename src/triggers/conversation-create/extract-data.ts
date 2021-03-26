import {smoochClient} from '../../clients'

export const extractData = async (data) => {
  try {
    const appId = data.app.id
    const appUserId = data.events[0].payload.user.id

    const {
      data: {clients},
    } = await smoochClient(`/v2/apps/${appId}/users/${appUserId}/clients`)

    const appleClient = clients.find(({type}) => type === 'apple')

    const {intent} = appleClient.raw

    return {
      appId,
      appUserId,
      intent,
    }
  } catch {
    console.log('Error: extractData')
    return {}
  }
}
