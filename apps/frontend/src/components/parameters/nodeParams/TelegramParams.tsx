import { CredentialsSelector } from '../CredentialsSelector';

export function TelegramParams({ data, setData }: any) {
  const params = data.parameters || {};

  return (
    <div className="space-y-4">
      <div>
        <label className="block font-medium text-gray-300 mb-2">
          Credentials *
        </label>
        
        <CredentialsSelector
          credentialType="telegram"
          selectedCredentialId={data.credentialsId}
          onChange={(credentialId) => setData({ ...data, credentialsId: credentialId })}
        />
      </div>

      <div>
        <label className="block font-medium text-gray-300 mb-2">
          Chat ID *
        </label>
        <input
          type="text"
          value={params.chatId || ""}
          onChange={(e) => setData({ ...data, parameters: { ...params, chatId: e.target.value } })}
          placeholder="123456789"
          className="w-full border rounded px-3 py-2 bg-gray-800 text-white placeholder-gray-500 border-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
        <p className="text-xs text-gray-500 mt-1">
          The Telegram chat ID to send the message to
        </p>
      </div>

      <div>
        <label className="block font-medium text-gray-300 mb-2">
          Message *
        </label>
        <textarea
          value={params.message || ""}
          onChange={(e) => setData({ ...data, parameters: { ...params, message: e.target.value } })}
          placeholder="Enter your message here..."
          rows={4}
          className="w-full border rounded px-3 py-2 bg-gray-800 text-white placeholder-gray-500 border-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
        <p className="text-xs text-gray-500 mt-1">
          The message text to send
        </p>
      </div>
    </div>
  );
}
