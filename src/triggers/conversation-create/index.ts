import {smoochClient} from '../../clients'
import {extractData} from './extract-data'

const mergeUsers = ({appId, survivingId, discardedId}) =>
  smoochClient({
    method: 'POST',
    url: `/v1.1/apps/${appId}/appusers/merge`,
    data: {
      surviving: {
        _id: survivingId,
      },
      discarded: {
        _id: discardedId,
      },
    },
  })

export const handler = async (req, res) => {
  const {appId, appUserId, intent: externalId} = await extractData(req.body)

  console.log({appId, appUserId, externalId})

  if (!externalId) {
    console.log('Invalid intent')
    return res.json({message: 'Invalid intent'})
  }

  try {
    const {data} = await smoochClient(`/v2/apps/${appId}/users/${externalId}`)

    await mergeUsers({
      appId,
      survivingId: appUserId,
      discardedId: data.user.id,
    })

    console.log('Merged with existing')
    return res.json({message: 'Merged with existing'})
  } catch (error) {
    console.log('Error on update')
    // console.log('error')
  }

  try {
    const {data} = await smoochClient({
      method: 'POST',
      url: `/v2/apps/${appId}/users`,
      data: {
        externalId,
      },
    })

    await mergeUsers({
      appId,
      survivingId: appUserId,
      discardedId: data.user.id,
    })

    console.log('Merged with created')
    return res.json({message: 'Merged with created'})
  } catch (error) {
    return res.json({message: 'User not found'})
  }
}
