/**
 * Performance Monitoring Service
 * Tracks application performance metrics
 * Monitors page load times, API response times, and resource usage
 */

interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  timestamp: number;
}

interface PageLoadMetrics {
  domContentLoaded: number;
  pageLoadTime: number;
  firstPaint: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
}

interface ApiMetric {
  endpoint: string;
  method: string;
  duration: number;
  status: number;
  timestamp: number;
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private apiMetrics: ApiMetric[] = [];
  private sessionStartTime: number = Date.now();
  private pageLoadMetrics: PageLoadMetrics | null = null;

  constructor() {
    this.initializePerformanceObserver();
    this.capturePageLoadMetrics();
  }

  /**
   * Initialize Performance Observer for Web Vitals
   */
  private initializePerformanceObserver() {
    if (typeof window === 'undefined') return;

    try {
      // Observe Long Tasks
      if ('PerformanceObserver' in window) {
        try {
          const longTaskObserver = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              this.recordMetric('long_task', entry.duration, 'ms');
            }
          });
          longTaskObserver.observe({ entryTypes: ['longtask'] });
        } catch (e) {
          console.debug('Long task observer not supported');
        }

        // Observe Resource Timing
        try {
          const resourceObserver = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              if (entry.name.includes('api') || entry.name.includes('firestore')) {
                this.recordMetric(
                  `resource_${entry.name.split('/').pop()}`,
                  entry.duration,
                  'ms'
                );
              }
            }
          });
          resourceObserver.observe({ entryTypes: ['resource'] });
        } catch (e) {
          console.debug('Resource observer not supported');
        }
      }
    } catch (error) {
      console.error('Failed to initialize performance observer:', error);
    }
  }

  /**
   * Capture page load metrics
   */
  private capturePageLoadMetrics() {
    if (typeof window === 'undefined') return;

    window.addEventListener('load', () => {
      setTimeout(() => {
        try {
          const perfData = window.performance.timing;
          const perfEntries = window.performance.getEntriesByType('navigation')[0] as any;

          this.pageLoadMetrics = {
            domContentLoaded: perfData.domContentLoadedEventEnd - perfData.navigationStart,
            pageLoadTime: perfData.loadEventEnd - perfData.navigationStart,
            firstPaint: 0,
            firstContentfulPaint: 0,
            largestContentfulPaint: 0,
          };

          // Get Web Vitals
          if (perfEntries) {
            this.pageLoadMetrics.firstPaint = perfEntries.responseEnd - perfEntries.fetchStart;
          }

          // Record metrics
          this.recordMetric('dom_content_loaded', this.pageLoadMetrics.domContentLoaded, 'ms');
          this.recordMetric('page_load_time', this.pageLoadMetrics.pageLoadTime, 'ms');
        } catch (error) {
          console.error('Failed to capture page load metrics:', error);
        }
      }, 0);
    });
  }

  /**
   * Record a performance metric
   */
  recordMetric(name: string, value: number, unit: string = 'ms') {
    this.metrics.push({
      name,
      value,
      unit,
      timestamp: Date.now(),
    });

    // Log slow metrics
    if (value > 3000) {
      console.warn(`Slow metric detected: ${name} = ${value}${unit}`);
    }
  }

  /**
   * Record API call metrics
   */
  recordApiMetric(endpoint: string, method: string, duration: number, status: number) {
    this.apiMetrics.push({
      endpoint,
      method,
      duration,
      status,
      timestamp: Date.now(),
    });

    // Log slow API calls
    if (duration > 2000) {
      console.warn(`Slow API call: ${method} ${endpoint} = ${duration}ms`);
    }
  }

  /**
   * Measure function execution time
   */
  async measureAsync<T>(
    functionName: string,
    fn: () => Promise<T>
  ): Promise<T> {
    const startTime = performance.now();
    try {
      const result = await fn();
      const duration = performance.now() - startTime;
      this.recordMetric(`async_${functionName}`, duration, 'ms');
      return result;
    } catch (error) {
      const duration = performance.now() - startTime;
      this.recordMetric(`async_${functionName}_error`, duration, 'ms');
      throw error;
    }
  }

  /**
   * Measure synchronous function execution time
   */
  measureSync<T>(functionName: string, fn: () => T): T {
    const startTime = performance.now();
    try {
      const result = fn();
      const duration = performance.now() - startTime;
      this.recordMetric(`sync_${functionName}`, duration, 'ms');
      return result;
    } catch (error) {
      const duration = performance.now() - startTime;
      this.recordMetric(`sync_${functionName}_error`, duration, 'ms');
      throw error;
    }
  }

  /**
   * Get average metric value
   */
  getAverageMetric(metricName: string): number {
    const relevantMetrics = this.metrics.filter((m) => m.name === metricName);
    if (relevantMetrics.length === 0) return 0;

    const sum = relevantMetrics.reduce((acc, m) => acc + m.value, 0);
    return sum / relevantMetrics.length;
  }

  /**
   * Get average API response time
   */
  getAverageApiResponseTime(endpoint?: string): number {
    let relevantMetrics = this.apiMetrics;
    if (endpoint) {
      relevantMetrics = relevantMetrics.filter((m) => m.endpoint === endpoint);
    }

    if (relevantMetrics.length === 0) return 0;

    const sum = relevantMetrics.reduce((acc, m) => acc + m.duration, 0);
    return sum / relevantMetrics.length;
  }

  /**
   * Get slowest API calls
   */
  getSlowestApiCalls(limit: number = 10): ApiMetric[] {
    return [...this.apiMetrics].sort((a, b) => b.duration - a.duration).slice(0, limit);
  }

  /**
   * Get performance summary
   */
  getPerformanceSummary() {
    return {
      pageLoadMetrics: this.pageLoadMetrics,
      totalMetrics: this.metrics.length,
      totalApiCalls: this.apiMetrics.length,
      averagePageLoadTime: this.getAverageMetric('page_load_time'),
      averageDomContentLoaded: this.getAverageMetric('dom_content_loaded'),
      averageApiResponseTime: this.getAverageApiResponseTime(),
      slowestApiCalls: this.getSlowestApiCalls(5),
      sessionDuration: Date.now() - this.sessionStartTime,
    };
  }

  /**
   * Get all metrics
   */
  getAllMetrics() {
    return {
      metrics: this.metrics,
      apiMetrics: this.apiMetrics,
    };
  }

  /**
   * Clear metrics
   */
  clearMetrics() {
    this.metrics = [];
    this.apiMetrics = [];
  }

  /**
   * Export metrics as JSON
   */
  exportMetricsAsJson() {
    return JSON.stringify(this.getPerformanceSummary(), null, 2);
  }

  /**
   * Export metrics as CSV
   */
  exportMetricsAsCsv() {
    let csv = 'Metric Name,Value,Unit,Timestamp\n';

    this.metrics.forEach((metric) => {
      csv += `${metric.name},${metric.value},${metric.unit},${new Date(metric.timestamp).toISOString()}\n`;
    });

    csv += '\nAPI Metrics\n';
    csv += 'Endpoint,Method,Duration (ms),Status,Timestamp\n';

    this.apiMetrics.forEach((metric) => {
      csv += `${metric.endpoint},${metric.method},${metric.duration},${metric.status},${new Date(metric.timestamp).toISOString()}\n`;
    });

    return csv;
  }
}

// Create singleton instance
export const performanceMonitor = new PerformanceMonitor();

// Export functions
export const recordMetric = (name: string, value: number, unit?: string) => {
  performanceMonitor.recordMetric(name, value, unit);
};

export const recordApiMetric = (endpoint: string, method: string, duration: number, status: number) => {
  performanceMonitor.recordApiMetric(endpoint, method, duration, status);
};

export const measureAsync = <T,>(functionName: string, fn: () => Promise<T>) => {
  return performanceMonitor.measureAsync(functionName, fn);
};

export const measureSync = <T,>(functionName: string, fn: () => T) => {
  return performanceMonitor.measureSync(functionName, fn);
};

export const getPerformanceSummary = () => {
  return performanceMonitor.getPerformanceSummary();
};

export const getAllMetrics = () => {
  return performanceMonitor.getAllMetrics();
};

export const clearMetrics = () => {
  performanceMonitor.clearMetrics();
};

export const exportMetricsAsJson = () => {
  return performanceMonitor.exportMetricsAsJson();
};

export const exportMetricsAsCsv = () => {
  return performanceMonitor.exportMetricsAsCsv();
};
