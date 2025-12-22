import { prisma } from "@orch8/db";
import type { ExecutionContext, WorkflowNode } from "../../types/executionTypes";
import replaceVariable from "../replaceVariable";
import { GoogleGenAI } from "@google/genai";
import { getSourceData } from "./getSourceData";


export async function executeGemini(
    node: WorkflowNode,
    context: ExecutionContext,
    credentialId: string
): Promise<any> {

    try {

        console.log("Agent started executing...")

        if (!credentialId) {
            throw new Error("Gemini credentials not provided. Please select or create credentials.")
        }

        const credentials = await prisma.credentials.findFirst({
            where: {
                id: credentialId,
                userId: context.userId
            }
        })

        if (!credentials || !credentials.data || typeof credentials.data !== "object") {
            throw new Error("Gemini credentials not found")
        }

        const credentialData = credentials.data as { apikey?: string }

        const apiKeyFromCred = credentialData.apikey;

        let { prompt, model = "gemini-2.5-flash", temperature = 0.7, apiKey: apiKeyFromParams } = node.parameters as any

        const apikey = apiKeyFromCred ?? apiKeyFromParams

        if (!apikey) {
            throw new Error("Gemini API key not provided. Select credentials or enter an API key in the node config.");
        }

        // Get source data if usePreviousResult is enabled and no prompt provided
        if (!prompt) {
            const sourceData = getSourceData(node, context);
            if (sourceData) {
                if (typeof sourceData === "string") {
                    prompt = sourceData;
                } else if (typeof sourceData === "object") {
                    prompt = sourceData.text ?? JSON.stringify(sourceData);
                }
            }
        }

        if (!prompt) {
            throw new Error('Prompt is requried for Gemini Action')
        }

        const processedPrompt = replaceVariable(prompt, context)

        const client = new GoogleGenAI({ apiKey: apikey });

        const response = await client.models.generateContent({
            model,
            contents: [
                {
                    role: "user",
                    parts: [{ text: processedPrompt }]
                }
            ],
            config: {
                temperature: Number(temperature) || 0.7,
                topK: 40,
                topP: 0.95
            }
        })

        const generatedText = response?.text;
        console.log("gemini response:", generatedText)
        console.log("gemini node execution completed.")

        return {
            success: true,
            data: {
                text: generatedText,
                model: model,
            },
            msg: "Agent response generated sucessfully"
        }

    } catch (error) {
        console.log("gemini execution failed", error)
        return {
            success: false,
            data: null,
            msg: error instanceof Error ? error.message : "unknown error"
        }
    }
}