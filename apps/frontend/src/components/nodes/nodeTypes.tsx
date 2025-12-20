import orch8Node from './orch8Node';
import EmailNode from './EmailNode';
import GeminiAgentNode from './GeminiAgentNode';
import TelegramNode from './TelegramNode';

export const nodeTypes = {
    'orch8-node': orch8Node,
    manual: orch8Node,
    webhook: orch8Node,
    resendemail: EmailNode,
    telegram: TelegramNode,
    gemini: GeminiAgentNode,
};

export const createOrch8Node = (
    id: string,
    type: string,
    position: { x: number; y: number },
    data: {
        label: string;
        description?: string;
        icon?: string;
        color?: string;
        isExecuting?: boolean;
        hasError?: boolean;
        isSuccess?: boolean;
        workflowId?: string | null;
        isTrigger?: boolean;
    }
) => ({
    id,
    type: type,
    position,
    data: {
        ...data,
        type,
    },
});

export const nodeConfigs = {
    manual: {
        icon: '▶️',
        color: '#007acc',
        label: 'Manual Trigger',
        description: 'Manually start the workflow',
        isTrigger: true,
    },
    webhook: {
        icon: '🔗',
        color: '#28a745',
        label: 'Webhook',
        description: 'Trigger on incoming HTTP requests',
        isTrigger: true,
    },

    // === Actions ===
    resendemail: {
        icon: '📧',
        color: '#dc3545',
        label: 'Email',
        description: 'Send email messages',
        isTrigger: false,
    },
    telegram: {
        icon: '💬',
        color: '#0088cc',
        label: 'Telegram',
        description: 'Send messages via Telegram bot',
        isTrigger: false,
    },
    gemini: {
        icon: '🤖',
        color: '#8b5cf6',
        label: 'Gemini AI',
        description: 'AI agent with multiple outputs',
        isTrigger: false,
    },
};

export const getNodeConfig = (type: string) => {
    return nodeConfigs[type as keyof typeof nodeConfigs] || {
        icon: '⚙️',
        color: '#6c757d',
        label: type,
        description: `${type} node`,
        isTrigger: false,
    };
};
