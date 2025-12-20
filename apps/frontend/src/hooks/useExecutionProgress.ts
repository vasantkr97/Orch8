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

  const resetNodeStates = useCallback(() => {
    console.log('🔄 Resetting all node states');
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

  // Simulate execution progress based on actual execution results
  const simulateProgressFromResults = useCallback((executionResults: any, nodes: any[]) => {
    console.log('Simulating progress from execution results:', executionResults);
    
    // Extract node execution order from results
    const executedNodeNames = Object.keys(executionResults);
    console.log('Executed nodes:', executedNodeNames);
    
    // Map result names to actual node IDs
    const nodeMap = new Map();
    nodes.forEach(node => {
      const label = node.data?.label || node.id;
      nodeMap.set(label, node.id);
      // Also try exact match with node ID
      nodeMap.set(node.id, node.id);
    });
    
    // Create execution sequence
    const executionSequence: string[] = [];
    
    // Add trigger nodes first
    const triggerNodes = nodes.filter(n => n.data?.isTrigger);
    triggerNodes.forEach(node => {
      executionSequence.push(node.id);
    });
    
    // Add other nodes based on execution results
    executedNodeNames.forEach(nodeName => {
      const nodeId = nodeMap.get(nodeName);
      if (nodeId && !executionSequence.includes(nodeId)) {
        executionSequence.push(nodeId);
      }
    });
    
    // Add any remaining nodes that weren't in results
    nodes.forEach(node => {
      if (!executionSequence.includes(node.id) && !node.data?.isTrigger) {
        executionSequence.push(node.id);
      }
    });
    
    console.log('🔄 Execution sequence:', executionSequence.map(id => {
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
          setTimeout(() => {
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
            
            console.log(`✅ Completed node: ${currentNode.data?.label || currentNodeId}`);
            currentIndex++;
            
            // Continue with next node after a short delay
            setTimeout(executeNextNode, 500);
          }, 1500);
        } else {
          // Skip if node not found
          currentIndex++;
          setTimeout(executeNextNode, 100);
        }
      } else {
        console.log('🎉 All nodes completed');
      }
    };
    
    // Start execution
    executeNextNode();
  }, [setNodes]);

  // Poll execution status and get results
  const pollExecutionStatus = useCallback(async (executionId: string, nodes: any[]) => {
    try {
      const response = await getExecutionStatus(executionId);
      const status = response.status || response.data?.status;
      
      console.log('📊 Execution status:', status, response);
      
      if (status === 'SUCCESS') {
        console.log('✅ Execution completed successfully');
        
        // Try to get detailed results
        try {
          const { getExecutionById } = await import('../services/execution.service');
          const detailsResponse = await getExecutionById(executionId);
          const executionResults = detailsResponse.data?.results || detailsResponse.results;
          
          if (executionResults) {
            console.log('📋 Got execution results:', executionResults);
            // Use actual results to show progress
            simulateProgressFromResults(executionResults, nodes);
          } else {
            console.log('⚠️ No results found, using fallback progress');
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
      } else if (status === 'FAILED') {
        console.log('❌ Execution failed');
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
    console.log('🚀 Starting execution progress tracking:', executionId);
    
    // Reset all node states
    resetNodeStates();
    
    // Store execution details
    currentExecutionIdRef.current = executionId;
    executionStartTimeRef.current = Date.now();
    
    // Start status polling immediately and every 2 seconds
    const pollWithNodes = async () => {
      setNodes((currentNodes: any[]) => {
        if (currentExecutionIdRef.current) {
          pollExecutionStatus(currentExecutionIdRef.current, currentNodes).then(completed => {
            if (completed) {
              stopTracking();
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
    
  }, [resetNodeStates, pollExecutionStatus, setNodes]);

  // Stop tracking
  const stopTracking = useCallback(() => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
    currentExecutionIdRef.current = null;
    executionStartTimeRef.current = 0;
    console.log('🛑 Stopped execution progress tracking');
  }, []);

  return {
    startTracking,
    stopTracking,
    resetNodeStates
  };
};