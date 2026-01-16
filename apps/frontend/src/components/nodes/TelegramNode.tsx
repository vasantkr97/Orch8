import React, { memo, useEffect, useState } from 'react';
import { CredentialsSelector } from '../parameters/CredentialsSelector';
import { Handle, Position, type NodeProps, useReactFlow } from '@xyflow/react';

const TelegramNode = memo(({ data, selected, id }: NodeProps) => {
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

  // Determine border based on state
  const getStateStyles = () => {
    if ((data as any)?.hasError) {
      return 'border-red-500/80';
    }
    if ((data as any)?.isExecuting) {
      return 'border-blue-400/80 animate-pulse';
    }
    if ((data as any)?.isExecuted) {
      return 'border-emerald-500/80';
    }
    if (selected) {
      return 'border-white/60 scale-[1.02]';
    }
    return 'border-white/20';
  };

  return (
    <div className="relative group">
      {/* Floating action buttons */}
      <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 z-20 flex gap-3 bg-gray-900/90 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10">
        <button
          onClick={handleCopyId}
          className="hover:scale-110 transition-transform"
          title={`Copy ID: ${id}`}
        >
          {copied ? (
            <span className="text-xs text-emerald-400 font-medium">Copied!</span>
          ) : (
            <svg className="w-5 h-5 text-gray-400 hover:text-blue-400 transition-colors" fill="currentColor" viewBox="0 0 24 24">
              <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" />
            </svg>
          )}
        </button>
        <button
          onClick={handleDelete}
          className="hover:scale-110 transition-transform"
          title="Delete node"
        >
          <svg className="w-5 h-5 text-gray-400 hover:text-red-400 transition-colors" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
          </svg>
        </button>
      </div>

      {/* Node card - Pastel Style */}
      <div
        className={`relative w-40 h-40 flex flex-col items-center justify-center rounded-[2rem] transition-all duration-300
          bg-cyan-100
          ${getStateStyles()}
          hover:scale-[1.02] shadow-sm hover:shadow-md
        `}
      >
        {!isTrigger && (
          <Handle
            type="target"
            position={Position.Left}
            className="!bg-gray-400 !border-2 !border-white hover:!border-gray-500 hover:!bg-white transition-all duration-200"
            style={{ width: '10px', height: '10px', left: -5 }}
          />
        )}

        <Handle
          type="source"
          position={Position.Right}
          className="!bg-gray-400 !border-2 !border-white hover:!border-gray-500 hover:!bg-white transition-all duration-200"
          style={{ width: '10px', height: '10px', right: -5 }}
        />

        {/* Icon Container */}
        <div className="mb-3">
          <div
            className="w-14 h-14"
            style={{
              maskImage: `url(/telegram-logo-thin-svgrepo-com.svg)`,
              WebkitMaskImage: `url(/telegram-logo-thin-svgrepo-com.svg)`,
              maskSize: 'contain',
              WebkitMaskSize: 'contain',
              maskRepeat: 'no-repeat',
              WebkitMaskRepeat: 'no-repeat',
              maskPosition: 'center',
              WebkitMaskPosition: 'center',
              backgroundColor: '#0ea5e9'
            }}
          />
        </div>

        {/* Label */}
        <div className="text-center px-4">
          <div className="text-gray-800 font-semibold text-base leading-tight line-clamp-2">
            {(data as any)?.label || 'Telegram'}
          </div>
        </div>
      </div>

      {(data as any)?.showConfig && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[500px] bg-gray-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-6">
          <div className="text-base font-semibold text-gray-200 mb-4">Quick Config</div>
          <TelegramQuickConfig id={id} data={data} />
        </div>
      )}
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
  const cancelledRef = React.useRef(false);

  useEffect(() => {
    setLocal({
      credentialsId: data?.credentialsId || '',
      parameters: { ...(data?.parameters || {}) },
    });
    cancelledRef.current = false;
  }, [id]);

  const prevShowConfig = React.useRef(data?.showConfig);
  useEffect(() => {
    if (prevShowConfig.current === true && data?.showConfig === false && !cancelledRef.current) {
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
    <div className="space-y-5">
      <div>
        <label className="block text-sm text-gray-400 mb-2">Credentials</label>
        <CredentialsSelector
          credentialType="telegram"
          selectedCredentialId={local.credentialsId}
          onChange={(id: string) => setLocal((l) => ({ ...l, credentialsId: id }))}
          compact
        />
      </div>
      <div>
        <label className="block text-sm text-gray-400 mb-2">Chat ID</label>
        <input
          className="w-full border rounded-xl px-4 py-2.5 bg-gray-800/80 text-white border-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50"
          value={(local.parameters as any)?.chatId || ''}
          onChange={(e) => setLocal((l) => ({ ...l, parameters: { ...(l.parameters || {}), chatId: e.target.value } }))}
          placeholder="123456"
        />
      </div>
      <div>
        <label className="block text-sm text-gray-400 mb-2">Message</label>
        <textarea
          rows={3}
          className="w-full border rounded-xl px-4 py-2.5 bg-gray-800/80 text-white border-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 resize-none"
          value={(local.parameters as any)?.message || ''}
          onChange={(e) => setLocal((l) => ({ ...l, parameters: { ...(l.parameters || {}), message: e.target.value } }))}
          placeholder="Hello..."
        />
      </div>
      <label className="inline-flex items-center gap-3 text-sm text-gray-300">
        <input
          type="checkbox"
          className="accent-cyan-500 w-4 h-4"
          checked={Boolean((local.parameters as any)?.usePreviousResult)}
          onChange={(e) => setLocal((l) => ({ ...l, parameters: { ...(l.parameters || {}), usePreviousResult: e.target.checked } }))}
        />
        Use previous node result
      </label>

      {Boolean((local.parameters as any)?.usePreviousResult) && (
        <div>
          <label className="block text-sm text-gray-400 mb-2">Source Node ID *</label>
          <input
            className="w-full border rounded-xl px-4 py-2.5 bg-gray-800/80 text-white border-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 font-mono"
            value={(local.parameters as any)?.sourceNodeId || ''}
            onChange={(e) => setLocal((l) => ({
              ...l,
              parameters: { ...(l.parameters || {}), sourceNodeId: e.target.value }
            }))}
            placeholder="Paste node ID here"
          />
          <p className="text-xs text-gray-500 mt-2">
            Copy the ID from the source node
          </p>
        </div>
      )}

      <div className="flex justify-end gap-3 pt-2">
        <button
          onClick={() => {
            cancelledRef.current = true;
            setLocal({
              credentialsId: data?.credentialsId || '',
              parameters: { ...(data?.parameters || {}) },
            });
            rf.setNodes((nodes: any[]) => nodes.map((n: any) => (n.id === id ? { ...n, data: { ...n.data, showConfig: false } } : n)));
          }}
          className="px-5 py-2 text-sm rounded-xl border border-white/10 bg-gray-800/80 text-white hover:bg-gray-700/80 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={() => {
            rf.setNodes((nodes: any[]) => nodes.map((n: any) => {
              if (n.id !== id) return n;
              return {
                ...n,
                data: {
                  ...n.data,
                  credentialsId: local.credentialsId || undefined,
                  parameters: { ...(n.data?.parameters || {}), ...(local.parameters || {}) },
                  showConfig: false,
                }
              };
            }));
          }}
          className="px-5 py-2 text-sm rounded-xl bg-gradient-to-r from-cyan-500 to-sky-500 text-white hover:from-cyan-600 hover:to-sky-600 transition-all"
        >
          Save Config
        </button>
      </div>
    </div>
  );
}
