import { useState } from "react";
import toast from 'react-hot-toast';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCredentials, getCredentials, postCredentials } from "../../services/credentials.service";

const getGeminiCredentials = async () => {
  const response = await getCredentials();
  const allCredentials = response.credentials || [];
  return allCredentials.filter((cred: any) => cred.platform === 'gemini');
};

const createGeminiCredential = async (formData: { title: string; apiKey: string }) => {
  return await postCredentials({
    title: formData.title,
    platform: 'gemini',
    data: { apikey: formData.apiKey }
  });
};

const deleteGeminiCredential = async (id: string) => {
  return await deleteCredentials(id);
};

export function GeminiCredentials() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ title: "", apiKey: "" });

  const { data: credentials, isLoading } = useQuery({
    queryKey: ["geminiCredentials"],
    queryFn: getGeminiCredentials,
  });

  const createMutation = useMutation({
    mutationFn: createGeminiCredential,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["geminiCredentials"], exact: false });
      queryClient.invalidateQueries({ queryKey: ["credentials"], exact: false });
      setShowForm(false);
      setFormData({ title: "", apiKey: "" });
      toast.success('Gemini credential saved successfully!');
    },
    onError: (error: any) => {
      console.error('Failed to create credential:', error);
      toast.error(`Failed to save: ${error.response?.data?.msg || error.message}`);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteGeminiCredential,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["geminiCredentials"] });
      queryClient.invalidateQueries({ queryKey: ["credentials"] });
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 py-2">
        <div className="animate-spin h-4 w-4 border-2 border-orange-500 border-t-transparent rounded-full"></div>
        <p className="text-sm text-gray-400">Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid gap-2 md:grid-cols-2">
        {credentials?.map((cred: any) => (
          <div
            key={cred.id}
            className="bg-gray-800/50 rounded-lg px-3 py-2.5 flex justify-between items-center hover:bg-gray-800 transition-colors border border-gray-700/50"
          >
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium text-white truncate">{cred.title}</h3>
              <p className="text-xs text-gray-500">
                {new Date(cred.createdAt).toLocaleDateString()}
              </p>
            </div>
            <button
              onClick={() => deleteMutation.mutate(cred.id)}
              className="text-gray-500 hover:text-red-400 transition-colors ml-2 p-1"
              title="Delete"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        ))}

        <button
          onClick={() => setShowForm(true)}
          className="px-3 py-2.5 bg-blue-600/10 rounded-lg hover:bg-blue-600/20 transition-colors flex items-center justify-center text-sm font-medium text-blue-400 border border-dashed border-blue-600/30 hover:border-blue-600/50"
        >
          <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Key
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-xl w-full max-w-md shadow-2xl border border-gray-800">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              New Gemini Credential
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Credential Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g., My Gemini API Key"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, title: e.target.value }))
                  }
                  className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 text-white placeholder-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  API Key *
                </label>
                <input
                  type="password"
                  placeholder="AIza..."
                  value={formData.apiKey}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, apiKey: e.target.value }))
                  }
                  className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 text-white placeholder-gray-400"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Get your API key from Google AI Studio
                </p>
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowForm(false)}
                className="flex-1 border border-gray-700 hover:border-gray-600 rounded-lg py-2 transition-colors bg-gray-800 text-white"
              >
                Cancel
              </button>
              <button
                disabled={!formData.title || !formData.apiKey || createMutation.isPending}
                onClick={() => createMutation.mutate(formData)}
                className="flex-1 bg-orange-600 hover:bg-orange-700 rounded-lg py-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {createMutation.isPending ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
