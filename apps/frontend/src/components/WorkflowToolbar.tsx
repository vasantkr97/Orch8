import { useState } from 'react';
import { Button, Badge } from './ui';

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
    <div className="glass-effect border-b border-gray-800 px-4 py-2.5 backdrop-blur-xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3">
            {isEditingTitle ? (
              <input
                type="text"
                value={tempTitle}
                onChange={(e) => setTempTitle(e.target.value)}
                onBlur={handleTitleSubmit}
                onKeyDown={handleTitleKeyDown}
                className="text-base font-semibold bg-gray-800 text-white border-b border-blue-500 focus:outline-none px-2 py-0.5 rounded"
                autoFocus
              />
            ) : (
              <h1
                className="text-[16px] font-semibold text-white cursor-pointer hover:text-blue-400 transition-colors flex items-center gap-1.5 group"
                onClick={() => setIsEditingTitle(true)}
                title="Click to edit"
              >
                {workflowTitle || 'untitled'}
                <svg className="w-3 h-3 text-gray-500 group-hover:text-blue-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </h1>
            )}
            
            <Badge 
              variant={isWorkflowActive ? 'success' : 'default'} 
              size="sm" 
              dot={isWorkflowActive}
            >
              {isWorkflowActive ? 'Active' : 'Inactive'}
            </Badge>
            
            <button
              onClick={onToggleActive}
              className="text-xs text-gray-400 hover:text-blue-400 transition-colors"
            >
              {isWorkflowActive ? 'Deactivate' : 'Activate'}
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={onNewWorkflow}
            variant="secondary"
            size="sm"
          >
            Create Workflow
          </Button>

          <Button
            onClick={onSaveWorkflow}
            variant="primary"
            size="sm"
            isLoading={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save'}
          </Button>

          <Button
            onClick={onExecuteWorkflow}
            variant="success"
            size="sm"
            disabled={!isWorkflowActive || isExecuting}
            isLoading={isExecuting}
          >
            {isExecuting ? 'Executing...' : 'Execute'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WorkflowToolbar;
