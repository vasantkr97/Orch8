import type { ExecutionContext } from "../types/executionTypes";


export default function replaceVariable(text: string, context: ExecutionContext) {

    if (!text || typeof text !== "string") return text;

    return text.replace(/\{\{([^}]+)\}\}/g, (match, variable) => {
        try {
            const parts = variable.trim().split('.');
            
            if (parts[0] === '$json') {
                let value = context.data

                for (let i = 1; i< parts.length; i++) {
                    if (value && typeof value === "object" ) {
                        value = value[parts[i]];
                    } else {
                        return match
                    }
                };

                return value !== undefined ? String(value) : match

            } else if (context.nodeResults[parts[0]]) {
                let value = context.nodeResults[parts[0]];
                for (let i = 1; i < parts.length; i++) {
                    if (value && typeof value === "object") {
                        value = value[parts[i]]
                    } else {
                        return match;
                    }
                }
                return value !== undefined ? String(value) : match;
            } else {
                if (parts.length === 1 && context.data && context.data[parts[0]]) {
                    return String(context.data[parts[0]]);
                }
            }
            
            return match;
        } catch (error: any) {
            console.warn(`Error replacing variable ${variable}:`, error);
            return match
        }
    })
}