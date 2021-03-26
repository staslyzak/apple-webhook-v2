import {smoochClient} from '../../clients'

export const extractData = async (data) => {
  try {
    const appId = data.app.id
    const appUserId = data.events[0].payload.user.id

    const {
      data: {appUser},
    } = await smoochClient(`/v1.1/apps/${appId}/appusers/${appUserId}`)

    const appleClient = appUser.clients.find(
      ({platform}) => platform === 'apple',
    )

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
