import { GeminiCredentials } from "../components/CredentialsForms/GeminiCredForm";
import { ResendCredentials } from "../components/CredentialsForms/ResendCredForm";
import { TelegramCredentials } from "../components/CredentialsForms/TelegramCredForm";
import { getNodeConfig } from "../components/nodes/nodeConfig";

const CredentialIcon = ({ type }: { type: string }) => {
  const config = getNodeConfig(type);

  return (
    <div
      className="w-8 h-8 rounded flex items-center justify-center shrink-0"
      style={{ backgroundColor: `${config.color}15` }}
    >
      {type === 'gemini' ? (
        <img src={config.iconPath} alt={config.label} className="w-5 h-5" />
      ) : (
        <div
          className="w-4 h-4"
          style={{
            maskImage: `url(${config.iconPath})`,
            WebkitMaskImage: `url(${config.iconPath})`,
            maskSize: 'contain',
            WebkitMaskSize: 'contain',
            maskRepeat: 'no-repeat',
            WebkitMaskRepeat: 'no-repeat',
            backgroundColor: config.color
          }}
        />
      )}
    </div>
  );
};

export default function Credentials() {
  return (
    <div className="h-full bg-[#f9fafb] text-gray-900 overflow-auto">
      {/* Minimal Header */}
      <div className="border-b border-gray-200 px-6 py-4 bg-[#f9fafb]/80 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-xl font-semibold text-gray-900">Credentials</h1>
          <p className="text-xs text-gray-500 mt-1">Manage API keys</p>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6">
        <div className="max-w-4xl mx-auto space-y-4">

          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-gray-300 transition-colors shadow-sm">
            <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2.5 bg-gray-50/50">
              <CredentialIcon type="gemini" />
              <div>
                <h3 className="text-sm font-semibold text-gray-900">Google Gemini</h3>
                <p className="text-xs text-gray-500">AI model</p>
              </div>
            </div>
            <div className="p-4">
              <GeminiCredentials />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-gray-300 transition-colors shadow-sm">
            <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2.5 bg-gray-50/50">
              <CredentialIcon type="telegram" />
              <div>
                <h3 className="text-sm font-semibold text-gray-900">Telegram Bot</h3>
                <p className="text-xs text-gray-500">Messaging</p>
              </div>
            </div>
            <div className="p-4">
              <TelegramCredentials />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-gray-300 transition-colors shadow-sm">
            <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2.5 bg-gray-50/50">
              <CredentialIcon type="resendemail" />
              <div>
                <h3 className="text-sm font-semibold text-gray-900">Resend Email</h3>
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
