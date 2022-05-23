export const getTweetID = (src: string): string => {
  // Create a URL object with the source. If it fails, it's not a URL.
  const url = new URL(src)
  const id = url.pathname
    .split('/')
    .filter(piece => !!piece) // remove empty strings from array
    .slice(-1)[0]
  if (!id) {
    throw new Error('URL does not seem to be a tweet.')
  }
  return id
}


