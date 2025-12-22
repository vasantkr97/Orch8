import { prisma } from "@orch8/db";
import type { ExecutionContext, WorkflowNode } from "../../types/executionTypes";
import replaceVariable from "../replaceVariable";
import { getSourceData } from "./getSourceData";


export async function executeTelegram (
    node: WorkflowNode,
    context: ExecutionContext,
    credentialId: string
): Promise<any> {
    try {

        console.log("telegram started executing...")
        if (!credentialId) {
            throw new Error("Telegram credentials not provided. Please select or create credentials.")
        }

        const credentials = await prisma.credentials.findFirst({
            where: {
                id: credentialId,
                userId: context.userId
            }
        })

        if (!credentials || !credentials.data || typeof credentials.data !== "object") {
            throw new Error("Telegram credentials not found")
        }

        const credentialData = credentials.data as { botToken?: string}

        if (!credentialData.botToken) {
            throw new Error("Bot token not found in credentials");
        }

        const botToken = credentialData.botToken;

        let { chatId, message, parseMode = "HTML" } = node.parameters as any;

        let effectiveMessage = message || "";
        
        // Get source data if usePreviousResult is enabled
        const sourceData = getSourceData(node, context);
        if (sourceData) {
            if (typeof sourceData === "string") {
                effectiveMessage = sourceData;
            } else if (typeof sourceData === "object") {
                effectiveMessage = sourceData.text ?? JSON.stringify(sourceData);
            }
        }

        if (!chatId || !effectiveMessage) {
            throw new Error("ChatId and messages are required for Telegram action")
        }

        const processedMessage = replaceVariable(effectiveMessage, context);
        
        //Controlled timeout to avoid handing requests
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10_000);
        console.log(processedMessage);

        const response = await fetch(
            `https://api.telegram.org/bot${botToken}/sendMessage`,
            {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify({
                    chat_id: chatId,
                    text: processedMessage,
                    parse_mode: parseMode
                }),
                signal: controller.signal
            }
        )

        clearTimeout(timeoutId);

        const responseJson: any = await response.json()

        console.log("telegram response:", responseJson.result.text)
        console.log("telegram node execution completed.")

        if (!response.ok) {
            throw new Error(`Telegram API error: ${responseJson.result.text ?? "Unknown error"}`)
        }
        

        return {
            success: true,
            data: responseJson,
            message: "Telegram message sent successfully"
        }
    } catch (error:any) {
        console.error("Telegram Executor failed:", error);
        if (error.name === "AbortError") {
            return {
                success: false,
                data: null,
                message: "Telegram message send timeout"
            }
        }

        return {
            success: false,
            data: null,
            message: error instanceof Error ? error.message : "unknown error"
        }
    }
}