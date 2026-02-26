type MaybeString = string | null | undefined

type RichContentInput = unknown

const toSafeString = (value: RichContentInput): string => {
  if (value === null || value === undefined) return ''
  if (typeof value === 'string') return value
  return String(value)
}

const looksLikeHtml = (content: string): boolean => {
  // Simple heuristic: any tag-like structure
  return /<\s*\/?\s*[a-z][\s\S]*?>/i.test(content)
}

const looksLikeMath = (content: string): boolean => {
  // Support LaTeX ($...$, $$...$$) and common MathJax delimiters (\(...\), \[...\])
  return (
    /\$\$[\s\S]+?\$\$/.test(content) ||
    /\$(?!\$)[\s\S]+?(?<!\$)\$(?!\$)/.test(content) ||
    /\\\([\s\S]+?\\\)/.test(content) ||
    /\\\[[\s\S]+?\\\]/.test(content)
  )
}

const normalizeMathDelimiters = (content: string): string => {
  // Convert MathJax delimiters into $ / $$ so the renderer’s pipeline can be consistent.
  // Non-greedy to avoid spanning too much.
  return content
    .replace(/\\\[([\s\S]+?)\\\]/g, (_m, inner) => `$$${inner}$$`)
    .replace(/\\\(([\s\S]+?)\\\)/g, (_m, inner) => `$${inner}$`)
}

export const useRichContent = () => {
  const shouldRenderWithTiptap = (value: RichContentInput): boolean => {
    const s = toSafeString(value).trim()
    if (!s) return false

    // Render via TiptapRenderer only when needed (HTML or math)
    return looksLikeHtml(s) || looksLikeMath(s)
  }

  const toTiptapContent = (value: RichContentInput): string => {
    const s = toSafeString(value)
    if (!s) return ''

    // If it’s just math/text (not HTML), keep as plain text but normalize MathJax delimiters.
    // If it’s HTML, still normalize so embedded MathJax delimiters also render.
    return normalizeMathDelimiters(s)
  }

  return {
    shouldRenderWithTiptap,
    toTiptapContent,
  }
}
