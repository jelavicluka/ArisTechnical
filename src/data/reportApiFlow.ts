import type { ApiFlowContentBlock } from '@/payload-types'

export const REPORT_ARTICLE_SLUG = 'run-aris-reports-from-external-applications'
export const REPORT_FLOW_NAME = 'external-report-api-walkthrough'

export const reportApiFlow: ApiFlowContentBlock = {
  blockType: 'apiFlow',
  blockName: REPORT_FLOW_NAME,
  title: 'Parameters in. Answers out.',
  intro: 'Follow a report from the first request to a result your application can use. Select a step to explore the exchange.',
  steps: [
    {
      title: 'Start the report',
      description: 'Choose a report and send the inputs. The integration accepts the request and returns a run ID.',
      method: 'POST',
      endpoint: '{{privateEndpoint}}',
      requestBody: JSON.stringify({
        report: 'process-quality-check',
        database: 'demo-repository',
        parameters: {
          modelGuid: 'example-model-guid',
          includeFindings: true,
        },
      }, null, 2),
      responseStatus: '202 Accepted',
      responseBody: JSON.stringify({ runId: 'run_demo_1042', status: 'queued' }, null, 2),
      takeaway: 'Keep the runId. It connects the request to everything that happens next.',
    },
    {
      title: 'Check progress',
      description: 'Use the run ID to check execution. The report is still working, so the client waits before checking again.',
      method: 'GET',
      endpoint: '{{privateEndpoint}}',
      responseStatus: '200 OK',
      responseBody: JSON.stringify({ runId: 'run_demo_1042', status: 'running' }, null, 2),
      takeaway: 'An HTTP 200 means the status request succeeded. The report itself is still running.',
    },
    {
      title: 'Use the result',
      description: 'A later status check returns the completed result. Your application can now display the findings or continue its workflow.',
      method: 'GET',
      endpoint: '{{privateEndpoint}}',
      responseStatus: '200 OK',
      responseBody: JSON.stringify({
        runId: 'run_demo_1042',
        status: 'completed',
        result: {
          modelsChecked: 1,
          findings: 2,
          summary: '2 modelling checks need attention.',
        },
      }, null, 2),
      takeaway: 'Structured results are ready for a dashboard, a notification or the next automated action.',
    },
  ],
  note: 'Request and response data are illustrative. Polling may take more than one check; handle failed runs and set a timeout.',
}
