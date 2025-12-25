import { Play, Link, MessageCircle, BrainCircuit, Settings } from 'lucide-react';

export const nodeConfigs = {
    manual: {
        icon: <Play className="w-10 h-10 text-white" />,
        color: '#007acc',
        label: 'Manual Trigger',
        description: 'Manually start the workflow',
        isTrigger: true,
    },
    webhook: {
        icon: <Link className="w-10 h-10 text-white" />,
        color: '#28a745',
        label: 'Webhook',
        description: 'Trigger on incoming HTTP requests',
        isTrigger: true,
    },

    // === Actions ===
    resendemail: {
        icon: (
            <svg viewBox="0 0 32 32" className="w-6 h-6">
                <path fill="#4285f4" d="M5.5,5.5h0a3,3,0,0,1,3,3v18a0,0,0,0,1,0,0h-4a2,2,0,0,1-2-2V8.5a3,3,0,0,1,3-3Z" />
                <path fill="#34A853" d="M25.5,5.5h4a0,0,0,0,1,0,0v18a3,3,0,0,1-3,3h0a3,3,0,0,1-3-3V7.5a2,2,0,0,1,2-2Z" />
                <path fill="#EA4335" d="M16.58,19.1068l-12.69-8.0757A3,3,0,0,1,7.1109,5.97l9.31,5.9243L24.78,6.0428A3,3,0,0,1,28.22,10.9579Z" />
                <path fill="#FBBC04" d="M29.4562,8.0656c-.0088-.06-.0081-.1213-.0206-.1812-.0192-.0918-.0549-.1766-.0823-.2652a2.9312,2.9312,0,0,0-.0958-.2993c-.02-.0475-.0508-.0892-.0735-.1354A2.9838,2.9838,0,0,0,28.9686,6.8c-.04-.0581-.09-.1076-.1342-.1626a3.0282,3.0282,0,0,0-.2455-.2849c-.0665-.0647-.1423-.1188-.2146-.1771a3.02,3.02,0,0,0-.24-.1857c-.0793-.0518-.1661-.0917-.25-.1359-.0884-.0461-.175-.0963-.267-.1331-.0889-.0358-.1837-.0586-.2766-.0859s-.1853-.06-.2807-.0777a3.0543,3.0543,0,0,0-.357-.036c-.0759-.0053-.1511-.0186-.2273-.018a2.9778,2.9778,0,0,0-.4219.0425c-.0563.0084-.113.0077-.1689.0193a33.211,33.211,0,0,0-.5645.178c-.0515.022-.0966.0547-.1465.0795A2.901,2.901,0,0,0,23.5,8.5v5.762l4.72-3.3043a2.8878,2.8878,0,0,0,1.2359-2.8923Z" />
            </svg>
        ),
        color: '#EA4335',
        label: 'Gmail',
        description: 'Send email using Gmail',
        isTrigger: false,
    },
    telegram: {
        icon: <MessageCircle className="w-6 h-6 text-white" />,
        color: '#0088cc',
        label: 'Telegram',
        description: 'Send messages via Telegram bot',
        isTrigger: false,
    },
    gemini: {
        icon: <BrainCircuit className="w-6 h-6 text-white" />,
        color: '#0d9488',
        label: 'Gemini AI',
        description: 'AI agent with multiple outputs',
        isTrigger: false,
    },
};

export const getNodeConfig = (type: string) => {
    return nodeConfigs[type as keyof typeof nodeConfigs] || {
        icon: <Settings className="w-6 h-6 text-white" />,
        color: '#6c757d',
        label: type,
        description: `${type} node`,
        isTrigger: false,
    };
};
