import { useCallback, useRef } from 'react';
import { getExecutionStatus } from '../services/execution.service';

interface UseExecutionProgressProps {
  setNodes: (updater: (nodes: any[]) => any[]) => void;
  setIsExecuting: (executing: boolean) => void;
}

export const useExecutionProgress = ({ setNodes, setIsExecuting }: UseExecutionProgressProps) => {
  const pollingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const currentExecutionIdRef = useRef<string | null>(null);
  const executionStartTimeRef = useRef<number>(0);
  const animationTimeoutsRef = useRef<NodeJS.Timeout[]>([]);
  const isExecutingRef = useRef<boolean>(false);

  const resetNodeStates = useCallback(() => {
    console.log('Resetting all node states');
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

  // Clear all animation timeouts
  const clearAnimationTimeouts = useCallback(() => {
    animationTimeoutsRef.current.forEach(timeout => clearTimeout(timeout));
    animationTimeoutsRef.current = [];
  }, []);

  // Simulate execution progress based on actual execution results
  const simulateProgressFromResults = useCallback((executionResults: any, nodes: any[]) => {
    console.log('Simulating progress from execution results:', executionResults);
    
    // Clear any existing animation timeouts BEFORE starting new ones
    clearAnimationTimeouts();
    
    // Extract node execution order from results - these are NODE IDs, not labels
    const executedNodeIds = Object.keys(executionResults);
    console.log('Executed node IDs from results:', executedNodeIds);
    
    // Create a map of node IDs to nodes for quick lookup
    const nodeById = new Map<string, any>();
    const nodeByLabel = new Map<string, any>();
    nodes.forEach(node => {
      nodeById.set(node.id, node);
      const label = node.data?.label || node.id;
      nodeByLabel.set(label, node);
    });
    
    // Create execution sequence based on results
    const executionSequence: string[] = [];
    
    // First, add trigger nodes from the results
    executedNodeIds.forEach(nodeId => {
      const node = nodeById.get(nodeId);
      if (node && node.data?.isTrigger) {
        if (!executionSequence.includes(nodeId)) {
          executionSequence.push(nodeId);
        }
      }
    });
    
    // Then add all other executed nodes in order
    executedNodeIds.forEach(nodeId => {
      // Check if this is a direct node ID match
      if (nodeById.has(nodeId)) {
        if (!executionSequence.includes(nodeId)) {
          executionSequence.push(nodeId);
        }
      } else {
        // Maybe it's a label, try to find by label
        const nodeByLabelMatch = nodeByLabel.get(nodeId);
        if (nodeByLabelMatch && !executionSequence.includes(nodeByLabelMatch.id)) {
          executionSequence.push(nodeByLabelMatch.id);
        }
      }
    });
    
    // Add any nodes that weren't in execution results but exist in workflow (fallback)
    nodes.forEach(node => {
      if (!executionSequence.includes(node.id)) {
        executionSequence.push(node.id);
      }
    });
    
    console.log('Execution sequence:', executionSequence.map(id => {
      const node = nodes.find(n => n.id === id);
      return node?.data?.label || id;
    }));
    
    // Execute nodes in sequence
    let currentIndex = 0;
    
    const executeNextNode = () => {
      if (currentIndex < executionSequence.length) {
        const currentNodeId = executionSequence[currentIndex];
        const currentNode = nodes.find(n => n.id === currentNodeId);
        
        if (currentNode) {
          console.log(`🔵 Executing node: ${currentNode.data?.label || currentNodeId}`);
          
          // Mark current node as executing
          setNodes((nodes: any[]) => 
            nodes.map((node: any) => {
              if (node.id === currentNodeId) {
                return {
                  ...node,
                  data: {
                    ...node.data,
                    isExecuting: true,
                    isExecuted: false,
                    hasError: false
                  }
                };
              }
              return node;
            })
          );
          
          // After 1.5 seconds, mark as completed and move to next
          const timeout1 = setTimeout(() => {
            setNodes((nodes: any[]) => 
              nodes.map((node: any) => {
                if (node.id === currentNodeId) {
                  return {
                    ...node,
                    data: {
                      ...node.data,
                      isExecuting: false,
                      isExecuted: true,
                      hasError: false
                    }
                  };
                }
                return node;
              })
            );
            
            console.log(`Completed node: ${currentNode.data?.label || currentNodeId}`);
            currentIndex++;
            
            // Continue with next node after a short delay
            const timeout2 = setTimeout(executeNextNode, 500);
            animationTimeoutsRef.current.push(timeout2);
          }, 1500);
          animationTimeoutsRef.current.push(timeout1);
        } else {
          // Skip if node not found
          currentIndex++;
          const timeout = setTimeout(executeNextNode, 100);
          animationTimeoutsRef.current.push(timeout);
        }
      } else {
        console.log('All nodes completed');
        isExecutingRef.current = false;
      }
    };
    
    // Start execution
    executeNextNode();
  }, [setNodes, clearAnimationTimeouts]);

  // Poll execution status and get results
  const pollExecutionStatus = useCallback(async (executionId: string, nodes: any[]) => {
    try {
      const response = await getExecutionStatus(executionId);
      // Backend returns { success: true, data: "SUCCESS" } where data is the status string
      const status = response.data;
      
      console.log('Execution status:', status, response);
      
      if (status === 'success') {
        console.log('Execution completed successfully');
        
        // Try to get detailed results
        try {
          const { getExecutionById } = await import('../services/execution.service');
          const detailsResponse = await getExecutionById(executionId);
          const executionResults = detailsResponse.data?.results || detailsResponse.results;
          
          if (executionResults) {
            console.log('Got execution results:', executionResults);
            // Use actual results to show progress
            simulateProgressFromResults(executionResults, nodes);
          } else {
            console.log('No results found, using fallback progress');
            // Fallback: mark all nodes as completed
            setTimeout(() => {
              setNodes((nodes: any[]) => 
                nodes.map((node: any) => ({
                  ...node,
                  data: {
                    ...node.data,
                    isExecuting: false,
                    isExecuted: true,
                    hasError: false
                  }
                }))
              );
            }, 1000);
          }
        } catch (detailsError) {
          console.error('Error getting execution details:', detailsError);
          // Fallback progress
          setTimeout(() => {
            setNodes((nodes: any[]) => 
              nodes.map((node: any) => ({
                ...node,
                data: {
                  ...node.data,
                  isExecuting: false,
                  isExecuted: true,
                  hasError: false
                }
              }))
            );
          }, 1000);
        }
        
        // Stop tracking will be handled by the caller
        setIsExecuting(false);
        return true; // Execution completed
      } else if (status === 'failed') {
        console.log('Execution failed');
        // Mark all nodes as error state
        setNodes((nodes: any[]) => 
          nodes.map((node: any) => ({
            ...node,
            data: {
              ...node.data,
              isExecuting: false,
              isExecuted: false,
              hasError: true
            }
          }))
        );
        // Stop tracking will be handled by the caller
        setIsExecuting(false);
        return true; // Execution completed (with error)
      }
      
      return false; // Still running
    } catch (error) {
      console.error('Error polling execution status:', error);
      return false;
    }
  }, [setNodes, setIsExecuting, simulateProgressFromResults]);

  // Start tracking execution progress
  const startTracking = useCallback((executionId: string) => {
    // Prevent overlapping executions
    if (isExecutingRef.current) {
      console.warn('Execution already in progress, ignoring new execution request');
      return;
    }
    
    console.log('Starting execution progress tracking:', executionId);
    
    // Mark as executing
    isExecutingRef.current = true;
    
    // Clear any existing timeouts and intervals
    clearAnimationTimeouts();
    stopTracking();
    
    // Reset all node states
    resetNodeStates();
    
    // Store execution details
    currentExecutionIdRef.current = executionId;
    executionStartTimeRef.current = Date.now();
    
    // Stop only the polling interval, keep animations running
    const stopPollingOnly = () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
      currentExecutionIdRef.current = null;
      console.log('Stopped polling, animation continues');
    };

    // Start status polling immediately and every 2 seconds
    const pollWithNodes = async () => {
      setNodes((currentNodes: any[]) => {
        if (currentExecutionIdRef.current) {
          pollExecutionStatus(currentExecutionIdRef.current, currentNodes).then(completed => {
            if (completed) {
              // Only stop polling, NOT the animations!
              stopPollingOnly();
            }
          });
        }
        return currentNodes;
      });
    };
    
    // Initial poll after 1 second
    setTimeout(pollWithNodes, 1000);
    
    // Then poll every 2 seconds
    pollingIntervalRef.current = setInterval(pollWithNodes, 2000);
    
  }, [resetNodeStates, pollExecutionStatus, setNodes, clearAnimationTimeouts]);

  // Full stop - clears polling AND animations (for cleanup or user cancellation)
  const stopTracking = useCallback(() => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
    clearAnimationTimeouts();
    currentExecutionIdRef.current = null;
    executionStartTimeRef.current = 0;
    isExecutingRef.current = false;
    console.log('Stopped execution progress tracking (full stop)');
  }, [clearAnimationTimeouts]);

  return {
    startTracking,
    stopTracking,
    resetNodeStates
  };
};