import React from 'react';

export interface SkeletonLoaderProps {
  variant?: 'text' | 'circular' | 'rectangular' | 'card';
  width?: string;
  height?: string;
  className?: string;
  count?: number;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  variant = 'text',
  width,
  height,
  className = '',
  count = 1,
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'circular':
        return 'rounded-full';
      case 'rectangular':
        return 'rounded-lg';
      case 'card':
        return 'rounded-xl';
      case 'text':
      default:
        return 'rounded';
    }
  };

  const getDefaultSize = () => {
    switch (variant) {
      case 'circular':
        return { width: width || '40px', height: height || '40px' };
      case 'card':
        return { width: width || '100%', height: height || '200px' };
      case 'rectangular':
        return { width: width || '100%', height: height || '100px' };
      case 'text':
      default:
        return { width: width || '100%', height: height || '16px' };
    }
  };

  const size = getDefaultSize();

  const skeleton = (
    <div
      className={`skeleton ${getVariantClasses()} ${className}`}
      style={{ width: size.width, height: size.height }}
    />
  );

  if (count > 1) {
    return (
      <div className="space-y-3">
        {Array.from({ length: count }).map((_, index) => (
          <div key={index}>{skeleton}</div>
        ))}
      </div>
    );
  }

  return skeleton;
};

// Card Skeleton Component
export const CardSkeleton: React.FC = () => {
  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 space-y-3">
          <SkeletonLoader variant="text" width="60%" height="24px" />
          <SkeletonLoader variant="text" width="40%" />
        </div>
        <SkeletonLoader variant="circular" width="48px" height="48px" />
      </div>
      <div className="space-y-2 mb-4">
        <SkeletonLoader variant="text" width="80%" />
        <SkeletonLoader variant="text" width="90%" />
        <SkeletonLoader variant="text" width="70%" />
      </div>
      <div className="flex gap-2 pt-4 border-t border-gray-700">
        <SkeletonLoader variant="rectangular" width="100px" height="36px" />
        <SkeletonLoader variant="rectangular" width="100px" height="36px" />
      </div>
    </div>
  );
};

// Table Row Skeleton Component
export const TableRowSkeleton: React.FC<{ columns?: number }> = ({ columns = 5 }) => {
  return (
    <tr className="border-b border-gray-700">
      {Array.from({ length: columns }).map((_, index) => (
        <td key={index} className="px-6 py-4">
          <SkeletonLoader variant="text" />
        </td>
      ))}
    </tr>
  );
};


