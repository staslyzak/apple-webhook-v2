export const getErrorMessage = (error) => {
  return (
    error.response?.data?.errors ??
    error.response?.data?.error ??
    error?.message
  )
}
