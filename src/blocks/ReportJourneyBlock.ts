import type { Block } from 'payload'

export const ReportJourneyBlock: Block = {
  slug: 'reportJourney',
  interfaceName: 'ReportJourneyContentBlock',
  labels: { singular: 'Report integration demo', plural: 'Report integration demos' },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'intro', type: 'textarea', required: true },
    { name: 'note', type: 'textarea', required: true },
  ],
}
