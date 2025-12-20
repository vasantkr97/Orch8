// Helper functions to work with the improved node-based connection system

export interface NodeConnection {
  targetNodeId: string;
  targetHandle?: string;
  sourceHandle?: string;
  data?: {
    label?: string;
    itemCount?: number;
    isExecuting?: boolean;
    hasExecuted?: boolean;
    hasError?: boolean;
  };
}

export interface WorkflowNode {
  id: string;
  nodeId: string;
  type: string;
  position: { x: number; y: number };
  label?: string;
  data?: any;
  style?: any;
  outputs?: NodeConnection[];
  inputs?: NodeConnection[];
}

// Convert node-based connections to React Flow edges
export const convertNodesToReactFlowFormat = (nodes: WorkflowNode[]) => {
  const reactFlowNodes = nodes.map(node => ({
    id: node.nodeId,
    type: 'orch8-node',
    position: node.position,
    data: {
      label: node.label || node.type,
      type: node.type,
      ...node.data
    },
    style: node.style
  }));

  const reactFlowEdges: any[] = [];
  
  // Extract edges from node outputs
  nodes.forEach(node => {
    if (node.outputs) {
      node.outputs.forEach((output, index) => {
        reactFlowEdges.push({
          id: `${node.nodeId}-${output.targetNodeId}-${index}`,
          source: node.nodeId,
          target: output.targetNodeId,
          sourceHandle: output.sourceHandle,
          targetHandle: output.targetHandle,
          type: 'orch8-edge',
          data: output.data || {},
          markerEnd: {
            type: 'arrowclosed',
            width: 20,
            height: 20,
          }
        });
      });
    }
  });

  return { nodes: reactFlowNodes, edges: reactFlowEdges };
};

// Convert React Flow format back to node-based connections
export const convertReactFlowToNodes = (reactFlowNodes: any[], reactFlowEdges: any[]) => {
  const nodes: WorkflowNode[] = reactFlowNodes.map(node => ({
    id: node.id, // This would be the database ID
    nodeId: node.id, // Frontend ID
    type: node.data.type || 'default',
    position: node.position,
    label: node.data.label,
    data: node.data,
    style: node.style,
    outputs: [],
    inputs: []
  }));

  // Group edges by source node
  reactFlowEdges.forEach(edge => {
    const sourceNode = nodes.find(n => n.nodeId === edge.source);
    const targetNode = nodes.find(n => n.nodeId === edge.target);
    
    if (sourceNode) {
      sourceNode.outputs = sourceNode.outputs || [];
      sourceNode.outputs.push({
        targetNodeId: edge.target,
        targetHandle: edge.targetHandle,
        sourceHandle: edge.sourceHandle,
        data: edge.data
      });
    }
    
    if (targetNode) {
      targetNode.inputs = targetNode.inputs || [];
      targetNode.inputs.push({
        targetNodeId: edge.source, // For inputs, this is actually the source
        targetHandle: edge.sourceHandle,
        sourceHandle: edge.targetHandle,
        data: edge.data
      });
    }
  });

  return nodes;
};

// Helper to add a new connection between nodes
export const addNodeConnection = (
  nodes: WorkflowNode[],
  sourceNodeId: string,
  targetNodeId: string,
  connectionData?: Partial<NodeConnection>
) => {
  return nodes.map(node => {
    if (node.nodeId === sourceNodeId) {
      const newConnection: NodeConnection = {
        targetNodeId,
        sourceHandle: connectionData?.sourceHandle || 'default',
        targetHandle: connectionData?.targetHandle || 'default',
        data: connectionData?.data || {}
      };
      
      return {
        ...node,
        outputs: [...(node.outputs || []), newConnection]
      };
    }
    
    if (node.nodeId === targetNodeId) {
      const newInput: NodeConnection = {
        targetNodeId: sourceNodeId, // For inputs, this represents the source
        sourceHandle: connectionData?.sourceHandle || 'default',
        targetHandle: connectionData?.targetHandle || 'default',
        data: connectionData?.data || {}
      };
      
      return {
        ...node,
        inputs: [...(node.inputs || []), newInput]
      };
    }
    
    return node;
  });
};

// Helper to remove a connection
export const removeNodeConnection = (
  nodes: WorkflowNode[],
  sourceNodeId: string,
  targetNodeId: string
) => {
  return nodes.map(node => {
    if (node.nodeId === sourceNodeId) {
      return {
        ...node,
        outputs: (node.outputs || []).filter(conn => conn.targetNodeId !== targetNodeId)
      };
    }
    
    if (node.nodeId === targetNodeId) {
      return {
        ...node,
        inputs: (node.inputs || []).filter(conn => conn.targetNodeId !== sourceNodeId)
      };
    }
    
    return node;
  });
};

// Example of how the data would look in the database:
export const exampleNodeData = {
  nodeId: "manual-trigger-1",
  type: "manual",
  position: { x: 100, y: 200 },
  label: "Manual Trigger",
  outputs: [
    {
      targetNodeId: "http-request-1",
      sourceHandle: "default",
      targetHandle: "default",
      data: {
        label: "on success",
        itemCount: 1
      }
    }
  ]
};
