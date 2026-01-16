// Node configuration with SVG icon paths from public folder
export const nodeConfigs = {
    manual: {
        iconPath: '/go-next-svgrepo-com.svg',
        color: '#3b82f6',
        bgColor: 'bg-blue-100', // Brighter Blue
        gradient: 'from-blue-500 to-indigo-600',
        label: 'Manual Trigger',
        description: 'Manually start the workflow',
        isTrigger: true,
    },
    webhook: {
        iconPath: '/webhook-svgrepo-com.svg',
        color: '#ec4899', // Pink to match reference
        bgColor: 'bg-pink-100', // Brighter Pink
        gradient: 'from-pink-500 to-rose-600',
        label: 'Webhook',
        description: 'Trigger on incoming HTTP requests',
        isTrigger: true,
    },

    // === Actions ===
    resendemail: {
        iconPath: '/email-9-svgrepo-com.svg',
        color: '#ef4444',
        bgColor: 'bg-orange-300', // Brighter Orange/Red
        gradient: 'from-red-500 to-orange-500',
        label: 'Gmail',
        description: 'Send email using Gmail',
        isTrigger: false,
    },
    telegram: {
        iconPath: '/telegram-logo-thin-svgrepo-com.svg',
        color: '#0ea5e9',
        bgColor: 'bg-cyan-300', // Brighter Cyan
        gradient: 'from-cyan-400 to-sky-500',
        label: 'Telegram',
        description: 'Send messages via Telegram bot',
        isTrigger: false,
    },
    gemini: {
        iconPath: '/gemini-color.svg',
        color: '#8b5cf6',
        bgColor: 'bg-violet-300', // Brighter Violet
        gradient: 'from-violet-500 to-purple-600',
        label: 'Gemini AI',
        description: 'AI agent with multiple outputs',
        isTrigger: false,
    },
};

export type NodeConfigKey = keyof typeof nodeConfigs;

export const getNodeConfig = (type: string) => {
    return nodeConfigs[type as NodeConfigKey] || {
        iconPath: '/webhook-svgrepo-com.svg',
        color: '#6b7280',
        gradient: 'from-gray-500 to-gray-600',
        label: type,
        description: `${type} node`,
        isTrigger: false,
    };
};
