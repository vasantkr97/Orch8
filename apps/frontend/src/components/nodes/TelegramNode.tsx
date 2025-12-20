import { memo, useEffect, useState } from 'react';
import { CredentialsSelector } from '../parameters/CredentialsSelector';
import { Handle, Position, type NodeProps, useReactFlow } from '@xyflow/react';

const TelegramNode = memo(({ data, selected, id }: NodeProps) => {
  const isTrigger = Boolean((data as any)?.isTrigger);
  const { deleteElements } = useReactFlow();
  
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
        className={`relative bg-gray-600 w-28 h-24 border-2 transition-all duration-300 flex items-center justify-center ${
          isTrigger ? 'rounded-l-full rounded-r-lg' : 'rounded-lg'
        } ${
          (data as any)?.hasError
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
          <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-cyan-500 rounded-lg flex items-center justify-center shadow-md">
            <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
            </svg>
          </div>
        </div>
      </div>

      {(data as any)?.showConfig && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 w-64 bg-gray-900 border border-gray-800 rounded-lg shadow-xl p-3">
          <div className="text-xs font-semibold text-gray-200 mb-2">Quick Config</div>
          <TelegramQuickConfig id={id} data={data} />
        </div>
      )}

      <div className="mt-2 flex flex-col items-center text-center max-w-28 mx-auto">
        <div className="text-xs font-medium text-gray-700 leading-tight truncate w-full">
          {(data as any)?.label || 'Telegram'}
        </div>
      </div>
    </div>
  );
});

TelegramNode.displayName = 'TelegramNode';
export default TelegramNode;

function TelegramQuickConfig({ id, data }: any) {
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
          credentialType="telegram"
          selectedCredentialId={local.credentialsId}
          onChange={(id: string) => setLocal((l) => ({ ...l, credentialsId: id }))}
          compact
        />
      </div>
      <div>
        <label className="block text-[11px] text-gray-400 mb-1">Chat ID</label>
        <input
          className="w-full border rounded px-2 py-1.5 bg-gray-800 text-white border-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 text-xs"
          value={(local.parameters as any)?.chatId || ''}
          onChange={(e) => setLocal((l) => ({ ...l, parameters: { ...(l.parameters || {}), chatId: e.target.value } }))}
          placeholder="123456"
        />
      </div>
      <div>
        <label className="block text-[11px] text-gray-400 mb-1">Message</label>
        <textarea
          rows={3}
          className="w-full border rounded px-2 py-1.5 bg-gray-800 text-white border-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 text-xs"
          value={(local.parameters as any)?.message || ''}
          onChange={(e) => setLocal((l) => ({ ...l, parameters: { ...(l.parameters || {}), message: e.target.value } }))}
          placeholder="Hello..."
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
