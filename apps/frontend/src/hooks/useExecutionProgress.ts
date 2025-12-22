import { useCallback, useRef } from 'react';
import {  getExecutionById } from '../services/execution.service';

interface UseExecutionProgressProps {
  setNodes: (updater: (nodes: any[]) => any[]) => void;
  setIsExecuting: (executing: boolean) => void;
}

export const useExecutionProgress = ({ setNodes, setIsExecuting }: UseExecutionProgressProps) => {
  const pollingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const currentExecutionIdRef = useRef<string | null>(null);
  const isExecutingRef = useRef<boolean>(false);
  const lastCompletedNodesRef = useRef<string[]>([]);

  const resetNodeStates = useCallback(() => {
    console.log('Resetting all node states');
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
  }, [setNodes]);

  // Update node states based on real-time backend progress
  const updateNodeStates = useCallback((progress: {
    currentNode: string | null;
    completedNodes: string[];
    nodeResults: Record<string, any>;
    status: string;
  }) => {
    setNodes((nodes: any[]) =>
      nodes.map((node: any) => {
        const nodeResult = progress.nodeResults?.[node.id];
        const isCompleted = progress.completedNodes?.includes(node.id);
        const isCurrentlyExecuting = progress.currentNode === node.id;
        const hasError = nodeResult?.success === false;

        return {
          ...node,
          data: {
            ...node.data,
            isExecuting: isCurrentlyExecuting,
            isExecuted: isCompleted && !hasError,
            hasError: hasError
          }
        };
      })
    );
  }, [setNodes]);

  // Poll for real-time execution progress
  const pollExecutionProgress = useCallback(async (executionId: string) => {
    try {
      // Get detailed execution info (includes results with currentNode)
      const detailsResponse = await getExecutionById(executionId);
      const execution = detailsResponse.data;
      
      const status = execution?.status;
      const results = execution?.results || {};
      
      console.log('📊 Polling progress:', {
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
        console.log('✅ Execution completed successfully');
        // Mark ALL executed nodes as completed
        setNodes((nodes: any[]) =>
          nodes.map((node: any) => {
            const isInOrder = results.executionOrder?.includes(node.id);
            const nodeResult = results.nodeResults?.[node.id];
            const hasError = nodeResult?.success === false;
            
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
        setIsExecuting(false);
        return true;
      } else if (status === 'failed') {
        console.log('Execution failed');
        // Show error state
        setNodes((nodes: any[]) =>
          nodes.map((node: any) => {
            const nodeResult = results.nodeResults?.[node.id];
            const isCompleted = results.completedNodes?.includes(node.id) || 
                               results.executionOrder?.includes(node.id);
            const hasError = nodeResult?.success === false;
            
            return {
              ...node,
              data: {
                ...node.data,
                isExecuting: false,
                isExecuted: isCompleted && !hasError,
                hasError: hasError || (node.data?.isExecuting && status === 'failed')
              }
            };
          })
        );
        setIsExecuting(false);
        return true;
      }

      return false; // Still running
    } catch (error) {
      console.error('Error polling execution progress:', error);
      return false;
    }
  }, [setNodes, setIsExecuting, updateNodeStates]);

  // Full stop - clears polling
  const stopTracking = useCallback(() => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
    currentExecutionIdRef.current = null;
    isExecutingRef.current = false;
    lastCompletedNodesRef.current = [];
    console.log('Stopped execution progress tracking');
  }, []);

  // Start tracking execution progress
  const startTracking = useCallback((executionId: string, _nodes: any[], _edges: any[]) => {
    // Prevent overlapping executions
    if (isExecutingRef.current) {
      console.warn('Execution already in progress, ignoring new execution request');
      return;
    }

    console.log('🚀 Starting real-time execution tracking:', executionId);

    // Mark as executing
    isExecutingRef.current = true;

    // Stop any existing tracking
    stopTracking();

    // Reset all node states
    resetNodeStates();

    // Store execution ID
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

    // Then poll every 500ms for near real-time updates
    pollingIntervalRef.current = setInterval(pollForProgress, 500);

  }, [resetNodeStates, pollExecutionProgress, stopTracking]);

  return {
    startTracking,
    stopTracking,
    resetNodeStates
  };
};