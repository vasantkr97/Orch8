import { useCallback } from 'react';
import { addEdge, type Connection } from '@xyflow/react';
import { createOrch8Edge } from '../components/edges/edgeTypes';
import { createOrch8Node, getNodeConfig } from '../components/nodes/nodeTypes';

const generateId = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

interface UseNodeActionsProps {
  workflowId: string | null;
  setNodes: any;
  setEdges: any;
  webhookToken?: string | null;
}

export const useNodeActions = ({ workflowId, setNodes, setEdges, webhookToken }: UseNodeActionsProps) => {
  
  const onConnect = useCallback((params: Connection) => {
    const newEdge = createOrch8Edge(
      `e${params.source}-${params.target}`,
      params.source!,
      params.target!,
      { itemCount: 1 }
    );
    setEdges((eds: any) => addEdge(newEdge, eds));
  }, [setEdges]);

  const handleNodeSelect = useCallback((nodeType: string) => {
    const newNodeId = generateId();
    const cfg = getNodeConfig(nodeType);
    
    const position = {
      x: (window.innerWidth / 2) - 100,
      y: (window.innerHeight / 2) - 50
    };

    const newNode = createOrch8Node(newNodeId, nodeType, position, {
      ...cfg,
      label: cfg.label,
      description: cfg.description,
      workflowId: workflowId,
      // Pass webhookToken if this is a webhook node and we have one
      ...(nodeType === 'webhook' && webhookToken && { webhookToken }),
      onQuickUpdate: (partial: any) => {
        setNodes((nodes: any) => nodes.map((n: any) => {
          if (n.id !== newNodeId) return n;
          const nextData = { ...n.data };
          // merge credentialsId directly under data
          if (partial && Object.prototype.hasOwnProperty.call(partial, 'credentialsId')) {
            nextData.credentialsId = partial.credentialsId;
          }
          // merge parameters
          if (partial && partial.parameters) {
            nextData.parameters = { ...(n.data?.parameters || {}), ...partial.parameters };
          }
          // also allow direct shallow fields (e.g., usePreviousResult fallback)
          if (partial && Object.prototype.hasOwnProperty.call(partial, 'usePreviousResult')) {
            nextData.parameters = { ...(n.data?.parameters || {}), usePreviousResult: partial.usePreviousResult };
          }
          return { ...n, data: nextData };
        }));
      },
    } as any);

    setNodes((nds: any) => [...nds, newNode]);
  }, [setNodes, workflowId]);

  const handleUpdateNodeData = useCallback((nodeId: string, data: any) => {
    setNodes((nodes: any) =>
      nodes.map((n: any) => {
        if (n.id === nodeId) {
          return { ...n, data: { ...n.data, ...data } };
        }
        return n;
      })
    );
  }, [setNodes]);

  return {
    onConnect,
    handleNodeSelect,
    handleUpdateNodeData
  };
};

