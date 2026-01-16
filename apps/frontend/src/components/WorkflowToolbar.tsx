import { useState } from 'react';
import { Button } from './ui';

interface WorkflowToolbarProps {
  workflowTitle: string;
  onWorkflowTitleChange: (title: string) => void;
  onSaveWorkflow: () => void;
  onNewWorkflow: () => void;
  onExecuteWorkflow: () => void;
  isWorkflowActive: boolean;
  onToggleActive: () => void;
  isSaving: boolean;
  isExecuting: boolean;
}

export const WorkflowToolbar = ({
  workflowTitle,
  onWorkflowTitleChange,
  onSaveWorkflow,
  onNewWorkflow,
  onExecuteWorkflow,
  isWorkflowActive,
  onToggleActive,
  isSaving,
  isExecuting
}: WorkflowToolbarProps) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState(workflowTitle);

  const handleTitleSubmit = () => {
    onWorkflowTitleChange(tempTitle);
    setIsEditingTitle(false);
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleTitleSubmit();
    if (e.key === 'Escape') {
      setTempTitle(workflowTitle);
      setIsEditingTitle(false);
    }
  };

  return (
    <div className="bg-[#f9fafb] border-b border-gray-200/50 px-6 py-2.5">
      <div className="flex items-center justify-between">
        {/* Left Section: Title & Status */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            {isEditingTitle ? (
              <input
                type="text"
                value={tempTitle}
                onChange={(e) => setTempTitle(e.target.value)}
                onBlur={handleTitleSubmit}
                onKeyDown={handleTitleKeyDown}
                className="text-sm font-semibold bg-transparent text-gray-900 border-b-2 border-gray-900 focus:outline-none px-0 py-0.5 min-w-[150px] transition-colors"
                autoFocus
                placeholder="Workflow Name"
              />
            ) : (
              <div
                className="group flex items-center gap-2 cursor-pointer"
                onClick={() => setIsEditingTitle(true)}
              >
                <h1 className="text-sm font-semibold text-gray-900 group-hover:text-gray-600 transition-colors">
                  {workflowTitle || 'Untitled Workflow'}
                </h1>
                <svg
                  className="w-3.5 h-3.5 text-gray-400 group-hover:text-gray-600 transition-all opacity-0 group-hover:opacity-100 hover:scale-110"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M17 3a2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
                </svg>
              </div>
            )}
          </div>

          <div className="h-5 w-px bg-gray-300/50" />

          <div className="flex items-center gap-3">
            <div
              className={`flex items-center gap-2 px-2 py-0.5 rounded-full text-[11px] font-medium border ${isWorkflowActive
                ? 'bg-green-100/50 text-green-700 border-green-200'
                : 'bg-gray-100/50 text-gray-500 border-gray-200'
                }`}
            >
              <div className={`w-1.5 h-1.5 rounded-full ${isWorkflowActive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
              {isWorkflowActive ? 'Active' : 'Inactive'}
            </div>

            <button
              onClick={onToggleActive}
              className="text-[11px] font-medium text-gray-500 hover:text-gray-900 transition-colors"
            >
              {isWorkflowActive ? 'Turn Off' : 'Turn On'}
            </button>
          </div>
        </div>

        {/* Right Section: Actions */}
        <div className="flex items-center gap-2">
          <Button
            onClick={onNewWorkflow}
            variant="ghost"
            size="sm"
            className="!bg-gray-800 !hover:bg-gray-900 !text-white !border-none h-8 px-4 text-xs font-medium shadow-sm transition-all"
          >
            New Workflow
          </Button>

          <Button
            onClick={onSaveWorkflow}
            variant="ghost"
            size="sm"
            isLoading={isSaving}
            className="!bg-gray-800 !hover:bg-gray-900 !text-white !border-none h-8 px-4 text-xs font-medium ml-1 shadow-sm transition-all"
          >
            {isSaving ? 'Saving...' : 'Save'}
          </Button>

          <Button
            onClick={onExecuteWorkflow}
            variant="ghost"
            size="sm"
            disabled={!isWorkflowActive || isExecuting}
            isLoading={isExecuting}
            className="!bg-gray-800 !hover:bg-gray-900 !text-white !border-none h-8 px-4 text-xs font-medium ml-1 shadow-sm transition-all"
          >
            {isExecuting ? 'Running...' : 'Run Once'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WorkflowToolbar;
