import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { Button, Badge, CardSkeleton } from '../components/ui';
import { deleteWorkflow, getallWorkflows } from '../services/workflow.service';

interface Workflow {
  id: string;
  title: string;
  isActive: boolean;
  triggerType: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    executions: number;
  };
  executions?: Array<{
    id: string;
    status: string;
    mode: string;
  }>;
}

export default function Projects() {
  const navigate = useNavigate();
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');

  // Delete confirmation modal state
  const [deleteModal, setDeleteModal] = useState<{ show: boolean; workflowId: string; workflowTitle: string }>({
    show: false,
    workflowId: '',
    workflowTitle: ''
  });
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchWorkflows = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await getallWorkflows();
      console.log('Workflows fetched:', response);
      setWorkflows(response.data || []);
    } catch (err: any) {
      console.error('Error fetching workflows:', err);
      setError(err.response?.data?.error || 'Failed to load workflows');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkflows();
  }, []);

  const handleCreateNew = () => {
    navigate('/dashboard');
  };

  const handleOpenWorkflow = (workflowId: string) => {
    navigate(`/workflow/${workflowId}`);
  };

  const handleDeleteWorkflow = (workflowId: string, workflowTitle: string) => {
    setDeleteModal({ show: true, workflowId, workflowTitle });
  };

  // Confirm deletion
  const confirmDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteWorkflow(deleteModal.workflowId);
      setDeleteModal({ show: false, workflowId: '', workflowTitle: '' });
      fetchWorkflows();
    } catch (err: any) {
      toast.error(`Failed to delete workflow: ${err.response?.data?.error || err.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  // Cancel deletion
  const cancelDelete = () => {
    setDeleteModal({ show: false, workflowId: '', workflowTitle: '' });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  const filteredWorkflows = workflows.filter(workflow => {
    const matchesSearch = workflow.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      workflow.triggerType.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' ||
      (filterStatus === 'active' && workflow.isActive) ||
      (filterStatus === 'inactive' && !workflow.isActive);
    return matchesSearch && matchesStatus;
  });

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-gray-950 to-gray-900">
        <div className="text-center animate-fadeIn">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-500/20 rounded-2xl flex items-center justify-center">
            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Oops! Something went wrong</h3>
          <p className="text-red-400 mb-6">{error}</p>
          <Button onClick={fetchWorkflows} variant="primary">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-gray-950 text-white overflow-auto">
      <div className="sticky top-0 z-10 border-b border-gray-800/50 px-6 py-4 bg-gray-950">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl font-medium text-white">Workflows</h1>
              <p className="text-xs text-gray-500 mt-0.5">{workflows.length} total</p>
            </div>

            <button
              onClick={handleCreateNew}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 border border-indigo-500 hover:border-indigo-400 text-white text-sm font-medium rounded-lg transition-all shadow-md hover:shadow-lg shadow-indigo-500/25"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Workflow
            </button>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 pl-9 bg-gray-900/50 border border-gray-800 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
              <svg className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            <div className="flex gap-1.5">
              {[
                { value: 'all', label: 'All' },
                { value: 'active', label: 'Active' },
                { value: 'inactive', label: 'Inactive' }
              ].map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => setFilterStatus(filter.value as any)}
                  className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${filterStatus === filter.value
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
      </div>

      <div className="px-6 py-6">
        <div className="max-w-6xl mx-auto">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i}>
                  <CardSkeleton />
                </div>
              ))}
            </div>
          ) : filteredWorkflows.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500 mb-4">
                {searchQuery || filterStatus !== 'all' ? 'No workflows found' : 'No workflows yet'}
              </p>
              {workflows.length === 0 && (
                <Button onClick={handleCreateNew} variant="secondary" size="sm">
                  Create Workflow
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredWorkflows.map((workflow) => (
                <div
                  key={workflow.id}
                  className="bg-gray-900/40 rounded-lg border border-gray-800 hover:border-gray-700 transition-colors cursor-pointer group"
                  onClick={() => handleOpenWorkflow(workflow.id)}
                >
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-white truncate group-hover:text-blue-400 transition-colors">
                          {workflow.title}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">{workflow.triggerType}</p>
                      </div>
                      <Badge
                        variant={workflow.isActive ? 'success' : 'default'}
                        size="sm"
                        dot={workflow.isActive}
                      >
                        {workflow.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">{workflow._count?.executions || 0} runs</span>
                      <span className="text-gray-500">{formatDate(workflow.updatedAt)}</span>
                    </div>

                    {workflow.executions && workflow.executions.length > 0 && (
                      <div className="mt-3 flex gap-0.5">
                        {workflow.executions.slice(0, 20).map((execution) => (
                          <div
                            key={execution.id}
                            className={`flex-1 h-1 rounded-full ${execution.status === 'SUCCESS' ? 'bg-green-500' :
                                execution.status === 'FAILED' ? 'bg-red-500' :
                                  execution.status === 'RUNNING' ? 'bg-blue-500' :
                                    'bg-yellow-500'
                              }`}
                            title={execution.status}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="px-4 py-2.5 border-t border-gray-800 flex items-center gap-2">
                    <Button
                      onClick={(e: any) => {
                        e.stopPropagation();
                        handleOpenWorkflow(workflow.id);
                      }}
                      variant="ghost"
                      size="xs"
                      className="flex-1 text-blue-400 hover:text-blue-300"
                    >
                      Open
                    </Button>
                    <Button
                      onClick={(e: any) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleDeleteWorkflow(workflow.id, workflow.title);
                      }}
                      variant="ghost"
                      size="xs"
                      className="text-red-400 hover:text-red-300"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {deleteModal.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 w-[400px] shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white">Delete Workflow</h3>
            </div>
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete <span className="font-semibold text-white">"{deleteModal.workflowTitle}"</span>? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={cancelDelete}
                disabled={isDeleting}
                className="px-4 py-2 text-sm rounded-lg border border-gray-600 bg-gray-800 text-white hover:bg-gray-700 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={isDeleting}
                className="px-4 py-2 text-sm rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 flex items-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Deleting...
                  </>
                ) : (
                  'Delete'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

