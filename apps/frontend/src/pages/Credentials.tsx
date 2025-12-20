import { GeminiCredentials } from "../components/CredentialsForms/GeminiCredForm";
import { ResendCredentials } from "../components/CredentialsForms/ResendCredForm";
import { TelegramCredentials } from "../components/CredentialsForms/TelegramCredForm";

export default function Credentials() {
  return (
    <div className="h-full bg-gray-950 text-white overflow-auto">
      {/* Minimal Header */}
      <div className="border-b border-gray-800/50 px-6 py-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-xl font-medium text-white">Credentials</h1>
          <p className="text-xs text-gray-500 mt-1">Manage API keys</p>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6">
        <div className="max-w-4xl mx-auto space-y-4">
      
          <div className="bg-gray-900/40 rounded-lg border border-gray-800/50 overflow-hidden hover:border-gray-700/50 transition-colors">
            <div className="px-4 py-3 border-b border-gray-800/50 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded bg-blue-500/10 flex items-center justify-center">
                <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-medium text-white">Google Gemini</h3>
                <p className="text-xs text-gray-500">AI model</p>
              </div>
            </div>
            <div className="p-4">
              <GeminiCredentials />
            </div>
          </div>

          <div className="bg-gray-900/40 rounded-lg border border-gray-800/50 overflow-hidden hover:border-gray-700/50 transition-colors">
            <div className="px-4 py-3 border-b border-gray-800/50 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded bg-blue-500/10 flex items-center justify-center">
                <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-medium text-white">Telegram Bot</h3>
                <p className="text-xs text-gray-500">Messaging</p>
              </div>
            </div>
            <div className="p-4">
              <TelegramCredentials />
            </div>
          </div>

          <div className="bg-gray-900/40 rounded-lg border border-gray-800/50 overflow-hidden hover:border-gray-700/50 transition-colors">
            <div className="px-4 py-3 border-b border-gray-800/50 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded bg-purple-500/10 flex items-center justify-center">
                <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-medium text-white">Resend Email</h3>
                <p className="text-xs text-gray-500">Email service</p>
              </div>
            </div>
            <div className="p-4">
              <ResendCredentials />
            </div>
          </div>

          <div className="mt-6 flex items-center gap-2 text-xs text-gray-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span>Credentials are encrypted</span>
          </div>
        </div>
      </div>
    </div>
  );
}
