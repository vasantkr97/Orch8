import React, { memo, useEffect, useState } from 'react';
import { BrainCircuit } from 'lucide-react';
import { CredentialsSelector } from '../parameters/CredentialsSelector';
import { Handle, Position, type NodeProps, useReactFlow } from '@xyflow/react';

const GeminiAgentNode = memo(({ data, selected, id }: NodeProps) => {
  const isTrigger = Boolean((data as any)?.isTrigger);
  const { deleteElements } = useReactFlow();
  const [copied, setCopied] = useState(false);

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteElements({ nodes: [{ id }] });
  };

  const handleCopyId = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(id);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="relative group">
      <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20 flex gap-2">
        <button
          onClick={handleCopyId}
          className="hover:scale-110 transition-transform"
          title={`Copy ID: ${id}`}
        >
          {copied ? (
            <span className="text-[10px] text-green-500 font-medium">Copied!</span>
          ) : (
            <svg className="w-4.5 h-4.5 text-gray-400 hover:text-blue-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" />
            </svg>
          )}
        </button>
        <button
          onClick={handleDelete}
          className="hover:scale-110 transition-transform"
          title="Delete node"
        >
          <svg className="w-4.5 h-4.5 text-gray-400 hover:text-red-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

      <div
        className={`relative bg-gray-900 w-60 h-28 border-2 transition-all duration-300 flex items-center justify-center rounded-xl ${(data as any)?.hasError
            ? 'border-red-500 shadow-red-500/50'
            : (data as any)?.isExecuting
              ? 'border-blue-500 shadow-blue-500/50 animate-pulse'
              : (data as any)?.isExecuted
                ? 'border-green-500 shadow-green-500/50'
                : (selected ? 'border-gray-500 shadow-lg scale-105' : 'border-white shadow-md')
          } ${(data as any)?.isExecuted || (data as any)?.hasError || (data as any)?.isExecuting ? '' : 'hover:border-orange-500'} hover:shadow-lg hover:scale-102`}
      >
        {!isTrigger && (
          <Handle
            type="target"
            position={Position.Left}
            className="absolute top-1/2 -translate-y-1/2 -left-2
                       bg-gray-400 border-2 border-gray-300 w-3 h-3 rounded-full
                       hover:scale-125 hover:border-orange-500 transition-all duration-200"
          />
        )}

        <Handle
          type="source"
          position={Position.Right}
          className="absolute top-1/2 -translate-y-1/2 -right-2
                     bg-gray-400 border-2 border-gray-300 w-3 h-3 rounded-full
                     hover:scale-125 hover:border-orange-500 transition-all duration-200"
        />

        <div className="flex items-center justify-center">
          <div className="w-24 h-16 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-md">
            <BrainCircuit className="w-12 h-12 text-white" />
          </div>
        </div>
      </div>

      {(data as any)?.showConfig && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 w-64 bg-gray-900 border border-gray-800 rounded-lg shadow-xl p-3">
          <div className="text-xs font-semibold text-gray-200 mb-2">Quick Config</div>
          <GeminiQuickConfig id={id} data={data} />
        </div>
      )}

      <div className="mt-2 flex flex-col items-center text-center max-w-36 mx-auto">
        <div className="text-base font-medium text-gray-300 leading-tight truncate w-full">
          {(data as any)?.label || 'Gemini'}
        </div>
      </div>
    </div>
  );
});

GeminiAgentNode.displayName = 'GeminiAgentNode';
export default GeminiAgentNode;

function GeminiQuickConfig({ id, data }: any) {
  const rf = useReactFlow();
  const [local, setLocal] = useState({
    credentialsId: data?.credentialsId || '',
    parameters: { ...(data?.parameters || {}) },
  });
  const cancelledRef = React.useRef(false);

  useEffect(() => {
    setLocal({
      credentialsId: data?.credentialsId || '',
      parameters: { ...(data?.parameters || {}) },
    });
    cancelledRef.current = false;
  }, [id]);

  // Auto-save when config panel closes (showConfig becomes false)
  const prevShowConfig = React.useRef(data?.showConfig);
  useEffect(() => {
    // If showConfig just changed from true to false, save the local state (unless cancelled)
    if (prevShowConfig.current === true && data?.showConfig === false && !cancelledRef.current) {
      // Always save directly via rf.setNodes for consistency
      rf.setNodes((nodes: any[]) => nodes.map((n: any) => {
        if (n.id !== id) return n;
        return {
          ...n,
          data: {
            ...n.data,
            credentialsId: local.credentialsId || undefined,
            parameters: { ...(n.data?.parameters || {}), ...(local.parameters || {}) },
          }
        };
      }));
    }
    cancelledRef.current = false;
    prevShowConfig.current = data?.showConfig;
  }, [data?.showConfig, local, id, rf]);

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-[11px] text-gray-400 mb-1">Credentials</label>
        <CredentialsSelector
          credentialType="gemini"
          selectedCredentialId={local.credentialsId}
          onChange={(cid: string) => setLocal((l) => ({ ...l, credentialsId: cid }))}
          compact
        />
      </div>
      <div>
        <label className="block text-[11px] text-gray-400 mb-1">API Key</label>
        <input
          type="password"
          className="w-full border rounded px-2 py-1.5 bg-gray-800 text-white border-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 text-xs"
          value={(local.parameters as any)?.apiKey || ''}
          onChange={(e) => setLocal((l) => ({ ...l, parameters: { ...(l.parameters || {}), apiKey: e.target.value } }))}
          placeholder="AIza..."
        />
      </div>
      <div>
        <label className="block text-[11px] text-gray-400 mb-1">Prompt</label>
        <textarea
          rows={3}
          className="w-full border rounded px-2 py-1.5 bg-gray-800 text-white border-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 text-xs"
          value={(local.parameters as any)?.prompt || ''}
          onChange={(e) => setLocal((l) => ({ ...l, parameters: { ...(l.parameters || {}), prompt: e.target.value } }))}
          placeholder="Enter your prompt..."
        />
      </div>
      <label className="inline-flex items-center gap-2 text-[11px] text-gray-300">
        <input
          type="checkbox"
          className="accent-orange-500"
          checked={Boolean((local.parameters as any)?.usePreviousResult)}
          onChange={(e) => setLocal((l) => ({ ...l, parameters: { ...(l.parameters || {}), usePreviousResult: e.target.checked } }))}
        />
        Use previous node result
      </label>

      {Boolean((local.parameters as any)?.usePreviousResult) && (
        <div>
          <label className="block text-[11px] text-gray-400 mb-1">Source Node ID *</label>
          <input
            className="w-full border rounded px-2 py-1.5 bg-gray-800 text-white border-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 text-xs font-mono"
            value={(local.parameters as any)?.sourceNodeId || ''}
            onChange={(e) => setLocal((l) => ({
              ...l,
              parameters: { ...(l.parameters || {}), sourceNodeId: e.target.value }
            }))}
            placeholder="Paste node ID here"
          />
          <p className="text-[10px] text-gray-500 mt-1">
            Copy the ID from the source node
          </p>
        </div>
      )}

      <div className="flex justify-end gap-2 pt-1">
        <button
          onClick={() => {
            cancelledRef.current = true;
            setLocal({
              credentialsId: data?.credentialsId || '',
              parameters: { ...(data?.parameters || {}) },
            });
            rf.setNodes((nodes: any[]) => nodes.map((n: any) => (n.id === id ? { ...n, data: { ...n.data, showConfig: false } } : n)));
          }}
          className="px-3 py-1.5 text-xs rounded-lg border border-gray-700 bg-gray-800 text-white hover:bg-gray-700"
        >
          Cancel
        </button>
        <button
          onClick={() => {
            // Combine save and close into a single setNodes call to avoid race condition
            rf.setNodes((nodes: any[]) => nodes.map((n: any) => {
              if (n.id !== id) return n;
              return {
                ...n,
                data: {
                  ...n.data,
                  credentialsId: local.credentialsId || undefined,
                  parameters: { ...(n.data?.parameters || {}), ...(local.parameters || {}) },
                  showConfig: false, // Close config after saving
                }
              };
            }));
          }}
          className="px-3 py-1.5 text-xs rounded-lg bg-orange-600 text-white hover:bg-orange-700"
        >
          Save Config
        </button>
      </div>
    </div>
  );
}
