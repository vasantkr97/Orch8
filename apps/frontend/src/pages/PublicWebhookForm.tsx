import { useState } from 'react';

export default function PublicWebhookForm() {
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'loading' | null; text: string }>({
    type: null,
    text: '',
  });

  const WEBHOOK_URL = 'http://localhost:3000/api/executions/webhook/YOUR_WORKFLOW_ID?token=YOUR_TOKEN';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userInput.trim()) {
      setMessage({ type: 'error', text: 'Please enter some text!' });
      return;
    }

    if (userInput.length < 10) {
      setMessage({ type: 'error', text: 'Please enter at least 10 characters!' });
      return;
    }

    setLoading(true);
    setMessage({ type: 'loading', text: 'AI is generating your response... This may take a few seconds.' });

    try {
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userInput: userInput,
          timestamp: new Date().toISOString(),
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage({
          type: 'success',
          text: `Success! AI has generated your response.\nExecution ID: ${data.data.executionId}\n📱 Check your Telegram for the result!`,
        });
        setUserInput('');

        setTimeout(() => {
          setMessage({ type: null, text: '' });
        }, 10000);
      } else {
        setMessage({ type: 'error', text: `Error: ${data.error || 'Unknown error occurred'}` });
      }
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: `Network Error: ${error.message}\nPlease check if the server is running.`,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full animate-fadeIn">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">AI Text Generator</h1>
          <p className="text-gray-600">Enter your text and let AI generate a creative response!</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <textarea
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Type something here... (e.g., 'Write a motivational quote about success')"
              maxLength={500}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-indigo-600 focus:outline-none resize-none h-32 text-gray-800 transition-colors"
              disabled={loading}
            />
            <div className="text-right text-sm text-gray-500 mt-1">
              {userInput.length} / 500 characters
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 px-6 rounded-xl text-white font-semibold text-lg transition-all ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 hover:shadow-lg hover:-translate-y-0.5'
            }`}
          >
            {loading ? 'Processing...' : 'Generate with AI'}
          </button>
        </form>

        {message.type && (
          <div
            className={`mt-6 p-4 rounded-xl animate-slideIn ${
              message.type === 'success'
                ? 'bg-green-50 text-green-800 border-l-4 border-green-500'
                : message.type === 'error'
                ? 'bg-red-50 text-red-800 border-l-4 border-red-500'
                : 'bg-blue-50 text-blue-800 border-l-4 border-blue-500'
            }`}
          >
            <div className="whitespace-pre-line">{message.text}</div>
          </div>
        )}

        <div className="mt-8 text-center text-sm text-gray-500">
          Powered by Gemini AI  | Built with orch8
        </div>

        <div className="mt-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-lg">
          <p className="text-sm text-yellow-800 font-semibold">Setup Required:</p>
          <p className="text-xs text-yellow-700 mt-1">
            Update <code className="bg-yellow-100 px-1 rounded">WEBHOOK_URL</code> in{' '}
            <code className="bg-yellow-100 px-1 rounded">PublicWebhookForm.tsx</code> with your actual webhook URL from
            orch8.
          </p>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }

        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

