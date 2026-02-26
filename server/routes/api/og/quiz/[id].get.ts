import { LRUCache } from 'lru-cache'
import { generateQuizOgImage } from '~/server/utils/ogImageGenerator'

const cache = new LRUCache<string, Buffer>({
  max: 100,
  ttl: 1000 * 60 * 60, // 1 hour
})

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, message: 'Missing quiz id' })
  }

  const cacheKey = `quiz:${id}`
  const cached = cache.get(cacheKey)
  if (cached) {
    setResponseHeader(event, 'Content-Type', 'image/png')
    setResponseHeader(event, 'Cache-Control', 'public, max-age=3600, s-maxage=86400')
    return cached
  }

  const config = useRuntimeConfig(event)
  const apiUrl = config.public.apiUrl

  let title = 'QuizOxide'
  let description = ''

  try {
    const data: any = await $fetch(`${apiUrl}/api/v1/quizzes/${id}/public`)
    const quiz = data?.data
    if (quiz?.title) title = quiz.title
    if (quiz?.description) description = quiz.description
  } catch {
    // Use fallback title
  }

  const pngBuffer = await generateQuizOgImage(title, description)
  cache.set(cacheKey, pngBuffer)

  setResponseHeader(event, 'Content-Type', 'image/png')
  setResponseHeader(event, 'Cache-Control', 'public, max-age=3600, s-maxage=86400')
  return pngBuffer
})
