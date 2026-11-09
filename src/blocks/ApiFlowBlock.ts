import type { Block } from 'payload'

const jsonExample = (value: unknown) => {
  if (!value) return true
  if (typeof value !== 'string') return 'Enter a JSON example.'
  try {
    JSON.parse(value)
    return true
  } catch {
    return 'Enter valid JSON.'
  }
}

export const ApiFlowBlock: Block = {
  slug: 'apiFlow',
  interfaceName: 'ApiFlowContentBlock',
  labels: { singular: 'API walkthrough', plural: 'API walkthroughs' },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'intro', type: 'textarea', required: true },
    {
      name: 'steps',
      type: 'array',
      minRows: 1,
      maxRows: 6,
      required: true,
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea', required: true },
        { name: 'method', type: 'select', options: ['POST', 'GET'], required: true },
        {
          name: 'endpoint',
          type: 'text',
          required: true,
          defaultValue: '{{privateEndpoint}}',
          access: { read: ({ req }) => Boolean(req.user) },
          admin: { description: 'Private editorial field. Endpoint values are excluded from public API responses and article previews.' },
        },
        { name: 'requestBody', type: 'code', validate: jsonExample },
        { name: 'responseStatus', type: 'select', options: ['202 Accepted', '200 OK'], required: true },
        { name: 'responseBody', type: 'code', required: true, validate: jsonExample },
        { name: 'takeaway', type: 'text', required: true },
      ],
    },
    { name: 'note', type: 'textarea', required: true },
  ],
}
