interface AddNodeButtonProps {
  position: { x: number; y: number };
  onClick: () => void;
  isVisible: boolean;
}

export const AddNodeButton = ({ position, onClick, isVisible }: AddNodeButtonProps) => {
  if (!isVisible) return null;

  return (
    <div
      className="absolute z-30 pointer-events-none"
      style={{
        left: position.x - 15,
        top: position.y - 15,
      }}
    >
      <button
        onClick={onClick}
        className="w-8 h-8 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg border-2 border-white flex items-center justify-center transition-all hover:scale-110 pointer-events-auto group"
        title="Add node"
      >
        <svg 
          width="12" 
          height="12" 
          viewBox="0 0 12 12" 
          fill="none" 
          className="group-hover:scale-110 transition-transform"
        >
          <path 
            d="M6 2V10M2 6H10" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round"
          />
        </svg>
      </button>
    </div>
  );
};
