import type { ReportJourneyContentBlock } from '@/payload-types'

export const reportJourney: ReportJourneyContentBlock = {
  blockType: 'reportJourney',
  blockName: 'external-report-journey',
  title: 'One connection. A whole new range of possibilities.',
  intro: 'Choose a task and follow it from your application into ARIS and back. No code required.',
  note: 'Illustrative demo with sample data; no connection to an ARIS server. Process checks, updates and document delivery show possible implementations, each requiring a suitable report and integration setup.',
}

export const reportScenarios = [
  {
    id: 'check', label: 'Check process quality', icon: 'check',
    request: 'Check our purchasing processes',
    input: 'Your portal sends the selected processes and the rules to check.',
    work: 'ARIS checks the processes',
    detail: 'A report applies your modelling rules and gathers the findings.',
    result: 'Findings arrive in your portal',
    outcome: 'Your team can act on the findings without running the report manually.',
    metric: '12', metricLabel: 'processes checked',
    facts: ['10 processes passed the checks', '2 processes need attention'],
    next: 'Ready for your team to review',
  },
  {
    id: 'update', label: 'Update ARIS data', icon: 'sync',
    request: 'Assign a new process owner',
    input: 'Your business system sends the selected processes and their new owner.',
    work: 'ARIS applies your update rules',
    detail: 'A report validates the input and updates the permitted repository content.',
    result: 'Your system receives confirmation',
    outcome: 'The calling system knows what changed and can continue its workflow.',
    metric: '8', metricLabel: 'process owners updated',
    facts: ['New owner: Process Operations', 'Changes confirmed by the report'],
    next: 'Ready for the next workflow step',
  },
  {
    id: 'document', label: 'Generate a document', icon: 'document',
    request: 'Prepare a process overview',
    input: 'Your application sends the process selection and the document options.',
    work: 'ARIS prepares the document',
    detail: 'A report generates the file and stores it in ARIS Document Storage.',
    result: 'A document link comes back',
    outcome: 'Your application can retrieve the document using the required access permissions.',
    metric: '1', metricLabel: 'document prepared',
    facts: ['Process overview.pdf', 'Download link returned to your application'],
    next: 'Ready to retrieve with authorised access',
  },
] as const
