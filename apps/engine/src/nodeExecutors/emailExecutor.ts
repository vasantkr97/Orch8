import { prisma } from "@orch8/db"
import type { ExecutionContext, WorkflowNode } from "../../types/executionTypes";
import replaceVariable from "../replaceVariable";

export async function executeEmailNode( 
    node: WorkflowNode, 
    context: ExecutionContext, 
    credentialId: string, 
    previousNodeId?: string
) : Promise<any> {
    try {
        console.log("email is called")

        if (!credentialId) {
            throw new Error("Email credentials not provided. Please select or create credentials.");
        }

        const credentials = await prisma.credentials.findFirst({
            where: { 
                id: credentialId, 
                userId: context.userId, 
            }
        })

        if (!credentials || !credentials.data || typeof credentials.data !== "object") {
            throw new Error("Email credentials not found")
        }

        const credentialData = credentials.data as { apikey?: string }

        if (!credentialData.apikey) {
            throw new Error("Resend API key not found in credentials");
        }

        const apiKey = credentialData.apikey;

        let { from, to, subject, html, text, usePreviousResult } = node.parameters as any;
        if (usePreviousResult && context.data) {
            let previousText: string | undefined;
            try {
                let previousNodeResult: any;

                //Use the immediate previous node result
                if (previousNodeId && context.data && typeof context.data === "object")  {
                    previousNodeResult = context.data[previousNodeId]
                } else {
                    //fallback to explicitly configured previousNodeId
                    const preferredNodeId = node.parameters?.previousNodeId
                    previousNodeResult = preferredNodeId
                        ? context.data[preferredNodeId]
                        : undefined;
                }

                if (typeof previousNodeResult === "string") {
                    previousText = previousNodeResult;
                } else if (typeof previousNodeResult === "object") {
                    previousText = JSON.stringify(previousNodeResult);
                }
            } catch(err: any) {
                console.error("[Email Node] failed to extract previous result", err);
            }

            if (previousText) {
                if (typeof html === "string" && html.length > 0) {
                    if (html.includes('{{previous}}')) {
                        html = html.split('{{previous}}').join(previousText);
                    } else {
                        html = `${html}<br/><br/>${previousText}`
                    }
                } else if (typeof text === 'string' && text.length > 0) {
                    if (text.includes('{{previous}}')) {
                        text = text.split('{{previous}}').join(previousText);
                    } else {
                        text = `${text}\n\n${previousText}`;
                    }
                } else {
                    text = previousText;
                }
            }
        } 

        if (!from || !to || !subject) {
            throw new Error('From, to, and subject are required for email action');
        }

        if (!html && !text) {
            throw new Error('Either HTML or text content is required for email');
        }

        const processedSubject = replaceVariable(subject, context);
        const processedHtml = html ? replaceVariable(html, context) : undefined;
        const processedText = text ? replaceVariable(text, context) : undefined;

         
        const emailData: any = {
            from,
            to: Array.isArray(to) ? to : [to],
            subject: processedSubject
        }

        if (processedHtml) emailData.html = processedHtml;
        if (processedText) emailData.text = processedText;

        const response = await fetch('https://api.resend.com/emails', {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(emailData)
        })

        const result = await response.json() as any;

        console.log("email node result", result)

        if (!response.ok) {
            throw new Error(`Email error response: ${result.message}`)
        }

        return {
            success: true,
            data: result,
            message: "email send successfully."
        }

    } catch (error: any) {
        return {
            success: false,
            data: null,
            message: error instanceof Error ? error.message : "unknown error",
        }
    }
}