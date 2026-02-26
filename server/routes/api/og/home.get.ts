import { generateHomeOgImage } from '~/server/utils/ogImageGenerator'

let cached: Buffer | null = null

export default defineEventHandler(async (event) => {
  if (cached) {
    setResponseHeader(event, 'Content-Type', 'image/png')
    setResponseHeader(event, 'Cache-Control', 'public, max-age=86400, s-maxage=604800')
    return cached
  }

  const pngBuffer = await generateHomeOgImage()
  cached = pngBuffer

  setResponseHeader(event, 'Content-Type', 'image/png')
  setResponseHeader(event, 'Cache-Control', 'public, max-age=86400, s-maxage=604800')
  return pngBuffer
})
