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
      case 'success': return 'text-green-400';
      case 'failed': return 'text-red-400';
      case 'running': return 'text-blue-400';
      case 'pending': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-gray-700">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">Execution Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-6 py-4 overflow-y-auto max-h-[calc(90vh-80px)] no-scrollbar">

          {isLoading ? (
            <div className="text-center py-8 text-gray-400">Loading...</div>
          ) : error ? (
            <div className="text-center py-8 text-red-400">Error: {error}</div>
          ) : execution ? (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400">Execution ID</label>
                  <div className="text-white font-mono text-sm mt-1">{execution.id}</div>
                </div>
                <div>
                  <label className="text-sm text-gray-400">Workflow</label>
                  <div className="text-white mt-1">{execution.workflow?.title}</div>
                </div>
                <div>
                  <label className="text-sm text-gray-400">Status</label>
                  <div className={`mt-1 font-semibold ${getStatusColor(execution.status)}`}>
                    {execution.status}
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-400">Mode</label>
                  <div className="text-white mt-1">{execution.mode}</div>
                </div>
                <div>
                  <label className="text-sm text-gray-400">Started At</label>
                  <div className="text-white text-sm mt-1">
                    {new Date(execution.createdAt).toLocaleString()}
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-400">Finished At</label>
                  <div className="text-white text-sm mt-1">
                    {execution.finishedAt
                      ? new Date(execution.finishedAt).toLocaleString()
                      : 'N/A'}
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-400 mb-2 block">
                  {execution.status === 'failed' ? 'Error Details' : 'Results'}
                </label>
                <div className="bg-gray-950 rounded-lg p-4 border border-gray-700">
                  {execution.results ? (
                    <pre className="text-sm text-gray-300 overflow-x-auto whitespace-pre-wrap">
                      {JSON.stringify(execution.results, null, 2)}
                    </pre>
                  ) : (
                    <div className="text-gray-500 text-sm">No results available</div>
                  )}
                </div>
              </div>

              {execution.status === 'failed' && execution.results?.error && (
                <div className="bg-red-900 bg-opacity-20 border border-red-700 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-1">
                      <div className="text-red-400 font-semibold mb-2">Error Message:</div>
                      <div className="text-red-300 text-sm">{execution.results.error}</div>
                      {execution.results.stack && (
                        <details className="mt-3">
                          <summary className="text-red-400 text-sm cursor-pointer hover:text-red-300">
                            Show Stack Trace
                          </summary>
                          <pre className="text-xs text-red-300 mt-2 overflow-x-auto whitespace-pre-wrap">
                            {execution.results.stack}
                          </pre>
                        </details>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {execution.status === 'failed' && (
                <div className="bg-blue-900 bg-opacity-20 border border-blue-700 rounded-lg p-4">
                  <div className="text-blue-400 font-semibold mb-2"> Common Issues:</div>
                  <ul className="text-blue-300 text-sm space-y-1 list-disc list-inside">
                    <li>Missing or invalid credentials</li>
                    <li>Required parameters not filled</li>
                    <li>Network connectivity issues</li>
                    <li>API rate limits exceeded</li>
                    <li>Invalid data format in node parameters</li>
                  </ul>
                </div>
              )}

              {execution.data && Object.keys(execution.data).length > 0 && (
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Execution Data</label>
                  <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                    <pre className="text-sm text-gray-300 overflow-x-auto whitespace-pre-wrap">
                      {JSON.stringify(execution.data, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </div>

        <div className="px-6 py-4 border-t border-gray-700 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

