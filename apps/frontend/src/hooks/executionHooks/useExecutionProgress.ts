import { useCallback, useRef } from 'react';
import { getExecutionById } from '../../services/execution.service';

interface UseExecutionProgressProps {
  setNodes: (updater: any) => void;
  setEdges: (updater: any) => void;
  setIsExecuting: (executing: boolean) => void;
}

export const useExecutionProgress = ({ setNodes, setEdges, setIsExecuting }: UseExecutionProgressProps) => {
  const pollingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const currentExecutionIdRef = useRef<string | null>(null);
  const isExecutingRef = useRef<boolean>(false);
  const lastCompletedNodesRef = useRef<string[]>([]);

  // Update edge states based on their target node's execution state
  // Edge shows as "executing" when data is flowing INTO the target node
  const updateEdgeStates = useCallback((nodeStates: Map<string, { isExecuting: boolean; isExecuted: boolean; hasError: boolean }>) => {
    setEdges((edges: any[]) =>
      edges.map((edge: any) => {
        const targetState = nodeStates.get(edge.target);
        const sourceState = nodeStates.get(edge.source);
        if (!targetState) return edge;

        return {
          ...edge,
          data: {
            ...edge.data,
            isExecuting: targetState.isExecuting,
            hasExecuted: sourceState?.isExecuted || false,
            hasError: targetState.hasError
          }
        };
      })
    );
  }, [setEdges]);

  const resetNodeStates = useCallback(() => {
    console.log('Resetting all node and edge states');
    lastCompletedNodesRef.current = [];
    setNodes((nodes: any[]) =>
      nodes.map((node: any) => ({
        ...node,
        data: {
          ...node.data,
          isExecuting: false,
          isExecuted: false,
          hasError: false
        }
      }))
    );
    setEdges((edges: any[]) =>
      edges.map((edge: any) => ({
        ...edge,
        data: {
          ...edge.data,
          isExecuting: false,
          hasExecuted: false,
          hasError: false
        }
      }))
    );
  }, [setNodes, setEdges]);

  // Update node states based on real-time backend progress
  const updateNodeStates = useCallback((progress: {
    currentNode: string | null;
    completedNodes: string[];
    nodeResults: Record<string, any>;
    status: string;
  }) => {
    // Build node states map for edge updates
    const nodeStatesMap = new Map<string, { isExecuting: boolean; isExecuted: boolean; hasError: boolean }>();

    setNodes((nodes: any[]) => {
      const updatedNodes = nodes.map((node: any) => {
        const nodeResult = progress.nodeResults?.[node.id];
        const isCompleted = progress.completedNodes?.includes(node.id);
        const isCurrentlyExecuting = progress.currentNode === node.id;
        const hasError = nodeResult?.success === false;

        // Store state for edge updates
        nodeStatesMap.set(node.id, {
          isExecuting: isCurrentlyExecuting,
          isExecuted: isCompleted && !hasError,
          hasError: hasError
        });

        return {
          ...node,
          data: {
            ...node.data,
            isExecuting: isCurrentlyExecuting,
            isExecuted: isCompleted && !hasError,
            hasError: hasError
          }
        };
      });
      return updatedNodes;
    });

    // Update edge states based on node states
    updateEdgeStates(nodeStatesMap);
  }, [setNodes, updateEdgeStates]);

  // Poll for real-time execution progress
  const pollExecutionProgress = useCallback(async (executionId: string) => {
    try {
      // Get detailed execution info (includes results with currentNode)
      const detailsResponse = await getExecutionById(executionId);
      const execution = detailsResponse.data;

      const status = execution?.status;
      const results = execution?.results || {};

      console.log('Polling progress:', {
        status,
        currentNode: results.currentNode,
        completedNodes: results.completedNodes?.length || 0
      });

      // Update node visual states based on real backend progress
      updateNodeStates({
        currentNode: results.currentNode,
        completedNodes: results.completedNodes || results.executionOrder || [],
        nodeResults: results.nodeResults || {},
        status
      });

      // Check if execution is complete
      if (status === 'success') {
        console.log('Execution completed successfully');
        // Build final node states map for edge updates
        const finalNodeStates = new Map<string, { isExecuting: boolean; isExecuted: boolean; hasError: boolean }>();
        
        // Mark ALL executed nodes as completed
        setNodes((nodes: any[]) =>
          nodes.map((node: any) => {
            const isInOrder = results.executionOrder?.includes(node.id);
            const nodeResult = results.nodeResults?.[node.id];
            const hasError = nodeResult?.success === false;

            finalNodeStates.set(node.id, {
              isExecuting: false,
              isExecuted: isInOrder && !hasError,
              hasError: hasError
            });

            return {
              ...node,
              data: {
                ...node.data,
                isExecuting: false,
                isExecuted: isInOrder && !hasError,
                hasError: hasError
              }
            };
          })
        );
        // Update edges for final state
        updateEdgeStates(finalNodeStates);
        setIsExecuting(false);
        return true;
      } else if (status === 'failed') {
        console.log('Execution failed');
        // Build error node states map for edge updates
        const errorNodeStates = new Map<string, { isExecuting: boolean; isExecuted: boolean; hasError: boolean }>();
        
        // Show error state
        setNodes((nodes: any[]) =>
          nodes.map((node: any) => {
            const nodeResult = results.nodeResults?.[node.id];
            const isCompleted = results.completedNodes?.includes(node.id) ||
              results.executionOrder?.includes(node.id);
            const hasError = nodeResult?.success === false;
            const nodeHasError = hasError || (node.data?.isExecuting && status === 'failed');

            errorNodeStates.set(node.id, {
              isExecuting: false,
              isExecuted: isCompleted && !hasError,
              hasError: nodeHasError
            });

            return {
              ...node,
              data: {
                ...node.data,
                isExecuting: false,
                isExecuted: isCompleted && !hasError,
                hasError: nodeHasError
              }
            };
          })
        );
        // Update edges for error state
        updateEdgeStates(errorNodeStates);
        setIsExecuting(false);
        return true;
      }

      return false; // Still running
    } catch (error) {
      console.error('Error polling execution progress:', error);
      return false;
    }
  }, [setNodes, setEdges, setIsExecuting, updateNodeStates, updateEdgeStates]);

  // Full stop - clears polling
  const stopTracking = useCallback(() => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }

    currentExecutionIdRef.current = null;
    isExecutingRef.current = false;
    lastCompletedNodesRef.current = [];
  }, []);

  const startTracking = useCallback((executionId: string, _nodes: any[], _edges: any[]) => {
    // Prevent overlapping executions
    if (isExecutingRef.current) {
      console.warn('Execution already in progress, ignoring new execution request');
      return;
    }

    stopTracking();

    isExecutingRef.current = true;

    resetNodeStates();

    currentExecutionIdRef.current = executionId;

    // Poll for progress - start immediately and then every 500ms for real-time updates
    const pollForProgress = async () => {
      if (!currentExecutionIdRef.current) return;

      const completed = await pollExecutionProgress(currentExecutionIdRef.current);
      if (completed) {
        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current);
          pollingIntervalRef.current = null;
        }
        currentExecutionIdRef.current = null;
        isExecutingRef.current = false;
      }
    };

    // Initial poll immediately
    pollForProgress();

    //poll every 500ms for near real-time updates
    pollingIntervalRef.current = setInterval(pollForProgress, 500);

  }, [resetNodeStates, pollExecutionProgress, stopTracking]);

  return {
    startTracking,
    stopTracking,
    resetNodeStates
  };
};