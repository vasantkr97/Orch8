import {
  type EdgeProps,
  getBezierPath,
  EdgeLabelRenderer,
  BaseEdge,
} from '@xyflow/react';

const orch8Edge = ({
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  data = {},
  markerEnd,
  selected,
}: EdgeProps) => {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const getEdgeColor = () => {
    if ((data as any)?.hasError) return '#ef4444';
    if ((data as any)?.hasExecuted) return '#10b981';
    if ((data as any)?.isExecuting) return '#3b82f6';
    return selected ? '#6366f1' : '#64748b';
  };

  const getEdgeWidth = () => {
    if ((data as any)?.isExecuting) return 3.5;
    if (selected) return 3;
    return 2.5;
  };

  const getEdgeOpacity = () => {
    if ((data as any)?.isExecuting) return 1;
    if (selected) return 0.9;
    return 0.7;
  };

  const edgeStyle = {
    ...style,
    stroke: getEdgeColor(),
    strokeWidth: getEdgeWidth(),
    strokeOpacity: getEdgeOpacity(),
    strokeDasharray: (data as any)?.isExecuting ? '8,4' : 'none',
    filter: selected ? 'drop-shadow(0 0 8px rgba(99, 102, 241, 0.4))' : 
            (data as any)?.isExecuting ? 'drop-shadow(0 0 6px rgba(59, 130, 246, 0.3))' : 'none',
    animation: (data as any)?.isExecuting ? 'orch8-edge-flow 1.5s ease-in-out infinite' : 'none',
  };

  return (
    <>
      {/* Main Edge Path */}
      <BaseEdge
        path={edgePath}
        markerEnd={markerEnd}
        style={edgeStyle}
        interactionWidth={20}
      />
      
      {/* Edge Label */}
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            fontSize: '11px',
            pointerEvents: 'all',
          }}
          className="nodrag nopan"
        >
          
          {/* Edge Label */}
          {(data as any)?.label && (
            <div
              style={{
                background: 'rgba(15, 23, 42, 0.95)',
                backdropFilter: 'blur(12px)',
                padding: '6px 12px',
                borderRadius: '8px',
                border: `1px solid ${getEdgeColor()}40`,
                fontSize: '11px',
                color: '#f1f5f9',
                fontWeight: '500',
                boxShadow: `0 8px 32px rgba(0, 0, 0, 0.3), 0 0 0 1px ${getEdgeColor()}20`,
                maxWidth: '140px',
                textAlign: 'center',
                wordBreak: 'break-word',
                letterSpacing: '0.025em'
              }}
            >
              {(data as any).label}
            </div>
          )}
          
          {/* Execution Status */}
          {(data as any)?.isExecuting && (
            <div
              style={{
                background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                color: '#fff',
                padding: '4px 10px',
                borderRadius: '8px',
                fontSize: '10px',
                fontWeight: '600',
                marginTop: '6px',
                animation: 'orch8-status-pulse 2s ease-in-out infinite',
                boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4), 0 2px 4px rgba(0, 0, 0, 0.1)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                backdropFilter: 'blur(8px)'
              }}
            >
              Executing...
            </div>
          )}
        </div>
      </EdgeLabelRenderer>

      {/* CSS for animations */}
      <style>{`
        @keyframes orch8-edge-flow {
          0% {
            stroke-dashoffset: 0;
          }
          100% {
            stroke-dashoffset: -12;
          }
        }
        
        @keyframes orch8-status-pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.02);
          }
        }
        
        @keyframes orch8-edge-glow {
          0%, 100% {
            filter: drop-shadow(0 0 4px rgba(99, 102, 241, 0.3));
          }
          50% {
            filter: drop-shadow(0 0 8px rgba(99, 102, 241, 0.6));
          }
        }
      `}</style>
    </>
  );
};

export default orch8Edge;
