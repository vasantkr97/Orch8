export interface CredentialData {
    title: string;
    platform: string;
    data: any
}

export interface UpdateCredentialData {
    title?: string;
    platform?: string;
    data?: any
}


export interface Credentials {
    id: string;
    name: string;
    type:   PublicKeyCredentialType;
    data: Record<string, any>;
    createdAt: string;
    updatedAt: string;
}

export type CredentialType =
| 'gemini'
| 'telegram'
| 'resend'
| 'smtp';

export interface CredntialDefinition {
    type: CredentialType;
    name: string;
    icon: string;
    Properties: CredentialProperty[];
}

export interface CredentialProperty {
    name: string;
    displayName: string;
    type: "string" | "password";
    required: boolean;
    placeholder?: string;
}