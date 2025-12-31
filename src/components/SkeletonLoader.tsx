'use client';

/**
 * Props for the SkeletonLoader component
 */
interface SkeletonLoaderProps {
  /** Number of skeleton items to display */
  count?: number;
  /** Type of skeleton to display */
  type?: 'card' | 'list' | 'table' | 'text' | 'avatar';
  /** Whether to show animation */
  animated?: boolean;
  /** Custom className for the container */
  className?: string;
}

/**
 * Reusable skeleton loader component for better perceived performance
 * Shows placeholder UI while data is loading
 * 
 * @example
 * ```tsx
 * <SkeletonLoader type="card" count={3} />
 * ```
 */
export default function SkeletonLoader({
  count = 1,
  type = 'card',
  animated = true,
  className = '',
}: SkeletonLoaderProps) {
  const animationClass = animated ? 'animate-pulse' : '';

  const renderSkeleton = () => {
    switch (type) {
      case 'card':
        return (
          <div className={`bg-gray-800 rounded-lg p-4 md:p-6 border border-gray-700 ${animationClass}`}>
            <div className="space-y-4">
              <div className="h-6 bg-gray-700 rounded w-3/4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-700 rounded"></div>
                <div className="h-4 bg-gray-700 rounded w-5/6"></div>
              </div>
              <div className="flex gap-2 pt-4">
                <div className="h-10 bg-gray-700 rounded flex-1"></div>
                <div className="h-10 bg-gray-700 rounded flex-1"></div>
              </div>
            </div>
          </div>
        );

      case 'list':
        return (
          <div className={`bg-gray-800 rounded-lg p-4 md:p-6 border border-gray-700 ${animationClass}`}>
            <div className="space-y-3">
              <div className="flex gap-4">
                <div className="h-12 w-12 bg-gray-700 rounded-full flex-shrink-0"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-700 rounded w-1/3"></div>
                  <div className="h-3 bg-gray-700 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'table':
        return (
          <div className={`bg-gray-800 rounded-lg overflow-hidden border border-gray-700 ${animationClass}`}>
            <div className="p-4 md:p-6 space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-4">
                  <div className="h-4 bg-gray-700 rounded flex-1"></div>
                  <div className="h-4 bg-gray-700 rounded flex-1"></div>
                  <div className="h-4 bg-gray-700 rounded flex-1"></div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'text':
        return (
          <div className={`space-y-3 ${animationClass}`}>
            <div className="h-4 bg-gray-700 rounded"></div>
            <div className="h-4 bg-gray-700 rounded w-5/6"></div>
            <div className="h-4 bg-gray-700 rounded w-4/6"></div>
          </div>
        );

      case 'avatar':
        return (
          <div className={`flex items-center gap-4 ${animationClass}`}>
            <div className="h-12 w-12 bg-gray-700 rounded-full flex-shrink-0"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-700 rounded w-1/3"></div>
              <div className="h-3 bg-gray-700 rounded w-1/4"></div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={className}>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className={index > 0 ? 'mt-4' : ''}>
          {renderSkeleton()}
        </div>
      ))}
    </div>
  );
}
