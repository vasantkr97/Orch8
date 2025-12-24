import { useState, useCallback, useEffect, useRef } from 'react';
import { useNodesState, useEdgesState } from '@xyflow/react';
import { useLocation } from 'react-router-dom';

const STORAGE_PREFIX = 'orch8_workflow_';

export const useWorkflowState = () => {
  const location = useLocation();
  const [workflowId, setWorkflowId] = useState<string | null>(null);
  const [workflowTitle, setWorkflowTitle] = useState('Untitled Workflow');
  const [isWorkflowActive, setIsWorkflowActive] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [isLoadingWorkflow, setIsLoadingWorkflow] = useState(false);

  const [nodes, setNodesState, onNodesChange] = useNodesState([]);
  const [edges, setEdgesState, onEdgesChange] = useEdgesState([]);

  // Determine URL mode ONCE per route
  const urlWorkflowId = location.pathname.includes('/workflow/') 
    ? location.pathname.split('/workflow/')[1]?.split('?')[0]  // Handle query params
    : null;

  // Track if draft has been loaded (only relevant when NOT on URL route)
  const draftLoaded = useRef(false);

  const getStorageKey = (id: string | null) => `${STORAGE_PREFIX}${id || 'draft'}`;

  // Load Draft ONLY when:
  // 1. We are NOT on a URL-based workflow route
  // 2. We haven't loaded the draft yet
  useEffect(() => {
    // CRITICAL: If we are on a URL workflow, do NOT touch draft at all
    if (urlWorkflowId) {
      return;
    }

    // Only load draft once
    if (draftLoaded.current) {
      return;
    }

    try {
      const draftKey = getStorageKey(null);
      const stored = localStorage.getItem(draftKey);
      if (stored) {
        const data = JSON.parse(stored);
        console.log('📥 Loading Draft from localStorage');
        if (data.workflowTitle) setWorkflowTitle(data.workflowTitle);
        if (data.nodes) setNodesState(data.nodes);
        if (data.edges) setEdgesState(data.edges);
      }
    } catch (e) {
      console.error('Error loading draft', e);
    } finally {
      draftLoaded.current = true;
    }
  }, [urlWorkflowId, setNodesState, setEdgesState]);


  // Persistence Logic
  const saveTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  // Track if we have saved at least once (to avoid saving empty initial state)
  const hasSavedOnce = useRef(false);

  const saveToStorage = useCallback((id: string | null, data: {
    workflowId: string | null;
    workflowTitle: string;
    isWorkflowActive: boolean;
    nodes: any[];
    edges: any[];
  }) => {
    // Clear existing timeout
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);

    // Debounce save (500ms)
    saveTimeoutRef.current = setTimeout(() => {
      try {
        const key = getStorageKey(id);
        localStorage.setItem(key, JSON.stringify(data));
        // console.log('💾 Auto-saved to', key);
      } catch (error) {
        console.error('Error saving to localStorage:', error);
      }
    }, 500);
  }, []);

  // Watch for changes and save
  useEffect(() => {
    // Don't save while loading (prevents overwriting with empty state on mount)
    if (isLoadingWorkflow) return;
    
    // Don't save if we have no nodes AND we haven't saved before
    // This prevents saving empty state on initial mount
    if (nodes.length === 0 && edges.length === 0 && !hasSavedOnce.current) {
      return;
    }
    
    hasSavedOnce.current = true;

    // Determine correct storage key:
    // - If we have a workflowId (set by loader or by saving), use that
    // - Otherwise use 'draft'
    const keyId = workflowId || null;

    saveToStorage(keyId, {
      workflowId,
      workflowTitle,
      isWorkflowActive,
      nodes,
      edges
    });
  }, [workflowId, workflowTitle, isWorkflowActive, nodes, edges, isLoadingWorkflow, saveToStorage]);


  // Clean up timeout
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, []);

  const resetWorkflow = useCallback(() => {
    setNodesState([]);
    setEdgesState([]);
    setWorkflowTitle('Untitled Workflow');
    setIsWorkflowActive(false);
    setWorkflowId(null);
    hasSavedOnce.current = false;
    draftLoaded.current = false;

    // Clear the DRAFT storage
    localStorage.removeItem(getStorageKey(null));
  }, [setNodesState, setEdgesState]);

  return {
    workflowId,
    setWorkflowId,
    workflowTitle,
    setWorkflowTitle,
    isWorkflowActive,
    setIsWorkflowActive,
    isSaving,
    setIsSaving,
    isExecuting,
    setIsExecuting,
    isLoadingWorkflow,
    setIsLoadingWorkflow,
    nodes,
    setNodes: setNodesState,
    onNodesChange,
    edges,
    setEdges: setEdgesState,
    onEdgesChange,
    resetWorkflow
  };
};

