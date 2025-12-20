import { useState } from 'react';
import { getNodeConfig } from './nodes/nodeTypes';

interface NodeSelectorProps {
  onNodeSelect: (nodeType: string) => void;
  onClose: () => void;
  isVisible: boolean;
  hasTrigger: boolean;
}

const nodeCategories = {
  'Triggers': ['manual', 'webhook'],
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
        className={`fixed right-0 top-0 bottom-0 z-50 w-80 bg-gray-950 border-l border-gray-800 flex flex-col transition-transform duration-300 ${
          isVisible ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-medium text-white">Add Node</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors p-1"
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
            className="w-full px-3 py-2 bg-gray-900 border border-gray-800 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            autoFocus
          />
        </div>

        {!searchTerm && (
          <div className="flex border-b border-gray-800">
            {Object.keys(availableCategories).map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'text-blue-400 border-b-2 border-blue-400'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        )}

        
        <div className="flex-1 overflow-y-auto p-3">
          <div className="space-y-2">
            {filteredNodes.map((nodeType) => {
              const config = getNodeConfig(nodeType);
              return (
                <button
                  key={nodeType}
                  onClick={() => onNodeSelect(nodeType)}
                  className="w-full flex items-center p-3 rounded-lg bg-gray-900/50 border border-gray-800 hover:border-blue-500/50 hover:bg-gray-800 transition-all group text-left"
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-lg mr-3 group-hover:scale-110 transition-transform"
                    style={{ backgroundColor: `${config.color}20` }}
                  >
                    {config.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-white text-sm">
                      {config.label}
                    </div>
                    <div className="text-xs text-gray-500 line-clamp-1">
                      {config.description}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
          
          {filteredNodes.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <svg className="w-12 h-12 mx-auto mb-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
