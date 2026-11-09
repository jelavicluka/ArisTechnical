import { reportApiFlow, REPORT_FLOW_NAME } from '@/data/reportApiFlow'
import type { Article } from '@/payload-types'

const textContent = (value: unknown): string => {
  if (!value || typeof value !== 'object') return ''
  if ('text' in value && typeof value.text === 'string') return value.text
  if ('children' in value && Array.isArray(value.children)) return value.children.map(textContent).join('')
  return ''
}

export const addReportApiFlow = (content: Article['content']): Article['content'] => {
  const existing = content.find((block) => block.blockType === 'apiFlow' && block.blockName === REPORT_FLOW_NAME)
  if (existing?.blockType === 'apiFlow') {
    if (existing.steps.every((step) => step.endpoint === '{{privateEndpoint}}') && existing.note === reportApiFlow.note) return content
    return content.map((block) => block === existing ? {
      ...existing,
      note: reportApiFlow.note,
      steps: existing.steps.map((step) => ({ ...step, endpoint: '{{privateEndpoint}}' })),
    } : block)
  }

  for (const [index, block] of content.entries()) {
    if (block.blockType !== 'richText') continue
    const children = block.body.root.children
    const split = children.findIndex((node) => node.type === 'heading' && textContent(node) === 'Results can also be documents')
    if (split < 0) continue

    const { id: _id, ...continuation } = block
    return [
      ...content.slice(0, index),
      ...(split > 0 ? [{ ...block, body: { ...block.body, root: { ...block.body.root, children: children.slice(0, split) } } }] : []),
      reportApiFlow,
      { ...continuation, body: { ...block.body, root: { ...block.body.root, children: children.slice(split) } } },
      ...content.slice(index + 1),
    ]
  }

  throw new Error('Could not locate the document-results section; article content was not changed.')
}
