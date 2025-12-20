import { CredentialsSelector } from '../CredentialsSelector';

export function EmailParams({ data, setData }: any) {
  const params = data.parameters || {};

  return (
    <div className="space-y-4">
      <div>
        <label className="block font-medium text-gray-300 mb-2">
          Credentials *
        </label>
        <CredentialsSelector
          credentialType="email"
          selectedCredentialId={data.credentialsId}
          onChange={(credentialId) => setData({ ...data, credentialsId: credentialId })}
        />
      </div>

      <div>
        <label className="block font-medium text-gray-300 mb-2">
          From *
        </label>
        <input
          type="email"
          value={params.from || ""}
          onChange={(e) => setData({ ...data, parameters: { ...params, from: e.target.value } })}
          placeholder="from@example.com"
          className="w-full border rounded px-3 py-2 bg-gray-800 text-white placeholder-gray-500 border-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>

      <div>
        <label className="block font-medium text-gray-300 mb-2">
          To *
        </label>
        <input
          type="email"
          value={params.to || ""}
          onChange={(e) => setData({ ...data, parameters: { ...params, to: e.target.value } })}
          placeholder="to@example.com"
          className="w-full border rounded px-3 py-2 bg-gray-800 text-white placeholder-gray-500 border-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>

      <div>
        <label className="block font-medium text-gray-300 mb-2">
          Subject *
        </label>
        <input
          type="text"
          value={params.subject || ""}
          onChange={(e) => setData({ ...data, parameters: { ...params, subject: e.target.value } })}
          placeholder="Email subject"
          className="w-full border rounded px-3 py-2 bg-gray-800 text-white placeholder-gray-500 border-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>

      <div>
        <label className="block font-medium text-gray-300 mb-2">
          Message *
        </label>
        <textarea
          value={params.text || ""}
          onChange={(e) => setData({ ...data, parameters: { ...params, text: e.target.value } })}
          placeholder="Email content..."
          rows={6}
          className="w-full border rounded px-3 py-2 bg-gray-800 text-white placeholder-gray-500 border-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>
    </div>
  );
}
