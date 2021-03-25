export const extractData = (data) => {
  try {
    const appId = data.app.id
    const appUserId = data.events[0].payload.user.id

    return {
      appId,
      appUserId,
    }
  } catch (error) {
    console.log('extractData:', error)
    return {}
  }
}
