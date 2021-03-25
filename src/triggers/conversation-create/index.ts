import {smoochClient} from '../../clients'
import {extractData} from './extract-data'

export const handler = async (req, res) => {
  const {appId, appUserId} = extractData(req.body)

  let externalId = null

  try {
    const {data} = await smoochClient(
      `/v1.1/apps/${appId}/appusers/${appUserId}`,
    )

    const appleClient = data.appUser.clients.find(
      ({platform}) => platform === 'apple',
    )

    externalId = appleClient.raw.intent
  } catch {}

  try {
    if (externalId) {
      const {data} = await smoochClient(`/v2/apps/${appId}/users/${externalId}`)

      await smoochClient({
        method: 'POST',
        url: `/v1.1/apps/${appId}/appusers/merge`,
        data: {
          surviving: {
            _id: data.user.id,
          },
          discarded: {
            _id: appUserId,
          },
        },
      })

      return res.status(200).json({message: 'Merged with existing'})
    }
  } catch (error) {
    console.log('error')
  }

  try {
    const {data} = await smoochClient({
      method: 'POST',
      url: `/v2/apps/${appId}/users`,
      data: {
        externalId,
      },
    })

    await smoochClient({
      method: 'POST',
      url: `/v1.1/apps/${appId}/appusers/merge`,
      data: {
        surviving: {
          _id: data.user.id,
        },
        discarded: {
          _id: appUserId,
        },
      },
    })

    return res.status(200).json({message: 'Success'})
  } catch (error) {
    return res.status(400).json({message: 'User not found'})
  }
}
