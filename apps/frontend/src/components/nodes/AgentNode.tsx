import { memo, useEffect, useState } from 'react';
import { CredentialsSelector } from '../parameters/CredentialsSelector';
import { Handle, Position, type NodeProps, useReactFlow } from '@xyflow/react';

const AgentNode = memo(({ data, selected, id }: NodeProps) => {
  const { deleteElements } = useReactFlow();

  const isTrigger = Boolean((data as any)?.isTrigger);
  const nodeType = (data as any)?.type || 'unknown';

  console.log('AgentNode rendered for:', nodeType, data);

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteElements({ nodes: [{ id }] });
  };

  return (
    <div className="relative group">
      <button
        onClick={handleDelete}
        className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20"
        title="Delete node"
      >
        <svg className="w-3.5 h-3.5 text-gray-400 hover:text-red-500" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>

      <div
        className={`relative bg-gray-600 rounded-lg border-2 transition-all duration-300 flex items-center justify-center ${(data as any)?.isExecuting || (data as any)?.isExecuted
            ? 'border-green-500'
            : (selected ? 'border-gray-500 shadow-lg scale-105' : 'border-white shadow-md')
          } ${(data as any)?.isExecuting || (data as any)?.isExecuted ? '' : 'hover:border-orange-500'} hover:shadow-lg hover:scale-102`}
        style={{
          width: '144px',
          height: '160px'
        }}
      >

        {!isTrigger && (
          <Handle
            type="target"
            position={Position.Left}
            id="input"
            className="absolute top-1/2 -translate-y-1/2 -left-3 w-4 h-4 bg-gray-400 border-2 border-gray-300 rounded-full
                       hover:scale-125 hover:border-orange-500 transition-all duration-200
                       shadow-lg"
          />
        )}


        <Handle
          type="source"
          position={Position.Right}
          id="output"
          className="absolute top-1/2 -translate-y-1/2 -right-3 w-4 h-4 bg-gray-400 border-2 border-gray-300 rounded-full
                     hover:scale-125 hover:border-orange-500 transition-all duration-200
                     shadow-lg"
        />

        <Handle
          type="source"
          position={Position.Bottom}
          id="output-1"
          className="absolute bottom-0 -translate-x-1/2 -translate-y-1/2 left-1/4 w-4 h-4 bg-gray-400 border-2 border-gray-300 rounded-full
                     hover:scale-125 hover:border-orange-500 transition-all duration-200
                     shadow-lg"
          style={{ left: '25%', bottom: '-12px' }}
        />
        <Handle
          type="source"
          position={Position.Bottom}
          id="output-2"
          className="absolute bottom-0 -translate-x-1/2 -translate-y-1/2 left-1/2 w-4 h-4 bg-gray-400 border-2 border-gray-300 rounded-full
                     hover:scale-125 hover:border-orange-500 transition-all duration-200
                     shadow-lg"
          style={{ left: '50%', bottom: '-12px' }}
        />
        <Handle
          type="source"
          position={Position.Bottom}
          id="output-3"
          className="absolute bottom-0 -translate-x-1/2 -translate-y-1/2 left-3/4 w-4 h-4 bg-gray-400 border-2 border-gray-300 rounded-full
                     hover:scale-125 hover:border-orange-500 transition-all duration-200
                     shadow-lg"
          style={{ left: '75%', bottom: '-12px' }}
        />

        <div className="flex items-center justify-center">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
            <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C10.89 2 10 2.89 10 4V5.38C8.16 6.05 6.79 7.77 6.79 9.83C6.79 11.38 7.5 12.78 8.67 13.65V17C8.67 17.55 9.12 18 9.67 18H14.33C14.88 18 15.33 17.55 15.33 17V13.65C16.5 12.78 17.21 11.38 17.21 9.83C17.21 7.77 15.84 6.05 14 5.38V4C14 2.89 13.11 2 12 2M9 11C9 10.45 9.45 10 10 10C10.55 10 11 10.45 11 11C11 11.55 10.55 12 10 12C9.45 12 9 11.55 9 11M13 11C13 10.45 13.45 10 14 10C14.55 10 15 10.45 15 11C15 11.55 14.55 12 14 12C13.45 12 13 11.55 13 11M10 19H14V20H10V19M8 20V21H7V20H8M16 20H17V21H16V20Z" />
            </svg>
          </div>
        </div>

        {(data as any)?.isExecuting && (
          <div className="absolute inset-0 bg-blue-500 bg-opacity-20 rounded-lg flex items-center justify-center">
            <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        {(data as any)?.hasError && (
          <div className="absolute inset-0 bg-red-500 bg-opacity-20 rounded-lg flex items-center justify-center">
            <span className="text-red-300 text-lg"></span>
          </div>
        )}
      </div>

      {(data as any)?.showConfig && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 w-64 bg-gray-900 border border-gray-800 rounded-lg shadow-xl p-3">
          <div className="text-xs font-semibold text-gray-200 mb-2">Quick Config</div>
          <AgentQuickConfig id={id} data={data} />
        </div>
      )}

      <div className="mt-2 flex flex-col items-center text-center max-w-24 mx-auto">
        <div className="text-xs font-medium text-gray-700 leading-tight truncate">
          {(data as any)?.label}
        </div>
        <div
          className="text-[9px] text-gray-500 cursor-pointer hover:text-orange-400 truncate w-full transition-colors"
          title="Click to copy Node ID"
          onClick={(e) => {
            e.stopPropagation();
            navigator.clipboard.writeText(id);
          }}
        >
          ID: {id.slice(0, 8)}...
        </div>

        {(data as any)?.isExecuting && (
          <div className="text-[9px] text-blue-400 mt-0.5 font-medium animate-pulse">
            Executing...
          </div>
        )}
      </div>
    </div>
  );
});

AgentNode.displayName = 'AgentNode';

export default AgentNode;
function AgentQuickConfig({ id, data }: any) {
  const rf = useReactFlow();
  const [local, setLocal] = useState({
    credentialsId: data?.credentialsId || '',
    parameters: { ...(data?.parameters || {}) },
  });

  useEffect(() => {
    setLocal({
      credentialsId: data?.credentialsId || '',
      parameters: { ...(data?.parameters || {}) },
    });
  }, [id]);

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-[11px] text-gray-400 mb-1">Credentials</label>
        <CredentialsSelector
          credentialType="gemini"
          selectedCredentialId={local.credentialsId}
          onChange={(id: string) => setLocal((l) => ({ ...l, credentialsId: id }))}
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
          placeholder="Enter API key"
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
            setLocal({
              credentialsId: data?.credentialsId || '',
              parameters: { ...(data?.parameters || {}) },
            });
          }}
          className="px-3 py-1.5 text-xs rounded-lg border border-gray-700 bg-gray-800 text-white hover:bg-gray-700"
        >
          Cancel
        </button>
        <button
          onClick={() => {
            if ((data as any)?.onQuickUpdate) {
              (data as any).onQuickUpdate({ credentialsId: local.credentialsId, parameters: local.parameters });
            } else {
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
            rf.setNodes((nodes: any[]) => nodes.map((n: any) => (n.id === id ? { ...n, data: { ...n.data, showConfig: false } } : n)));
          }}
          className="px-3 py-1.5 text-xs rounded-lg bg-orange-600 text-white hover:bg-orange-700"
        >
          Save Config
        </button>
      </div>
    </div>
  );
}
