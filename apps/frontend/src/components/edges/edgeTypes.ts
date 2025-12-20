import orch8Edge from './orch8Edges';

// Define all custom edge types for orch-style workflow
export const edgeTypes = {
  'orch8-edge': orch8Edge,
  'default': orch8Edge,
  'smoothstep': orch8Edge,
  'straight': orch8Edge,
  'smooth': orch8Edge,
  'step': orch8Edge,  
};

// Helper function to create orch-style edge data
export const createOrch8Edge = (
  id: string,
  source: string,
  target: string,
  data?: {
    label?: string;
    isExecuting?: boolean;
    hasExecuted?: boolean;
    hasError?: boolean;
    itemCount?: number;
  }
) => ({
  id,
  source,
  target,
  type: 'orch8-edge',
  animated: data?.isExecuting || false,
  data: data || {},
  style: {
    strokeWidth: 2.5,
    strokeOpacity: 0.8,
  },
  markerEnd: {
    type: 'arrowclosed' as const,
    width: 16,
    height: 16,
    color: data?.hasError ? '#ef4444' : 
          data?.hasExecuted ? '#10b981' : 
          data?.isExecuting ? '#3b82f6' : '#64748b',
  },
});
