import React, { memo, useEffect, useState } from 'react';
import { CredentialsSelector } from '../parameters/CredentialsSelector';
import { Handle, Position, type NodeProps, useReactFlow } from '@xyflow/react';

const EmailNode = memo(({ data, selected, id }: NodeProps) => {
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
        className={`relative bg-gray-900 w-48 h-24 border-2 transition-all duration-300 flex items-center justify-center ${isTrigger ? 'rounded-l-full rounded-r-lg' : 'rounded-lg'
          } ${(data as any)?.hasError
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
          <div className="w-20 h-16 bg-gradient-to-br from-red-500 to-orange-600 rounded-lg flex items-center justify-center shadow-md">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
              <svg viewBox="0 0 32 32" className="w-8 h-8">
                <path fill="#4285f4" d="M5.5,5.5h0a3,3,0,0,1,3,3v18a0,0,0,0,1,0,0h-4a2,2,0,0,1-2-2V8.5a3,3,0,0,1,3-3Z" />
                <path fill="#34A853" d="M25.5,5.5h4a0,0,0,0,1,0,0v18a3,3,0,0,1-3,3h0a3,3,0,0,1-3-3V7.5a2,2,0,0,1,2-2Z" />
                <path fill="#EA4335" d="M16.58,19.1068l-12.69-8.0757A3,3,0,0,1,7.1109,5.97l9.31,5.9243L24.78,6.0428A3,3,0,0,1,28.22,10.9579Z" />
                <path fill="#FBBC04" d="M29.4562,8.0656c-.0088-.06-.0081-.1213-.0206-.1812-.0192-.0918-.0549-.1766-.0823-.2652a2.9312,2.9312,0,0,0-.0958-.2993c-.02-.0475-.0508-.0892-.0735-.1354A2.9838,2.9838,0,0,0,28.9686,6.8c-.04-.0581-.09-.1076-.1342-.1626a3.0282,3.0282,0,0,0-.2455-.2849c-.0665-.0647-.1423-.1188-.2146-.1771a3.02,3.02,0,0,0-.24-.1857c-.0793-.0518-.1661-.0917-.25-.1359-.0884-.0461-.175-.0963-.267-.1331-.0889-.0358-.1837-.0586-.2766-.0859s-.1853-.06-.2807-.0777a3.0543,3.0543,0,0,0-.357-.036c-.0759-.0053-.1511-.0186-.2273-.018a2.9778,2.9778,0,0,0-.4219.0425c-.0563.0084-.113.0077-.1689.0193a33.211,33.211,0,0,0-.5645.178c-.0515.022-.0966.0547-.1465.0795A2.901,2.901,0,0,0,23.5,8.5v5.762l4.72-3.3043a2.8878,2.8878,0,0,0,1.2359-2.8923Z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {(data as any)?.showConfig && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 w-64 bg-gray-900 border border-gray-800 rounded-lg shadow-xl p-3">
          <div className="text-xs font-semibold text-gray-200 mb-2">Quick Config</div>
          <EmailQuickConfig id={id} data={data} />
        </div>
      )}

      <div className="mt-2 flex flex-col items-center text-center max-w-36 mx-auto">
        <div className="text-base font-medium text-gray-300 leading-tight truncate w-full">
          {(data as any)?.label || 'Email'}
        </div>
      </div>
    </div>
  );
});

EmailNode.displayName = 'EmailNode';
export default EmailNode;

function EmailQuickConfig({ id, data }: any) {
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
          credentialType="resendemail"
          selectedCredentialId={local.credentialsId}
          onChange={(id: string) => setLocal((l) => ({ ...l, credentialsId: id }))}
          compact
        />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-[11px] text-gray-400 mb-1">From</label>
          <input
            className="w-full border rounded px-2 py-1.5 bg-gray-800 text-white border-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 text-xs"
            value={(local.parameters as any)?.from || ''}
            onChange={(e) => setLocal((l) => ({ ...l, parameters: { ...(l.parameters || {}), from: e.target.value } }))}
            placeholder="from@example.com"
          />
        </div>
        <div>
          <label className="block text-[11px] text-gray-400 mb-1">To</label>
          <input
            className="w-full border rounded px-2 py-1.5 bg-gray-800 text-white border-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 text-xs"
            value={(local.parameters as any)?.to || ''}
            onChange={(e) => setLocal((l) => ({ ...l, parameters: { ...(l.parameters || {}), to: e.target.value } }))}
            placeholder="to@example.com"
          />
        </div>
      </div>
      <div>
        <label className="block text-[11px] text-gray-400 mb-1">Subject</label>
        <input
          className="w-full border rounded px-2 py-1.5 bg-gray-800 text-white border-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 text-xs"
          value={(local.parameters as any)?.subject || ''}
          onChange={(e) => setLocal((l) => ({ ...l, parameters: { ...(l.parameters || {}), subject: e.target.value } }))}
          placeholder="Subject"
        />
      </div>
      <div>
        <label className="block text-[11px] text-gray-400 mb-1">Text</label>
        <textarea
          rows={3}
          className="w-full border rounded px-2 py-1.5 bg-gray-800 text-white border-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 text-xs"
          value={(local.parameters as any)?.text || ''}
          onChange={(e) => setLocal((l) => ({ ...l, parameters: { ...(l.parameters || {}), text: e.target.value } }))}
          placeholder="Email content..."
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
