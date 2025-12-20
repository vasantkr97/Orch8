import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge, Button, Spinner, TableRowSkeleton } from '../components/ui';
import { deleteExecution, getAllExecutions, stopExecution } from '../services/execution.service';
import ExecutionDetailsModal from '../components/ExecutionDetailsModal';

interface Execution {
  id: string;
  status: 'pending' | 'running' | 'success' | 'failed';
  mode: string;
  createdAt: string;
  finishedAt?: string;
  workflow: {
    id: string;
    title: string;
    triggerType: string;
  };
}

export default function Executions() {
  const navigate = useNavigate();
  const [executions, setExecutions] = useState<Execution[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [selectedExecutionId, setSelectedExecutionId] = useState<string | null>(null);
  const [pollingInterval, setPollingInterval] = useState<ReturnType<typeof setInterval> | null>(null);

  // Fetch executions from backend
  const fetchExecutions = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await getAllExecutions();
      console.log('Executions fetched:', response);
      setExecutions(response.executions || []);
    } catch (err: any) {
      console.error('Error fetching executions:', err);
      setError(err.response?.data?.error || 'Failed to load executions');
    } finally {
      setIsLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchExecutions();
  }, []);

  // Smart polling - only when needed
  useEffect(() => {
    // Clear existing interval
    if (pollingInterval) {
      clearInterval(pollingInterval);
      setPollingInterval(null);
    }

    // Only poll if there are running/pending executions
    const hasActiveExecutions = executions.some(e => e.status === 'running' || e.status === 'pending');

    if (hasActiveExecutions && executions.length > 0) {
      console.log('Starting smart polling for active executions');
      const interval = setInterval(() => {
        console.log('Polling executions...');
        fetchExecutions();
      }, 10000); // 10 seconds
      setPollingInterval(interval);
    } else {
      console.log(' No active executions, stopping polling');
    }

    // Cleanup on unmount or when component is about to re-render
    return () => {
      if (pollingInterval) {
        console.log('Cleaning up polling interval');
        clearInterval(pollingInterval);
      }
    };
  }, [executions]); // Re-run when executions change

  const handleCancelExecution = async (executionId: string) => {
    if (!window.confirm('Are you sure you want to cancel this execution?')) {
      return;
    }

    try {
      await stopExecution(executionId);
      alert('Execution cancelled successfully');
      fetchExecutions();
    } catch (err: any) {
      console.error('Error cancelling execution:', err);
      alert(`Failed to cancel execution: ${err.response?.data?.error || err.message}`);
    }
  };

  const handleDeleteExecution = async (executionId: string) => {
    if (!window.confirm('Are you sure you want to delete this execution?')) {
      return;
    }

    try {
      await deleteExecution(executionId);
      alert('Execution deleted successfully');
      fetchExecutions();
    } catch (err: any) {
      console.error('Error deleting execution:', err);
      alert(`Failed to delete execution: ${err.response?.data?.error || err.message}`);
    }
  };

  const handleViewWorkflow = (workflowId: string) => {
    // Stop polling before navigation to prevent conflicts
    if (pollingInterval) {
      console.log('Stopping polling before navigation');
      clearInterval(pollingInterval);
      setPollingInterval(null);
    }

    console.log('Navigating to workflow:', workflowId);
    navigate(`/workflow/${workflowId}`);
  };

  const getStatusVariant = (status: string): 'success' | 'error' | 'info' | 'warning' | 'default' => {
    switch (status) {
      case 'success': return 'success';
      case 'failed': return 'error';
      case 'running': return 'info';
      case 'pending': return 'warning';
      default: return 'default';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getDuration = (createdAt: string, finishedAt?: string) => {
    const start = new Date(createdAt);
    const end = finishedAt ? new Date(finishedAt) : new Date();
    const duration = Math.floor((end.getTime() - start.getTime()) / 1000);

    if (duration < 60) return `${duration}s`;
    if (duration < 3600) return `${Math.floor(duration / 60)}m ${duration % 60}s`;
    return `${Math.floor(duration / 3600)}h ${Math.floor((duration % 3600) / 60)}m`;
  };

  // Filter executions by status
  const filteredExecutions = statusFilter
    ? executions.filter(e => e.status === statusFilter)
    : executions;

  if (isLoading && executions.length === 0) {
    return (
      <div className="flex items-center justify-center h-full bg-gradient-to-br from-gray-950 to-gray-900">
        <Spinner size="lg" text="Loading executions..." />
      </div>
    );
  }

  if (error && executions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-gray-950 to-gray-900">
        <div className="text-center animate-fadeIn">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-500/20 rounded-2xl flex items-center justify-center">
            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Failed to load executions</h3>
          <p className="text-red-400 mb-6">{error}</p>
          <Button onClick={fetchExecutions} variant="primary">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-gray-950 text-white overflow-auto">
      {/* Simple Header */}
      <div className="sticky top-0 z-10 border-b border-gray-800/50 px-6 py-4 bg-gray-950">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl font-medium text-white">Executions</h1>
              <p className="text-xs text-gray-500 mt-0.5">{executions.length} total</p>
            </div>

            <Button
              onClick={fetchExecutions}
              variant="outline"
              size="sm"
              leftIcon={
                isLoading ? (
                  <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                )
              }
            >
              Refresh
            </Button>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-1.5">
            {[
              { value: '', label: 'All' },
              { value: 'pending', label: 'Pending' },
              { value: 'running', label: 'Running' },
              { value: 'success', label: 'Success' },
              { value: 'failed', label: 'Failed' },
            ].map((filter) => (
              <button
                key={filter.value}
                onClick={() => setStatusFilter(filter.value)}
                className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${statusFilter === filter.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-900/50 text-gray-400 hover:text-white hover:bg-gray-800'
                  }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6">
        <div className="max-w-6xl mx-auto">
          {filteredExecutions.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500 mb-4">
                {statusFilter
                  ? `No executions with status "${statusFilter}"`
                  : "No executions yet"
                }
              </p>
            </div>
          ) : (
            <>
              {/* Executions Table */}
              <div className="bg-gray-900/40 rounded-lg overflow-hidden border border-gray-800">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-800">
                    <thead>
                      <tr className="bg-gray-900/30">
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                          Workflow
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                          Status
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                          Started
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                          Duration
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800/50">
                      {isLoading && executions.length > 0 ? (
                        <>
                          {[1, 2, 3].map((i) => <TableRowSkeleton key={i} columns={5} />)}
                        </>
                      ) : (
                        filteredExecutions.map((execution: Execution) => (
                          <tr
                            key={execution.id}
                            className="hover:bg-gray-800/30 transition-colors"
                          >
                            <td className="px-4 py-3">
                              <div className="text-sm font-medium text-white">
                                {execution.workflow.title}
                              </div>
                              <div className="text-xs text-gray-500 mt-0.5">
                                {execution.workflow.triggerType}
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <Badge variant={getStatusVariant(execution.status)} size="sm" dot={execution.status === 'running'}>
                                {execution.status}
                              </Badge>
                            </td>
                            <td className="px-4 py-3">
                              <div className="text-sm text-gray-300">
                                {formatDate(execution.createdAt)}
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <span className="text-sm font-mono text-gray-400">
                                {getDuration(execution.createdAt, execution.finishedAt)}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-1">
                                <Button
                                  onClick={() => setSelectedExecutionId(execution.id)}
                                  variant="ghost"
                                  size="xs"
                                  className="text-blue-400 hover:text-blue-300"
                                  title="View details"
                                >
                                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                  </svg>
                                </Button>
                                <Button
                                  onClick={() => handleViewWorkflow(execution.workflow.id)}
                                  variant="ghost"
                                  size="xs"
                                  className="text-purple-400 hover:text-purple-300"
                                  title="View workflow"
                                >
                                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                  </svg>
                                </Button>
                                {execution.status === 'running' && (
                                  <Button
                                    onClick={() => handleCancelExecution(execution.id)}
                                    variant="ghost"
                                    size="xs"
                                    className="text-yellow-400 hover:text-yellow-300"
                                    title="Cancel"
                                  >
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                  </Button>
                                )}
                                <Button
                                  onClick={() => handleDeleteExecution(execution.id)}
                                  variant="ghost"
                                  size="xs"
                                  className="text-red-400 hover:text-red-300"
                                  title="Delete"
                                >
                                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Execution Details Modal */}
      {selectedExecutionId && (
        <ExecutionDetailsModal
          executionId={selectedExecutionId}
          onClose={() => setSelectedExecutionId(null)}
        />
      )}
    </div>
  );
}
