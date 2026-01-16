import { memo, useState } from 'react';
import toast from 'react-hot-toast';
import { Handle, Position, type NodeProps, useReactFlow } from '@xyflow/react';
import { getNodeConfig } from './nodeConfig';

const orch8Node = memo(({ data, selected, id }: NodeProps) => {
    const { deleteElements } = useReactFlow();
    const [copied, setCopied] = useState(false);

    const nodeConfig = getNodeConfig((data as any)?.type);
    const isTrigger = Boolean((data as any)?.isTrigger);
    const isWebhook = (data as any)?.type === 'webhook';
    const workflowId = (data as any)?.workflowId;
    const webhookToken = (data as any)?.webhookToken;

    const webhookUrl = isWebhook && workflowId && webhookToken
        ? `http://localhost:3000/api/executions/webhookExecute/${workflowId}?token=${webhookToken}`
        : null;

    const copyWebhookUrl = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (webhookUrl) {
            navigator.clipboard.writeText(webhookUrl);
            toast.success('Webhook URL copied! Keep it private - anyone with this URL can trigger your workflow.');
        } else if (isWebhook && !workflowId) {
            toast('Save the workflow first to generate a webhook URL.', { icon: '⚠️' });
        } else if (isWebhook && !webhookToken) {
            toast('No webhook token found. Save the workflow to generate one.', { icon: '⚠️' });
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
                {webhookUrl && (
                    <button
                        onClick={copyWebhookUrl}
                        className="hover:scale-110 transition-transform"
                        title="Copy webhook URL"
                    >
                        <svg className="w-5 h-5 text-gray-400 hover:text-purple-400 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z" />
                        </svg>
                    </button>
                )}
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
                    ${nodeConfig.bgColor || 'bg-white'}
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

                {/* Icon Container - No background, just the icon */}
                <div className="mb-3">
                    {(data as any)?.type === 'gemini' ? (
                        <img
                            src={nodeConfig.iconPath}
                            alt={nodeConfig.label}
                            className="w-14 h-14"
                        />
                    ) : (
                        <div
                            className="w-14 h-14"
                            style={{
                                maskImage: `url(${nodeConfig.iconPath})`,
                                WebkitMaskImage: `url(${nodeConfig.iconPath})`,
                                maskSize: 'contain',
                                WebkitMaskSize: 'contain',
                                maskRepeat: 'no-repeat',
                                WebkitMaskRepeat: 'no-repeat',
                                maskPosition: 'center',
                                WebkitMaskPosition: 'center',
                                backgroundColor: nodeConfig.color
                            }}
                        />
                    )}
                </div>

                {/* Label */}
                <div className="text-center px-4">
                    <div className="text-gray-800 font-semibold text-base leading-tight line-clamp-2">
                        {(data as any)?.label}
                    </div>
                </div>
            </div>
        </div>
    );
});

orch8Node.displayName = 'orch8Node';

export default orch8Node;
