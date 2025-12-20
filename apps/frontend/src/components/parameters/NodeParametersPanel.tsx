import { useState, useEffect } from "react";
import { GeminiParams } from "./nodeParams/GeminiParams";
import { TelegramParams } from "./nodeParams/TelegramParams";
import { EmailParams } from "./nodeParams/EmailParams";
import GenericParams from "./nodeParams/GenericParams";

export function NodeParametersPanel({ node, onClose, onSave }: any) {
  const [localData, setLocalData] = useState(node.data || {});
  
  // Sync local data with node data only when the node ID changes (i.e., different node selected)
  // This prevents resetting localData when parent re-renders but keeps the same node
  useEffect(() => {
    setLocalData(node.data || {});
  }, [node.id]);

  const handleSave = () => {
    onSave(node.id, localData);
    onClose();
  };

  const renderParams = () => {
    switch (node.type) {
      case "gemini":
        return <GeminiParams data={localData} setData={setLocalData} />;
      case "telegram":
        return <TelegramParams data={localData} setData={setLocalData} />;
      case "email":
        return <EmailParams data={localData} setData={setLocalData} />;
      default:
        return <GenericParams data={localData} setData={setLocalData} />;
    }
  };

  return (
    <>
      <div 
        className="fixed inset-0 z-40 bg-black/40"
        onClick={onClose}
      />
      
      <div className="fixed top-0 right-0 bottom-0 w-96 bg-gray-950 border-l border-gray-800 z-50 flex flex-col animate-slideLeft">
        <div className="p-4 border-b border-gray-800 flex justify-between items-center">
          <h2 className="text-base font-medium text-white">Configure {node.type}</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-1"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">{renderParams()}</div>

        <div className="p-4 border-t border-gray-800 flex justify-end gap-2">
          <button 
            onClick={onClose} 
            className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-white text-sm font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    </>
  );
}
