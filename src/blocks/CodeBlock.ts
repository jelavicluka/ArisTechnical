import type { Block } from 'payload'

export const CodeBlock: Block = {
  slug: 'code',
  interfaceName: 'CodeContentBlock',
  labels: {
    plural: 'Code sections',
    singular: 'Code section',
  },
  fields: [
    {
      name: 'language',
      type: 'select',
      defaultValue: 'javascript',
      options: [
        { label: 'JavaScript', value: 'javascript' },
        { label: 'JSON', value: 'json' },
        { label: 'XML', value: 'xml' },
        { label: 'SQL', value: 'sql' },
        { label: 'Command line', value: 'bash' },
        { label: 'Plain text / logs', value: 'text' },
      ],
      required: true,
    },
    {
      name: 'filename',
      type: 'text',
      admin: {
        description: 'Optional filename or short label displayed above the code.',
      },
      maxLength: 140,
    },
    {
      name: 'code',
      type: 'code',
      required: true,
    },
    {
      name: 'caption',
      type: 'text',
      admin: {
        description: 'Optional explanation displayed below the code example.',
      },
      maxLength: 300,
    },
  ],
}
