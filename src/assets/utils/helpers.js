export const getImageUrlWithCacheBuster = (url) => {
  if (!url) return ''
  const timestamp = new Date().getTime()
  const separator = url.includes('?') ? '&' : '?'
  return `${url}${separator}t=${timestamp}`
}
