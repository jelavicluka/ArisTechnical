import type { Block } from 'payload'

export const ImageBlock: Block = {
  slug: 'image',
  interfaceName: 'ImageContentBlock',
  labels: {
    plural: 'Image sections',
    singular: 'Image',
  },
  fields: [
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'caption',
      type: 'text',
      maxLength: 300,
    },
    {
      name: 'displayWidth',
      type: 'select',
      defaultValue: 'wide',
      options: [
        { label: 'Content width', value: 'content' },
        { label: 'Wide', value: 'wide' },
        { label: 'Full width', value: 'full' },
      ],
      required: true,
    },
  ],
}
