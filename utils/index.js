const generateBasicToken = (username, password) =>
  Buffer.from(`${username}:${password}`).toString('base64')

const extractData = (data) => {
  try {
    const dataPoint = data.payload.apple.interactiveData.data

    return {
      appId: '',
      appUserId: '',
      userId: '',
      ticketId: '',
    }
  } catch (error) {
    return {}
  }
}

module.exports = {extractData, generateBasicToken}
