const wordsPerMinute = 220

const countWords = (value: unknown): number => {
  if (typeof value === 'string') return value.trim() ? value.trim().split(/\s+/).length : 0
  if (Array.isArray(value)) return value.reduce((total, entry) => total + countWords(entry), 0)
  if (!value || typeof value !== 'object') return 0

  return Object.entries(value).reduce((total, [key, entry]) => {
    if (['id', 'blockName', 'blockType', 'language', 'filename'].includes(key)) return total
    return total + countWords(entry)
  }, 0)
}

export const calculateReadingTime = (content: unknown): number =>
  Math.max(1, Math.ceil(countWords(content) / wordsPerMinute))
