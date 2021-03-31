import {smoochClient} from '../../clients'
import {extractData} from './extract-data'

export const handler = async (req, res) => {
  const {appId, appUserId, intent: externalId} = await extractData(req.body)

  let user = null

  console.log({appId, appUserId, externalId})

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
    return res.json({message: 'Successfully merged'})
  } catch (error) {
    return res.json({message: 'User not found'})
  }
}
