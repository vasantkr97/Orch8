import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCredentials, postCredentials } from '../../services/credentials.service';

interface CredentialsSelectorProps {
  credentialType: string;
  selectedCredentialId?: string;
  onChange: (credentialId: string) => void;
  compact?: boolean;
}

export function CredentialsSelector({ 
  credentialType, 
  selectedCredentialId, 
  onChange,
  compact = false,
}: CredentialsSelectorProps) {
  const queryClient = useQueryClient();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState<any>({});

  const { data: response, isLoading } = useQuery({
    queryKey: ['credentials', credentialType],
    queryFn: getCredentials,
    staleTime: 0,
    refetchOnMount: true,
  });

  const createMutation = useMutation({
    mutationFn: postCredentials,
    onSuccess: (data) => {
      // Refresh both generic and type-scoped credential caches
      queryClient.invalidateQueries({ queryKey: ['credentials'], exact: false });
      queryClient.invalidateQueries({ queryKey: ['credentials', credentialType], exact: false });
      setShowCreateForm(false);
      setFormData({});
      // Automatically select the newly created credential (support multiple shapes)
      const newId = (data && (data.id || data?.data?.id || data?.credential?.id || data?.created?.id)) || '';
      if (newId) {
        onChange(String(newId));
        alert('✅ Credential saved successfully!');
      }
    },
    onError: (error: any) => {
      console.error('Failed to create credential:', error);
      alert(`❌ Failed to save credential: ${error.response?.data?.msg || error.message}`);
    },
  });

  // Normalize API response to a credentials array regardless of backend shape
  const allCredentials: any[] = Array.isArray(response)
    ? response
    : (response?.credentials || response?.data?.credentials || []);

  const credentials = allCredentials.filter((cred: any) => {
    const platform = String(cred.platform || '').toLowerCase();
    const type = String(credentialType || '').toLowerCase();
    return platform === type || platform.includes(type) || type.includes(platform);
  });

  const handleCreateCredential = () => {
    if (!formData.title) return;
    
    const credentialData: any = {
      title: formData.title,
      // send enum value expected by backend
      platform: credentialType.toLowerCase() === 'telegram' ? 'Telegram'
               : credentialType.toLowerCase() === 'gemini' ? 'Gemini'
               : credentialType.toLowerCase() === 'email' || credentialType.toLowerCase() === 'resend' ? 'ResendEmail'
               : credentialType,
    };

    // Map form data based on credential type
    if (credentialType.toLowerCase() === 'telegram') {
      if (!formData.botToken) return;
      credentialData.data = { botToken: formData.botToken };
    } else if (credentialType.toLowerCase() === 'gemini') {
      if (!formData.apiKey) return;
      credentialData.data = { apiKey: formData.apiKey };
    } else if (credentialType.toLowerCase() === 'email') {
      if (!formData.apiKey || !formData.fromEmail) return;
      credentialData.data = { 
        apiKey: formData.apiKey,
        fromEmail: formData.fromEmail 
      };
    }

    createMutation.mutate(credentialData);
  };

  const isFormValid = () => {
    if (!formData.title) return false;
    
    const type = credentialType.toLowerCase();
    if (type === 'telegram') return !!formData.botToken;
    if (type === 'gemini') return !!formData.apiKey;
    if (type === 'email') return !!(formData.apiKey && formData.fromEmail);
    
    return false;
  };

  if (isLoading) {
    return (
      <div className={`w-full border border-gray-700 rounded-lg ${compact ? 'px-2 py-1 text-xs' : 'px-3 py-2 text-sm'} bg-gray-800 text-gray-300 flex items-center`}>
        <svg className={`animate-spin ${compact ? 'h-3.5 w-3.5 mr-1.5' : 'h-4 w-4 mr-2'} text-gray-500`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Loading credentials...
      </div>
    );
  }

  const renderCreateForm = () => {
    if (!showCreateForm) return null;

    return (
      <div className={`absolute top-0 left-full ml-2 z-50 ${compact ? 'w-56 p-2' : 'w-64 p-3'} bg-gray-900 border border-gray-800 rounded-lg shadow-2xl`}>
        <div className={`flex items-center justify-between ${compact ? 'mb-2' : 'mb-3'}`}>
          <h4 className={`${compact ? 'text-xs' : 'text-sm'} font-semibold text-gray-200`}>New {credentialType.charAt(0).toUpperCase() + credentialType.slice(1)}</h4>
          <button onClick={() => { setShowCreateForm(false); setFormData({}); }} className="text-gray-400 hover:text-white">
            <svg className={`${compact ? 'w-4 h-4' : 'w-5 h-5'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-2">
          <div>
            <label className="block text-[11px] text-gray-300 mb-1">Name *</label>
            <input
              type="text"
              placeholder={`e.g., My ${credentialType}`}
              value={formData.title || ''}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className={`w-full ${compact ? 'px-2 py-1 text-xs' : 'px-2 py-1.5 text-sm'} border border-gray-700 rounded bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500`}
            />
          </div>

          {credentialType.toLowerCase() === 'telegram' && (
            <div>
              <label className="block text-[11px] text-gray-300 mb-1">Bot Token *</label>
              <input
                type="password"
                placeholder="1234567890:ABCdef..."
                value={formData.botToken || ''}
                onChange={(e) => setFormData({ ...formData, botToken: e.target.value })}
                className={`w-full ${compact ? 'px-2 py-1 text-xs' : 'px-2 py-1.5 text-sm'} border border-gray-700 rounded bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500`}
              />
            </div>
          )}

          {credentialType.toLowerCase() === 'gemini' && (
            <div>
              <label className="block text-[11px] text-gray-300 mb-1">API Key *</label>
              <input
                type="password"
                placeholder="AIza..."
                value={formData.apiKey || ''}
                onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
                className={`w-full ${compact ? 'px-2 py-1 text-xs' : 'px-2 py-1.5 text-sm'} border border-gray-700 rounded bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500`}
              />
            </div>
          )}

          {credentialType.toLowerCase() === 'email' && (
            <>
              <div>
                <label className="block text-[11px] text-gray-300 mb-1">Resend API Key *</label>
                <input
                  type="password"
                  placeholder="re_..."
                  value={formData.apiKey || ''}
                  onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
                  className={`w-full ${compact ? 'px-2 py-1 text-xs' : 'px-2 py-1.5 text-sm'} border border-gray-700 rounded bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500`}
                />
              </div>
              <div>
                <label className="block text-[11px] text-gray-300 mb-1">From Email *</label>
                <input
                  type="email"
                  placeholder="noreply@yourdomain.com"
                  value={formData.fromEmail || ''}
                  onChange={(e) => setFormData({ ...formData, fromEmail: e.target.value })}
                  className={`w-full ${compact ? 'px-2 py-1 text-xs' : 'px-2 py-1.5 text-sm'} border border-gray-700 rounded bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500`}
                />
              </div>
            </>
          )}

          <div className="flex justify-end gap-2 pt-1">
            <button
              onClick={() => {
                setShowCreateForm(false);
                setFormData({});
              }}
              className={`${compact ? 'px-3 py-1 text-xs' : 'px-3 py-1.5 text-xs'} rounded-lg border border-gray-700 bg-gray-800 text-white hover:bg-gray-700`}
            >
              Cancel
            </button>
            <button
              onClick={handleCreateCredential}
              disabled={createMutation.isPending || !isFormValid()}
              className={`${compact ? 'px-3 py-1 text-xs' : 'px-3 py-1.5 text-xs'} rounded-lg bg-orange-600 text-white hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {createMutation.isPending ? 'Saving...' : 'Save & Select'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="relative">
      <select
        value={selectedCredentialId || ''}
        onChange={(e) => {
          const value = e.target.value;
          if (value === '__create_new__') {
            setShowCreateForm(true);
          } else {
            onChange(value);
            setShowCreateForm(false);
          }
        }}
        className={`w-full border rounded-lg ${compact ? 'px-2 py-1 text-xs' : 'px-3 py-2.5 text-sm'} focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-800 text-white transition-all ${
          selectedCredentialId ? 'border-green-500' : 'border-gray-700'
        }`}
      >
        <option value="">Select Credential</option>
        {credentials.map((cred: any) => (
          <option key={String(cred.id)} value={String(cred.id)}>
            {cred.title}
          </option>
        ))}
        <option value="__create_new__">+ Create new credential</option>
      </select>

      {renderCreateForm()}
    </div>
  );
}

