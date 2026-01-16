import { useState } from 'react';
import { getNodeConfig } from './nodes/nodeTypes';

interface NodeSelectorProps {
  onNodeSelect: (nodeType: string) => void;
  onClose: () => void;
  isVisible: boolean;
  hasTrigger: boolean;
}

const nodeCategories = {
  'Triggers': ['manual', 'webhook',],
  'Actions': ['telegram', 'resendemail', 'gemini'],
};

export const NodeSelector = ({ onNodeSelect, onClose, isVisible }: NodeSelectorProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Actions');
  const [searchTerm, setSearchTerm] = useState('');

  if (!isVisible) return null;

  const availableCategories = nodeCategories;

  const filteredNodes = searchTerm
    ? Object.values(availableCategories).flat().filter(nodeType =>
      nodeType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getNodeConfig(nodeType).label.toLowerCase().includes(searchTerm.toLowerCase())
    )
    : availableCategories[selectedCategory as keyof typeof availableCategories] || [];

  return (
    <>
      <div
        className="fixed inset-0 z-40"
        onClick={onClose}
      />

      <div
        className={`fixed right-0 top-0 bottom-0 z-50 w-80 bg-white border-l border-gray-200 flex flex-col transition-transform duration-300 shadow-2xl ${isVisible ? 'translate-x-0' : 'translate-x-full'
          }`}
      >
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-900">Add Node</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <input
            type="text"
            placeholder="Search nodes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            autoFocus
          />
        </div>

        {!searchTerm && (
          <div className="flex border-b border-gray-200 px-4">
            {Object.keys(availableCategories).map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`flex-1 py-3 text-sm font-medium transition-colors relative ${selectedCategory === category
                  ? 'text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
                  }`}
              >
                {category}
                {selectedCategory === category && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
                )}
              </button>
            ))}
          </div>
        )}


        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-3">
            {filteredNodes.map((nodeType) => {
              const config = getNodeConfig(nodeType);
              return (
                <button
                  key={nodeType}
                  onClick={() => onNodeSelect(nodeType)}
                  className="w-full flex items-center p-3 rounded-xl bg-white border border-gray-100 hover:border-blue-500/30 hover:shadow-md transition-all group text-left shadow-sm"
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mr-4 group-hover:scale-105 transition-transform"
                    style={{ backgroundColor: `${config.color}15` }}
                  >
                    {nodeType === 'gemini' ? (
                      <img
                        src={config.iconPath}
                        alt={config.label}
                        className="w-7 h-7"
                      />
                    ) : (
                      <div
                        className="w-7 h-7"
                        style={{
                          maskImage: `url(${config.iconPath})`,
                          WebkitMaskImage: `url(${config.iconPath})`,
                          maskSize: 'contain',
                          WebkitMaskSize: 'contain',
                          maskRepeat: 'no-repeat',
                          WebkitMaskRepeat: 'no-repeat',
                          maskPosition: 'center',
                          WebkitMaskPosition: 'center',
                          backgroundColor: config.color
                        }}
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-900 text-sm mb-0.5">
                      {config.label}
                    </div>
                    <div className="text-xs text-gray-500 line-clamp-1">
                      {config.description}
                    </div>
                  </div>
                  <div className="text-gray-300 group-hover:text-blue-500 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                </button>
              );
            })}
          </div>

          {filteredNodes.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <div className="text-sm">No nodes found</div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
