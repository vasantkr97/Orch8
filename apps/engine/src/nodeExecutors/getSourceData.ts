import type { ExecutionContext, WorkflowNode } from "../../types/executionTypes";

export function getSourceData(
    node: WorkflowNode,
    context: ExecutionContext
): any | undefined {
    const params = node.parameters as any;

    if (!params?.usePreviousResult) {
        return undefined;
    }

    const sourceNodeId = params?.sourceNodeId;

    if (!sourceNodeId) {
        throw new Error(
            `Node "${node.name}" has usePreviousResult enabled but no sourceNodeId specified.`);
    }

    const sourceData = context.data?.[sourceNodeId];

    if (sourceData === undefined) {
        throw new Error(
            `Node "${node.name}" references sourceNodeId "${sourceNodeId}" but no data exists.`);
    }

    return sourceData;
}
