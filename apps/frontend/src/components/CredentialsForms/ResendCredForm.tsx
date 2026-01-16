import { useState } from "react";
import toast from 'react-hot-toast';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCredentials, getCredentials, postCredentials } from "../../services/credentials.service";

const getResendCredentials = async () => {
  const response = await getCredentials();
  const allCredentials = response.credentials || [];
  return allCredentials.filter((cred: any) => cred.platform === 'resendemail');
};

const createResendCredential = async (formData: { title: string; apiKey: string; fromEmail: string }) => {
  return await postCredentials({
    title: formData.title,
    platform: 'resendemail',
    data: { apikey: formData.apiKey, fromEmail: formData.fromEmail }
  });
};

const deleteResendCredential = async (id: string) => {
  return await deleteCredentials(id);
};

export function ResendCredentials() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ title: "", apiKey: "", fromEmail: "" });

  const { data: credentials } = useQuery({
    queryKey: ["resendCredentials"],
    queryFn: getResendCredentials,
  });

  const createMutation = useMutation({
    mutationFn: createResendCredential,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resendCredentials"], exact: false });
      queryClient.invalidateQueries({ queryKey: ["credentials"], exact: false });
      setShowForm(false);
      setFormData({ title: "", apiKey: "", fromEmail: "" });
      toast.success('Email credential saved successfully!');
    },
    onError: (error: any) => {
      console.error('Failed to create credential:', error);
      toast.error(`Failed to save: ${error.response?.data?.msg || error.message}`);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteResendCredential,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resendCredentials"] });
      queryClient.invalidateQueries({ queryKey: ["credentials"] });
    },
  });

  return (
    <div>
      <div className="grid gap-2 md:grid-cols-2">
        {credentials?.map((cred: any) => (
          <div key={cred.id} className="bg-gray-50 rounded-lg px-3 py-2.5 flex justify-between items-center hover:bg-gray-100 transition-colors border border-gray-200">
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium text-gray-900 truncate">{cred.title}</h3>
              <p className="text-xs text-gray-500">
                {new Date(cred.createdAt).toLocaleDateString()}
              </p>
            </div>
            <button
              onClick={() => deleteMutation.mutate(cred.id)}
              className="text-gray-400 hover:text-red-500 transition-colors ml-2 p-1"
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
          className="px-3 py-2.5 bg-white/50 rounded-lg hover:bg-[#a1b6ae]/10 transition-colors flex items-center justify-center text-sm font-medium text-[#a1b6ae] border border-dashed border-[#a1b6ae]"
        >
          <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Key
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-2xl border border-gray-200">
            <h3 className="text-xl font-semibold mb-4 flex items-center text-gray-900">
              New Email Credential
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Credential Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g., My Email Service"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, title: e.target.value }))
                  }
                  className="w-full px-3 py-2 rounded-lg bg-white border border-gray-300 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-gray-900 placeholder-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Resend API Key *
                </label>
                <input
                  type="password"
                  placeholder="re_..."
                  value={formData.apiKey}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, apiKey: e.target.value }))
                  }
                  className="w-full px-3 py-2 rounded-lg bg-white border border-gray-300 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-gray-900 placeholder-gray-400"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Get your API key from Resend dashboard
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  From Email *
                </label>
                <input
                  type="email"
                  placeholder="noreply@yourdomain.com"
                  value={formData.fromEmail}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, fromEmail: e.target.value }))
                  }
                  className="w-full px-3 py-2 rounded-lg bg-white border border-gray-300 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-gray-900 placeholder-gray-400"
                />
                <p className="text-xs text-gray-500 mt-1">
                  The default sender email address
                </p>
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowForm(false)}
                className="flex-1 border border-gray-200 hover:border-gray-300 rounded-lg py-2 transition-colors bg-white text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                disabled={!formData.title || !formData.apiKey || !formData.fromEmail || createMutation.isPending}
                onClick={() => createMutation.mutate(formData)}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg py-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
