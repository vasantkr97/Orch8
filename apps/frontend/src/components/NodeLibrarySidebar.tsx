import { useState } from 'react';
import { getNodeConfig } from './nodes/nodeConfig';

interface NodeLibrarySidebarProps {
    onNodeSelect: (nodeType: string) => void;
}

export const NodeLibrarySidebar = ({ onNodeSelect }: NodeLibrarySidebarProps) => {
    const [searchTerm, setSearchTerm] = useState('');

    const groups = [
        {
            title: 'TRIGGERS',
            items: ['manual', 'webhook']
        },
        {
            title: 'ACTIONS',
            items: ['gemini', 'telegram', 'resendemail']
        }
    ];



    return (
        <div className="absolute right-4 top-4 bottom-4 w-[280px] flex flex-col gap-2 pointer-events-none z-50">
            {/* Search Panel */}
            <div className="bg-[#e9eeea] rounded-lg border border-gray-200 p-1.5 pointer-events-auto shrink-0">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-9 pr-4 py-1.5 bg-transparent border-none text-sm text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-0 transition-all font-medium"
                        placeholder="Search nodes..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        autoFocus
                    />
                </div>
            </div>

            {/* Node List Panel */}
            <div className="flex-1 !bg-[#e9eeea] rounded-xl border border-gray-200 overflow-hidden pointer-events-auto flex flex-col">
                <div className="px-6 pt-6 pb-2">
                    <h2 className="text-xl font-bold text-gray-900 tracking-tight">
                        Library
                    </h2>
                </div>
                <div
                    className="flex-1 overflow-y-auto px-4 py-4 space-y-6 no-scrollbar"
                >
                    {groups.map((group) => {
                        // Filter items based on search
                        const filteredItems = group.items.filter(type => {
                            if (!searchTerm) return true;
                            const config = getNodeConfig(type);
                            return config.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                config.description.toLowerCase().includes(searchTerm.toLowerCase());
                        });

                        if (filteredItems.length === 0) return null;

                        return (
                            <div key={group.title}>
                                <h4 className="text-[10px] font-bold text-gray-400 tracking-wider mb-3 px-3 uppercase">{group.title}</h4>
                                <div className="space-y-3">
                                    {filteredItems.map(nodeType => {
                                        const config = getNodeConfig(nodeType);
                                        return (
                                            <button
                                                key={nodeType}
                                                onClick={() => onNodeSelect(nodeType)}
                                                className="w-full flex items-start gap-4 p-3 rounded-xl hover:bg-white hover:shadow-lg hover:scale-[1.02] transition-all duration-200 group text-left border border-transparent hover:border-gray-100"
                                            >
                                                <div
                                                    className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-transform group-hover:rotate-12"
                                                    style={{ backgroundColor: `${config.color}15` }}
                                                >
                                                    {nodeType === 'gemini' ? (
                                                        <img src={config.iconPath} alt={config.label} className="w-6 h-6" />
                                                    ) : (
                                                        <div
                                                            className="w-5 h-5"
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
                                                <div>
                                                    <div className="font-semibold text-gray-900 text-sm mb-0.5">{config.label}</div>
                                                    <div className="text-xs text-gray-500 leading-relaxed font-medium">{config.description}</div>
                                                </div>
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>
                        );
                    })}

                    {searchTerm && groups.every(g => g.items.every(type => {
                        const config = getNodeConfig(type);
                        return !config.label.toLowerCase().includes(searchTerm.toLowerCase()) &&
                            !config.description.toLowerCase().includes(searchTerm.toLowerCase());
                    })) && (
                            <div className="text-center py-8 text-gray-400 text-sm">
                                No matching nodes found.
                            </div>
                        )}
                </div>
            </div>
        </div>
    );
};
