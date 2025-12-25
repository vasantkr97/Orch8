import React, { useState } from "react";
import { ReactFlow, Controls, Background, MiniMap, BackgroundVariant, ReactFlowProvider } from "@xyflow/react";
import '@xyflow/react/dist/style.css';

import { edgeTypes } from "../components/edges/edgeTypes";

import { useWorkflowState } from "../hooks/workflowHooks/useWorkflowState";
import { useWorkflowLoader } from "../hooks/workflowHooks/useWorkflowLoader";
import { useExecutionProgress } from "../hooks/executionHooks/useExecutionProgress";
import { useWorkflowActions } from "../hooks/workflowHooks/useWorkflowAction";
import { useNodeActions } from "../hooks/useNodeAction";
import WorkflowToolbar from "../components/WorkflowToolbar";
import { nodeTypes } from "../components/nodes/nodeTypes";
import { NodeSelector } from "../components/NodeSelector";
import { ErrorBoundary } from "../components/ErrorBoundary";

export default function WorkflowEditor() {
  const state = useWorkflowState();
  const [showNodeSelector, setShowNodeSelector] = useState(false);

  // Execution progress tracking
  const executionProgress = useExecutionProgress({
    setNodes: state.setNodes,
    setEdges: state.setEdges,
    setIsExecuting: state.setIsExecuting
  });

  React.useEffect(() => {
    const executingNodes = state.nodes.filter((n: any) => n.data?.isExecuting);
    const executedNodes = state.nodes.filter((n: any) => n.data?.isExecuted);
    const errorNodes = state.nodes.filter((n: any) => n.data?.hasError);

    if (executingNodes.length > 0 || executedNodes.length > 0 || errorNodes.length > 0) {
      console.log('🎯 Node states:', {
        executing: executingNodes.map((n: any) => n.data?.label || n.id),
        executed: executedNodes.map((n: any) => n.data?.label || n.id),
        errors: errorNodes.map((n: any) => n.data?.label || n.id)
      });
    }
  }, [state.nodes]);

  const actions = useWorkflowActions({
    workflowId: state.workflowId,
    setWorkflowId: state.setWorkflowId,
    workflowTitle: state.workflowTitle,
    setWorkflowTitle: state.setWorkflowTitle,
    isWorkflowActive: state.isWorkflowActive,
    setIsWorkflowActive: state.setIsWorkflowActive,
    setIsSaving: state.setIsSaving,
    setIsExecuting: state.setIsExecuting,
    nodes: state.nodes,
    edges: state.edges,
    resetWorkflow: state.resetWorkflow,
    setNodes: state.setNodes,
    startExecutionTracking: executionProgress.startTracking
  });

  // Get webhookToken from existing webhook nodes or workflow data
  const webhookNode = state.nodes.find((n: any) => n.type === 'webhook') as any;
  const webhookToken = webhookNode?.data?.webhookToken || null;

  const nodeActions = useNodeActions({
    workflowId: state.workflowId,
    setNodes: state.setNodes,
    setEdges: state.setEdges,
    webhookToken
  });

  useWorkflowLoader({
    setWorkflowId: state.setWorkflowId,
    setWorkflowTitle: state.setWorkflowTitle,
    setIsWorkflowActive: state.setIsWorkflowActive,
    setNodes: state.setNodes,
    setEdges: state.setEdges,
    setIsLoadingWorkflow: state.setIsLoadingWorkflow
  });

  // inline node popovers handle editing; no central overlay state

  const handleAddNodeClick = () => {
    setShowNodeSelector(true);
  };

  if (state.isLoadingWorkflow) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-gray-950">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/50 animate-pulse">
            <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 4h3v7H8V4zm5 0h3v10h-3V4zM8 13h3v7H8v-7z" />
            </svg>
          </div>
          <p className="text-white text-lg font-semibold">Loading workflow...</p>
          <p className="text-gray-400 text-sm mt-2">Please wait</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full flex flex-col bg-gray-950">
      <ReactFlowProvider>
        <WorkflowToolbar
          workflowTitle={state.workflowTitle}
          onWorkflowTitleChange={actions.handleTitleChange}
          onSaveWorkflow={actions.handleSave}
          onNewWorkflow={actions.handleNewWorkflow}
          onExecuteWorkflow={actions.handleExecute}
          isWorkflowActive={state.isWorkflowActive}
          onToggleActive={actions.handleToggleActive}
          isSaving={state.isSaving}
          isExecuting={state.isExecuting}
        />

        <div className="flex-1 relative">
          <button
            onClick={handleAddNodeClick}
            className="absolute top-4 right-4 z-20 w-8 h-8 bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-gray-600 text-gray-400 hover:text-white rounded-lg flex items-center justify-center transition-all"
            title="Add node"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>

          <ErrorBoundary>
            <ReactFlow
              nodes={state.nodes}
              edges={state.edges}
              onNodesChange={state.onNodesChange}
              onEdgesChange={state.onEdgesChange}
              onConnect={nodeActions.onConnect}
              onNodeClick={(_event, node: any) => {
                // Only open config on explicit click, not after a drag
                // Toggle showConfig only for the clicked node
                const setNodesUnsafe = state.setNodes as unknown as (updater: any) => void;
                setNodesUnsafe((nodes: any[]) => nodes.map((n: any) => ({
                  ...n,
                  data: { ...n.data, showConfig: n.id === node.id },
                })));
              }}
              onNodeDragStart={() => {
                // While dragging, do not change showConfig
              }}
              onNodeDragStop={() => {
                // No-op; config opens only on click
              }}
              onPaneClick={() => {
                // Clicking empty canvas closes any open config cards
                const setNodesUnsafe = state.setNodes as unknown as (updater: any) => void;
                setNodesUnsafe((nodes: any[]) => nodes.map((n: any) => ({
                  ...n,
                  data: { ...n.data, showConfig: false },
                })));
              }}
              nodeTypes={nodeTypes as any}
              edgeTypes={edgeTypes as any}
              defaultEdgeOptions={{
                type: 'smooth',
                animated: false,
                style: {
                  strokeWidth: 2.5,
                  strokeOpacity: 0.8,
                },
              }}
              defaultViewport={{ x: 0, y: 0, zoom: 0.6 }}
              minZoom={0.1}
              maxZoom={4}
              deleteKeyCode={['Backspace', 'Delete']}
              panOnDrag={true}
              nodesDraggable={true}
              nodesConnectable={true}
            >
              <Background
                variant={BackgroundVariant.Dots}
                gap={20}
                size={1}
                style={{ backgroundColor: '#0a0e1a' }}
              />
              <Controls
                position="bottom-left"
                style={{
                  display: 'flex',
                  gap: '8px',
                }}
                className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-2"
              />
              <MiniMap
                nodeColor={(node) => {
                  if ((node.data as any)?.hasError) return '#ef4444';
                  if ((node.data as any)?.isSuccess) return '#10b981';
                  if ((node.data as any)?.isExecuting) return '#3b82f6';
                  return '#6b7280';
                }}
                position="bottom-right"
                style={{
                  height: 140,
                  width: 200,
                  backgroundColor: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '12px',
                  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)'
                }}
                className="backdrop-blur-sm"
              />

              {/* Empty State - Start Card */}
              {state.nodes.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                  <div className="text-center">
                    <div className="inline-block bg-gray-900 border border-gray-800 rounded-lg p-6 pointer-events-auto cursor-pointer hover:border-blue-500/50 transition-all" onClick={handleAddNodeClick}>
                      <div className="w-12 h-12 mx-auto mb-3 bg-blue-600/10 rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <h3 className="text-sm font-medium text-white mb-1">Add first node</h3>
                      <p className="text-xs text-gray-500">Click to start</p>
                    </div>
                  </div>
                </div>
              )}
            </ReactFlow>
          </ErrorBoundary>
        </div>

        {/* Side Panel for Node Selection */}
        <NodeSelector
          isVisible={showNodeSelector}
          onNodeSelect={(nodeType) => {
            nodeActions.handleNodeSelect(nodeType);
            // Keep the panel open so user can add more nodes
          }}
          onClose={() => setShowNodeSelector(false)}
          hasTrigger={state.nodes.some((n: any) => n?.data?.isTrigger === true)}
        />
      </ReactFlowProvider>
    </div>
  );
}
