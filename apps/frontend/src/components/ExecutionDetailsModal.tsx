import { useEffect, useState } from 'react';
import { getExecutionById } from '../services/execution.service';

interface ExecutionDetailsModalProps {
  executionId: string;
  onClose: () => void;
}

export default function ExecutionDetailsModal({ executionId, onClose }: ExecutionDetailsModalProps) {
  const [execution, setExecution] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExecution = async () => {
      try {
        setIsLoading(true);
        const response = await getExecutionById(executionId);
        setExecution(response.data);
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to load execution details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchExecution();
  }, [executionId]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600 bg-green-50 px-2 py-0.5 rounded-full text-sm';
      case 'failed': return 'text-red-600 bg-red-50 px-2 py-0.5 rounded-full text-sm';
      case 'running': return 'text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full text-sm';
      case 'pending': return 'text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded-full text-sm';
      default: return 'text-gray-600 bg-gray-50 px-2 py-0.5 rounded-full text-sm';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-gray-200 flex flex-col animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50/50">
          <h2 className="text-xl font-semibold text-gray-900">Execution Details</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-900 transition-colors p-1 hover:bg-gray-100 rounded-md"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-6 py-6 overflow-y-auto overflow-x-hidden flex-1 custom-scrollbar">

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
              <svg className="w-8 h-8 animate-spin mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span className="text-sm font-medium">Loading details...</span>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-12 text-red-500">
              <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mb-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <span className="text-sm font-medium">Error: {error}</span>
            </div>
          ) : execution ? (
            <div className="space-y-8">
              {/* Header Info */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Execution ID</label>
                  <div className="text-gray-900 font-mono text-xs mt-1 bg-gray-100 px-2 py-1 rounded w-fit select-all">
                    {execution.id}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Workflow</label>
                  <div className="text-gray-900 font-medium mt-1">{execution.workflow?.title}</div>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Status</label>
                  <div className="mt-1">
                    <span className={`inline-flex items-center gap-1.5 font-medium ${getStatusColor(execution.status)}`}>
                      {execution.status === 'running' && <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />}
                      {execution.status}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Mode</label>
                  <div className="text-gray-900 mt-1 capitalize">{execution.mode}</div>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Started At</label>
                  <div className="text-gray-900 text-sm mt-1">
                    {new Date(execution.createdAt).toLocaleString()}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Finished At</label>
                  <div className="text-gray-900 text-sm mt-1">
                    {execution.finishedAt
                      ? new Date(execution.finishedAt).toLocaleString()
                      : <span className="text-gray-400 italic">Running...</span>}
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-100 my-6" />

              {/* Data Sections */}
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                      <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      {execution.status === 'failed' ? 'Error Details' : 'Results'}
                    </label>
                  </div>

                  <div className="bg-gray-50 rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                    {execution.results ? (
                      <div className="relative">
                        <div className="absolute top-2 right-2 flex gap-2">
                          <button
                            onClick={() => navigator.clipboard.writeText(JSON.stringify(execution.results, null, 2))}
                            className="p-1 hover:bg-gray-200 rounded text-gray-500 transition-colors"
                            title="Copy to clipboard"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                          </button>
                        </div>
                        <pre className="text-sm font-mono text-gray-800 p-4 overflow-x-auto whitespace-pre-wrap max-h-96 custom-scrollbar">
                          {JSON.stringify(execution.results, null, 2)}
                        </pre>
                      </div>
                    ) : (
                      <div className="text-gray-400 text-sm p-8 text-center bg-gray-50/50 italic">No results available</div>
                    )}
                  </div>
                </div>

                {execution.status === 'failed' && execution.results?.error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 animate-in slide-in-from-top-2">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-0.5">
                        <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-red-800 mb-1">Error Occurred</h4>
                        <div className="text-red-700 text-sm">{execution.results.error}</div>
                        {execution.results.stack && (
                          <details className="mt-3 group">
                            <summary className="text-red-600 text-xs font-medium cursor-pointer hover:text-red-800 flex items-center gap-1 select-none">
                              <svg className="w-3 h-3 transition-transform group-open:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                              Show Stack Trace
                            </summary>
                            <pre className="text-xs text-red-600/80 mt-2 p-3 bg-red-100/50 rounded overflow-x-auto whitespace-pre-wrap font-mono border border-red-200/50">
                              {execution.results.stack}
                            </pre>
                          </details>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {execution.status === 'failed' && (
                  <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 mt-0.5">
                        <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-blue-800 mb-1">Troubleshooting Tips</h4>
                        <ul className="text-blue-700 text-sm space-y-1 list-disc list-outside ml-4 mt-2">
                          <li>Check if your credentials are valid and up to date</li>
                          <li>Verify all required node parameters are provided</li>
                          <li>Ensure network connectivity for external services</li>
                          <li>Check for API rate limits or quota issues</li>
                          <li>Review input data formats</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {execution.data && Object.keys(execution.data).length > 0 && (
                  <div>
                    <label className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                      </svg>
                      Global Execution Data
                    </label>
                    <div className="bg-gray-50 rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                      <div className="relative">
                        <div className="absolute top-2 right-2 flex gap-2">
                          <button
                            onClick={() => navigator.clipboard.writeText(JSON.stringify(execution.data, null, 2))}
                            className="p-1 hover:bg-gray-200 rounded text-gray-500 transition-colors"
                            title="Copy to clipboard"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                          </button>
                        </div>
                        <pre className="text-sm font-mono text-gray-800 p-4 overflow-x-auto whitespace-pre-wrap max-h-64 custom-scrollbar">
                          {JSON.stringify(execution.data, null, 2)}
                        </pre>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : null}
        </div>

        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-lg transition-colors shadow-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

