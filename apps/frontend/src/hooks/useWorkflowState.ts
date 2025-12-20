import { useState, useCallback, useEffect } from 'react';
import { useNodesState, useEdgesState } from '@xyflow/react';
import { useLocation } from 'react-router-dom';

const WORKFLOW_STORAGE_KEY = 'orch8_current_workflow';

export const useWorkflowState = () => {
  const location = useLocation();
  const [workflowId, setWorkflowId] = useState<string | null>(null);
  const [workflowTitle, setWorkflowTitle] = useState('Untitled Workflow');
  const [isWorkflowActive, setIsWorkflowActive] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [isLoadingWorkflow, setIsLoadingWorkflow] = useState(false);
  const [hasLoadedFromStorage, setHasLoadedFromStorage] = useState(false);

  const [nodes, setNodesState, onNodesChange] = useNodesState([]);
  const [edges, setEdgesState, onEdgesChange] = useEdgesState([]);

  // Check if we're on a URL-based workflow route
  const isUrlWorkflow = location.pathname.includes('/workflow/') && location.pathname.split('/workflow/')[1];

  // Load from localStorage only once and only if not on URL workflow
  useEffect(() => {
    if (hasLoadedFromStorage || isUrlWorkflow) return;

    try {
      const stored = localStorage.getItem(WORKFLOW_STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        console.log('📥 Loading workflow from localStorage:', data.workflowTitle);

        if (data.workflowId) setWorkflowId(data.workflowId);
        if (data.workflowTitle) setWorkflowTitle(data.workflowTitle);
        if (data.isWorkflowActive !== undefined) setIsWorkflowActive(data.isWorkflowActive);
        if (data.nodes && data.nodes.length > 0) setNodesState(data.nodes);
        if (data.edges && data.edges.length > 0) setEdgesState(data.edges);
      }
    } catch (error) {
      console.error('Error loading from localStorage:', error);
    } finally {
      setHasLoadedFromStorage(true);
    }
  }, [hasLoadedFromStorage, isUrlWorkflow]);

  // Save to localStorage (only when not on URL workflow)
  const saveToStorage = useCallback((data: any) => {
    if (isUrlWorkflow) return; // Don't save when viewing URL-based workflow

    try {
      localStorage.setItem(WORKFLOW_STORAGE_KEY, JSON.stringify(data));
      console.log('Saved to localStorage:', data.workflowTitle);
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }, [isUrlWorkflow]);

  // Smart setters that save to localStorage when appropriate
  const setWorkflowIdWithStorage = useCallback((id: string | null) => {
    setWorkflowId(id);
    if (!isUrlWorkflow) {
      saveToStorage({ workflowId: id, workflowTitle, isWorkflowActive, nodes, edges });
    }
  }, [workflowTitle, isWorkflowActive, nodes, edges, saveToStorage, isUrlWorkflow]);

  const setWorkflowTitleWithStorage = useCallback((title: string) => {
    setWorkflowTitle(title);
    if (!isUrlWorkflow) {
      saveToStorage({ workflowId, workflowTitle: title, isWorkflowActive, nodes, edges });
    }
  }, [workflowId, isWorkflowActive, nodes, edges, saveToStorage, isUrlWorkflow]);

  const setIsWorkflowActiveWithStorage = useCallback((active: boolean) => {
    setIsWorkflowActive(active);
    if (!isUrlWorkflow) {
      saveToStorage({ workflowId, workflowTitle, isWorkflowActive: active, nodes, edges });
    }
  }, [workflowId, workflowTitle, nodes, edges, saveToStorage, isUrlWorkflow]);

  const setNodes = useCallback((nodesOrUpdater: any) => {
    setNodesState((currentNodes: any[]) => {
      const newNodes = typeof nodesOrUpdater === 'function' ? nodesOrUpdater(currentNodes) : nodesOrUpdater;
      // Save after state update (debounced)
      if (!isUrlWorkflow) {
        setTimeout(() => {
          saveToStorage({ workflowId, workflowTitle, isWorkflowActive, nodes: newNodes, edges });
        }, 500);
      }
      return newNodes;
    });
  }, [workflowId, workflowTitle, isWorkflowActive, edges, saveToStorage, isUrlWorkflow]);

  const setEdges = useCallback((edgesOrUpdater: any) => {
    setEdgesState((currentEdges: any[]) => {
      const newEdges = typeof edgesOrUpdater === 'function' ? edgesOrUpdater(currentEdges) : edgesOrUpdater;
      // Save after state update (debounced)
      if (!isUrlWorkflow) {
        setTimeout(() => {
          saveToStorage({ workflowId, workflowTitle, isWorkflowActive, nodes, edges: newEdges });
        }, 500);
      }
      return newEdges;
    });
  }, [workflowId, workflowTitle, isWorkflowActive, nodes, saveToStorage, isUrlWorkflow]);

  const resetWorkflow = useCallback(() => {
    setNodesState([]);
    setEdgesState([]);
    setWorkflowTitle('Untitled Workflow');
    setIsWorkflowActive(false);
    setWorkflowId(null);
    localStorage.removeItem(WORKFLOW_STORAGE_KEY);
  }, []);

  return {
    workflowId,
    setWorkflowId: setWorkflowIdWithStorage,
    workflowTitle,
    setWorkflowTitle: setWorkflowTitleWithStorage,
    isWorkflowActive,
    setIsWorkflowActive: setIsWorkflowActiveWithStorage,
    isSaving,
    setIsSaving,
    isExecuting,
    setIsExecuting,
    isLoadingWorkflow,
    setIsLoadingWorkflow,
    nodes,
    setNodes,
    onNodesChange,
    edges,
    setEdges,
    onEdgesChange,
    resetWorkflow
  };
};

