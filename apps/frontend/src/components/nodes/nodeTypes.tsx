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
        icon?: React.ReactNode;
        color?: string;
        isExecuting?: boolean;
        hasError?: boolean;
        isSuccess?: boolean;
        workflowId?: string | null;
        isTrigger?: boolean;
        [key: string]: any;
    }
) => {
    const { icon, ...restData } = data;
    return {
        id,
        type: type,
        position,
        data: {
            ...restData,
            type,
        },
    };
};

import { nodeConfigs, getNodeConfig } from './nodeConfig';

export { nodeConfigs, getNodeConfig };

