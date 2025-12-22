import { memo, useState } from 'react';
import { Handle, Position, type NodeProps, useReactFlow } from '@xyflow/react';

const orch8Node = memo(({ data, selected, id }: NodeProps) => {
    const { deleteElements } = useReactFlow();
    const [copied, setCopied] = useState(false);

    const getStatusIcon = () => {
        return (data as any)?.icon || '⚙️'; 
    };

    const isTrigger = Boolean((data as any)?.isTrigger);
    const isWebhook = (data as any)?.type === 'webhook';
    const workflowId = (data as any)?.workflowId;
    const webhookToken = (data as any)?.webhookToken;

    const webhookUrl = isWebhook && workflowId && webhookToken
        ? `http://localhost:3000/api/executions/webhook/${workflowId}?token=${webhookToken}`
        : null;

    const copyWebhookUrl = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (webhookUrl) {
            navigator.clipboard.writeText(webhookUrl);
            alert('✅ Webhook URL copied to clipboard!\n\n' + webhookUrl + '\n\n🔒 Keep it private! Anyone with this URL can trigger your workflow.\n\n💡 Make sure your workflow is Active (toggle in toolbar).');
        } else if (isWebhook && !workflowId) {
            alert('⚠️ Please save the workflow first to generate a webhook URL.');
        } else if (isWebhook && !webhookToken) {
            alert('⚠️ No webhook token found. Please save the workflow to generate a webhook token.');
        }
    };

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
                        <svg className="w-3.5 h-3.5 text-gray-400 hover:text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" />
                        </svg>
                    )}
                </button>
                {isWebhook && (
                    <button
                        onClick={copyWebhookUrl}
                        className="hover:scale-110 transition-transform"
                        title={webhookUrl ? "Copy webhook URL" : "Save workflow to generate webhook URL"}
                    >
                        <svg className={`w-3.5 h-3.5 ${webhookUrl ? 'text-gray-400 hover:text-purple-500' : 'text-gray-600 hover:text-gray-500'}`} fill="currentColor" viewBox="0 0 24 24">
                            <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/>
                        </svg>
                    </button>
                )}
                <button
                    onClick={handleDelete}
                    className="hover:scale-110 transition-transform"
                    title="Delete node"
                >
                    <svg className="w-3.5 h-3.5 text-gray-400 hover:text-red-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </button>
            </div>

            <div
                className={`relative bg-gray-600 w-28 h-24 border-2 transition-all duration-300 flex items-center justify-center ${isTrigger ? 'rounded-l-full rounded-r-lg' : 'rounded-lg'
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

                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-md">
                    <span className="text-2xl" style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.2))' }}>
                        {getStatusIcon()}
                    </span>
                </div>
            </div>

            <div className="mt-2 flex flex-col items-center text-center max-w-28 mx-auto">
                <div className="text-xs font-medium text-gray-700 leading-tight truncate w-full">
                    {(data as any)?.label}
                </div>
            </div>
        </div>
    );
});

orch8Node.displayName = 'orch8Node';

export default orch8Node;
