import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateWorkflow } from '../../services/workflow.service';
import { manualExecute, webhookExecute } from '../../services/execution.service';
import { getNodeConfig } from '../../components/nodes/nodeTypes';
import { createWorkflow } from '../../services/workflow.service';

interface UseWorkflowActionsProps {
  workflowId: string | null;
  setWorkflowId: (id: string | null) => void;
  workflowTitle: string;
  setWorkflowTitle: (title: string) => void;
  isWorkflowActive: boolean;
  setIsWorkflowActive: (active: boolean) => void;
  setIsSaving: (saving: boolean) => void;
  setIsExecuting: (executing: boolean) => void;
  nodes: any[];
  edges: any[];
  resetWorkflow: () => void;
  setNodes: any;
  startExecutionTracking?: (executionId: string, nodes: any[], edges: any[]) => void;
}

export const useWorkflowActions = ({
  workflowId,
  setWorkflowId,
  workflowTitle,
  setWorkflowTitle,
  isWorkflowActive,
  setIsWorkflowActive,
  setIsSaving,
  setIsExecuting,
  nodes,
  edges,
  resetWorkflow,
  setNodes,
  startExecutionTracking
}: UseWorkflowActionsProps) => {
  const navigate = useNavigate();

  const handleTitleChange = useCallback(async (title: string) => {
    const oldTitle = workflowTitle;
    setWorkflowTitle(title);

    if (workflowId) {
      try {
        await updateWorkflow(workflowId, { title });
      } catch (error: any) {
        console.error('Error updating title:', error);
        setWorkflowTitle(oldTitle);
        alert(`Failed to update title: ${error.response?.data?.error || error.message}`);
      }
    }
  }, [workflowId, workflowTitle, setWorkflowTitle]);

  const handleToggleActive = useCallback(async () => {
    const newState = !isWorkflowActive;
    setIsWorkflowActive(newState);

    if (workflowId) {
      try {
        await updateWorkflow(workflowId, { isActive: newState });
      } catch (error: any) {
        console.error('Error toggling active:', error);
        setIsWorkflowActive(!newState);
        alert(`Failed to update status: ${error.response?.data?.error || error.message}`);
      }
    }
  }, [isWorkflowActive, workflowId, setIsWorkflowActive]);

  const handleNewWorkflow = useCallback(async () => {
    try {
      resetWorkflow();

      const workflowData = {
        title: 'Untitled Workflow',
        isActive: false,
        triggerType: 'manual',
        nodes: [],
        connections: []
      };

      const response = await createWorkflow(workflowData);

      if (response.data?.id) {
        setWorkflowId(response.data.id);
        navigate(`/workflow/${response.data.id}`);
        alert('New workflow created!');
      }
    } catch (error: any) {
      console.error('Error creating workflow:', error);
      alert(`Failed to create workflow: ${error.response?.data?.error || error.message}`);
    }
  }, [resetWorkflow, setWorkflowId, navigate]);

  const handleSave = useCallback(async () => {
    if (nodes.length === 0) {
      alert('Add at least one node before saving.');
      return;
    }

    try {
      setIsSaving(true);

      const backendNodes = nodes.map(node => {
        const backendNode = {
          id: node.id,
          name: node.data?.label || node.id,
          type: node.type,
          parameters: node.data?.parameters || {},
          credentials: node.data?.credentialsId ? { id: node.data.credentialsId } : undefined,
          position: [node.position.x, node.position.y]
        } as any;
        console.log('Mapping node to backend format:', {
          original: node,
          backend: backendNode
        });
        return backendNode;
      });

      const backendConnections = edges.map(edge => ({
        source: edge.source,
        target: edge.target,
      }));

      const triggerNode = nodes.find(n => getNodeConfig(n.type || '').isTrigger);
      const triggerType = triggerNode?.type || 'manual';

      const workflowData = {
        title: workflowTitle,
        isActive: isWorkflowActive,
        triggerType,
        nodes: backendNodes,
        connections: backendConnections
      };

      console.log('Saving workflow data:', workflowData);

      if (workflowId) {
        const response = await updateWorkflow(workflowId, workflowData);
        if (response.data) {
          const returnedToken = response.data.webhookToken;
          setNodes((nds: any[]) => nds.map((n: any) => ({
            ...n,
            data: {
              ...n.data,
              workflowId: workflowId,
              webhookToken: (n.type === 'webhook' && returnedToken) ? returnedToken : (n.data.webhookToken || returnedToken)
            }
          })));
        }
        alert('Workflow saved!');
      } else {
        const response = await createWorkflow(workflowData);
        const newId = response.data?.id || response.id;
        const webhookToken = response.data?.webhookToken;

        if (newId) {
          setWorkflowId(newId);
          setNodes((nds: any[]) => nds.map((n: any) => ({
            ...n,
            data: {
              ...n.data,
              workflowId: newId,
              webhookToken: n.type === 'webhook' ? webhookToken : n.data.webhookToken
            }
          })));
          navigate(`/workflow/${newId}`);
          alert('Workflow created! You can now execute it.');
        }
      }
    } catch (error: any) {
      console.error('Error saving:', error);
      alert(`Failed to save: ${error.response?.data?.error || error.message}`);
    } finally {
      setIsSaving(false);
    }
  }, [nodes, edges, workflowTitle, isWorkflowActive, workflowId, setIsSaving, setWorkflowId, navigate]);

  const handleExecute = useCallback(async () => {
    if (nodes.length === 0) {
      alert('Add nodes to your workflow first.');
      return;
    }

    const triggerNode = nodes.find(n => getNodeConfig(n.type || '').isTrigger);
    if (!triggerNode) {
      alert('Add a trigger node (Webhook, Manual, or Schedule).');
      return;
    }

    if (!workflowId) {
      alert('Save the workflow first.');
      return;
    }

    try {
      setIsExecuting(true);

      const response = await manualExecute(workflowId);
      const executionId = response.data?.executionId;

      console.log(`Execution started: ${executionId}`);

      
      if (executionId && startExecutionTracking) {
        startExecutionTracking(executionId, nodes, edges);
      } else {
        setTimeout(() => {
          setIsExecuting(false);
          alert(`Execution completed! ID: ${executionId}`);
        }, 2000);
      }
    } catch (error: any) {
      console.error('Error executing:', error);
      alert(`Failed to execute:\n\n${error.response?.data?.error || error.message}`);
      setIsExecuting(false);
    }
  }, [nodes, edges, workflowId, setIsExecuting, startExecutionTracking]);

  const handleWebhookExecute = useCallback(async () => {
    if (!nodes.find(n => n.type === 'webhook')) {
      alert('Add a Webhook node first.');
      return;
    }

    if (!workflowId) {
      alert('Save the workflow first.');
      return;
    }

    try {
      const response = await webhookExecute(workflowId);
      alert(`Webhook execution started!\n\nID: ${response.data?.executionId}`);
    } catch (error: any) {
      console.error('Error executing webhook:', error);
      alert(`Failed: ${error.response?.data?.error || error.message}`);
    }
  }, [nodes, workflowId]);

  return {
    handleTitleChange,
    handleToggleActive,
    handleNewWorkflow,
    handleSave,
    handleExecute,
    handleWebhookExecute
  };
};

