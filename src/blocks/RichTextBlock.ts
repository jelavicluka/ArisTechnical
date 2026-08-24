import type { Block } from 'payload'

export const RichTextBlock: Block = {
  slug: 'richText',
  interfaceName: 'RichTextContentBlock',
  labels: {
    plural: 'Formatted text sections',
    singular: 'Formatted text',
  },
  fields: [
    {
      name: 'body',
      type: 'richText',
      required: true,
    },
  ],
}
