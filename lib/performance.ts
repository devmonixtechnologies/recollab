import React, { useCallback, useRef, useEffect, useState } from 'react';

// Performance monitoring hook
export function usePerformanceMonitor(componentName: string) {
  const renderCount = useRef(0);
  const lastRenderTime = useRef(Date.now());

  useEffect(() => {
    renderCount.current += 1;
    const now = Date.now();
    const timeSinceLastRender = now - lastRenderTime.current;
    lastRenderTime.current = now;

    if (process.env.NODE_ENV === 'development') {
      console.log(
        `${componentName} rendered ${renderCount.current} times. ` +
        `Time since last render: ${timeSinceLastRender}ms`
      );
    }
  });

  return {
    renderCount: renderCount.current,
    lastRenderTime: lastRenderTime.current
  };
}

// Debounce hook for performance optimization
export function useDebounce<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const timeoutRef = useRef<NodeJS.Timeout>();

  const debouncedCallback = useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay]
  ) as T;

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [debouncedCallback]);

  return debouncedCallback;
}

// Throttle hook for performance optimization
export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const lastCallTime = useRef(0);

  const throttledCallback = useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();
      if (now - lastCallTime.current >= delay) {
        lastCallTime.current = now;
        callback(...args);
      }
    },
    [callback, delay]
  ) as T;

  return throttledCallback;
}

// Memoized component wrapper
export function memoComponent<T extends React.ComponentType<any>>(
  Component: T,
  areEqual?: (prevProps: any, nextProps: any) => boolean
): T {
  const MemoizedComponent = React.memo(Component, areEqual) as unknown as T;
  
  if (process.env.NODE_ENV === 'development') {
    const originalName = Component.displayName || Component.name || 'Component';
    MemoizedComponent.displayName = `memo(${originalName})`;
  }
  
  return MemoizedComponent;
}

// Virtual scroll hook for large lists
export function useVirtualScroll<T>({
  items,
  itemHeight,
  containerHeight,
  overscan = 5
}: {
  items: T[];
  itemHeight: number;
  containerHeight: number;
  overscan?: number;
}) {
  const [scrollTop, setScrollTop] = useState(0);

  const visibleStart = Math.floor(scrollTop / itemHeight);
  const visibleEnd = Math.min(
    visibleStart + Math.ceil(containerHeight / itemHeight),
    items.length - 1
  );

  const startIndex = Math.max(0, visibleStart - overscan);
  const endIndex = Math.min(items.length - 1, visibleEnd + overscan);

  const visibleItems = items.slice(startIndex, endIndex + 1).map((item, index) => ({
    item,
    index: startIndex + index,
    top: (startIndex + index) * itemHeight
  }));

  const totalHeight = items.length * itemHeight;

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  return {
    visibleItems,
    totalHeight,
    handleScroll
  };
}

// Lazy loading hook
export function useLazyLoad<T>(
  loadFn: () => Promise<T>,
  deps: React.DependencyList = []
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadData = async () => {
      setLoading(true);
      setError(null);

      try {
        const result = await loadFn();
        if (!cancelled) {
          setData(result);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err as Error);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      cancelled = true;
    };
  }, deps);

  return { data, loading, error };
}

// Performance metrics collector
export class PerformanceMetrics {
  private static metrics: Map<string, number[]> = new Map();

  static recordMetric(name: string, value: number) {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }
    this.metrics.get(name)!.push(value);
  }

  static getAverageMetric(name: string): number {
    const values = this.metrics.get(name) || [];
    return values.length > 0 ? values.reduce((a: number, b: number) => a + b, 0) / values.length : 0;
  }

  static getMetricsSummary() {
    const summary: Record<string, { avg: number; min: number; max: number; count: number }> = {};
    
    for (const [name, values] of Array.from(this.metrics.entries())) {
      if (values.length > 0) {
        summary[name] = {
          avg: values.reduce((a: number, b: number) => a + b, 0) / values.length,
          min: Math.min(...values),
          max: Math.max(...values),
          count: values.length
        };
      }
    }
    
    return summary;
  }

  static clearMetrics() {
    this.metrics.clear();
  }
}

// Performance decorator for functions
export function measurePerformance<T extends (...args: any[]) => any>(
  fn: T,
  metricName: string
): T {
  return ((...args: Parameters<T>) => {
    const start = performance.now();
    const result = fn(...args);
    const end = performance.now();
    
    PerformanceMetrics.recordMetric(metricName, end - start);
    
    return result;
  }) as T;
}
