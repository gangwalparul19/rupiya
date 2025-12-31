/**
 * Performance Optimization Alerts Service
 * Monitors performance metrics and generates alerts for optimization opportunities
 */

export type AlertSeverity = 'critical' | 'warning' | 'info';

export interface PerformanceAlert {
  id: string;
  severity: AlertSeverity;
  title: string;
  message: string;
  metric: string;
  currentValue: number;
  threshold: number;
  recommendation: string;
  timestamp: number;
  resolved: boolean;
}

export interface PerformanceBudget {
  metric: string;
  budget: number;
  unit: string;
  description: string;
}

interface AlertThresholds {
  pageLoadTime: number;
  domContentLoaded: number;
  apiResponseTime: number;
  longTaskDuration: number;
  resourceSize: number;
}

class PerformanceAlertManager {
  private alerts: Map<string, PerformanceAlert> = new Map();
  private thresholds: AlertThresholds = {
    pageLoadTime: 3000, // 3 seconds
    domContentLoaded: 2000, // 2 seconds
    apiResponseTime: 1000, // 1 second
    longTaskDuration: 50, // 50ms
    resourceSize: 1024 * 1024, // 1MB
  };
  private performanceBudgets: PerformanceBudget[] = [
    {
      metric: 'pageLoadTime',
      budget: 3000,
      unit: 'ms',
      description: 'Page should load within 3 seconds',
    },
    {
      metric: 'domContentLoaded',
      budget: 2000,
      unit: 'ms',
      description: 'DOM should be ready within 2 seconds',
    },
    {
      metric: 'apiResponseTime',
      budget: 1000,
      unit: 'ms',
      description: 'API calls should respond within 1 second',
    },
    {
      metric: 'bundleSize',
      budget: 500 * 1024,
      unit: 'bytes',
      description: 'Bundle size should be under 500KB',
    },
  ];

  /**
   * Check page load time and create alert if needed
   */
  checkPageLoadTime(pageLoadTime: number): PerformanceAlert | null {
    if (pageLoadTime > this.thresholds.pageLoadTime) {
      return this.createAlert(
        'slow_page_load',
        'critical',
        'Slow Page Load Detected',
        `Page load time is ${pageLoadTime}ms, exceeding the ${this.thresholds.pageLoadTime}ms threshold`,
        'pageLoadTime',
        pageLoadTime,
        this.thresholds.pageLoadTime,
        'Optimize images, reduce JavaScript, enable caching, and use CDN'
      );
    }
    return null;
  }

  /**
   * Check DOM content loaded time
   */
  checkDomContentLoaded(domContentLoaded: number): PerformanceAlert | null {
    if (domContentLoaded > this.thresholds.domContentLoaded) {
      return this.createAlert(
        'slow_dom_content_loaded',
        'warning',
        'Slow DOM Content Loaded',
        `DOM content loaded time is ${domContentLoaded}ms, exceeding the ${this.thresholds.domContentLoaded}ms threshold`,
        'domContentLoaded',
        domContentLoaded,
        this.thresholds.domContentLoaded,
        'Defer non-critical JavaScript, optimize CSS, and reduce render-blocking resources'
      );
    }
    return null;
  }

  /**
   * Check API response time
   */
  checkApiResponseTime(endpoint: string, responseTime: number): PerformanceAlert | null {
    if (responseTime > this.thresholds.apiResponseTime) {
      return this.createAlert(
        `slow_api_${endpoint}`,
        'warning',
        'Slow API Response',
        `API endpoint ${endpoint} responded in ${responseTime}ms, exceeding the ${this.thresholds.apiResponseTime}ms threshold`,
        'apiResponseTime',
        responseTime,
        this.thresholds.apiResponseTime,
        'Optimize database queries, add caching, implement pagination, or scale backend resources'
      );
    }
    return null;
  }

  /**
   * Check for long tasks
   */
  checkLongTask(taskName: string, duration: number): PerformanceAlert | null {
    if (duration > this.thresholds.longTaskDuration) {
      return this.createAlert(
        `long_task_${taskName}`,
        'warning',
        'Long Task Detected',
        `Task "${taskName}" took ${duration}ms, exceeding the ${this.thresholds.longTaskDuration}ms threshold`,
        'longTask',
        duration,
        this.thresholds.longTaskDuration,
        'Break long tasks into smaller chunks, use Web Workers, or defer non-critical work'
      );
    }
    return null;
  }

  /**
   * Check resource size
   */
  checkResourceSize(resourceName: string, size: number): PerformanceAlert | null {
    if (size > this.thresholds.resourceSize) {
      return this.createAlert(
        `large_resource_${resourceName}`,
        'info',
        'Large Resource Detected',
        `Resource "${resourceName}" is ${(size / 1024 / 1024).toFixed(2)}MB, exceeding the ${this.thresholds.resourceSize / 1024 / 1024}MB threshold`,
        'resourceSize',
        size,
        this.thresholds.resourceSize,
        'Compress images, minify code, use lazy loading, or split into smaller chunks'
      );
    }
    return null;
  }

  /**
   * Create a performance alert
   */
  private createAlert(
    id: string,
    severity: AlertSeverity,
    title: string,
    message: string,
    metric: string,
    currentValue: number,
    threshold: number,
    recommendation: string
  ): PerformanceAlert {
    const alert: PerformanceAlert = {
      id,
      severity,
      title,
      message,
      metric,
      currentValue,
      threshold,
      recommendation,
      timestamp: Date.now(),
      resolved: false,
    };

    this.alerts.set(id, alert);
    return alert;
  }

  /**
   * Get all active alerts
   */
  getActiveAlerts(): PerformanceAlert[] {
    return Array.from(this.alerts.values()).filter((alert) => !alert.resolved);
  }

  /**
   * Get alerts by severity
   */
  getAlertsBySeverity(severity: AlertSeverity): PerformanceAlert[] {
    return this.getActiveAlerts().filter((alert) => alert.severity === severity);
  }

  /**
   * Resolve an alert
   */
  resolveAlert(alertId: string): boolean {
    const alert = this.alerts.get(alertId);
    if (alert) {
      alert.resolved = true;
      return true;
    }
    return false;
  }

  /**
   * Get performance budget status
   */
  getPerformanceBudgetStatus(metrics: Record<string, number>): Array<{
    budget: PerformanceBudget;
    status: 'ok' | 'warning' | 'exceeded';
    percentage: number;
  }> {
    return this.performanceBudgets.map((budget) => {
      const currentValue = metrics[budget.metric] || 0;
      const percentage = (currentValue / budget.budget) * 100;

      let status: 'ok' | 'warning' | 'exceeded' = 'ok';
      if (percentage > 100) {
        status = 'exceeded';
      } else if (percentage > 80) {
        status = 'warning';
      }

      return { budget, status, percentage };
    });
  }

  /**
   * Set custom threshold
   */
  setThreshold(metric: keyof AlertThresholds, value: number): void {
    this.thresholds[metric] = value;
  }

  /**
   * Get all thresholds
   */
  getThresholds(): AlertThresholds {
    return { ...this.thresholds };
  }

  /**
   * Get alert statistics
   */
  getAlertStatistics() {
    const allAlerts = Array.from(this.alerts.values());
    const activeAlerts = allAlerts.filter((a) => !a.resolved);

    return {
      totalAlerts: allAlerts.length,
      activeAlerts: activeAlerts.length,
      resolvedAlerts: allAlerts.filter((a) => a.resolved).length,
      criticalAlerts: activeAlerts.filter((a) => a.severity === 'critical').length,
      warningAlerts: activeAlerts.filter((a) => a.severity === 'warning').length,
      infoAlerts: activeAlerts.filter((a) => a.severity === 'info').length,
    };
  }

  /**
   * Get optimization recommendations
   */
  getOptimizationRecommendations(): string[] {
    const recommendations = new Set<string>();

    this.getActiveAlerts().forEach((alert) => {
      recommendations.add(alert.recommendation);
    });

    return Array.from(recommendations);
  }

  /**
   * Clear all alerts
   */
  clearAlerts(): void {
    this.alerts.clear();
  }

  /**
   * Export alerts as JSON
   */
  exportAlertsAsJson(): string {
    return JSON.stringify(
      {
        alerts: Array.from(this.alerts.values()),
        statistics: this.getAlertStatistics(),
        thresholds: this.thresholds,
      },
      null,
      2
    );
  }
}

// Create singleton instance
export const performanceAlertManager = new PerformanceAlertManager();

// Export functions
export const checkPageLoadTime = (pageLoadTime: number) => {
  return performanceAlertManager.checkPageLoadTime(pageLoadTime);
};

export const checkDomContentLoaded = (domContentLoaded: number) => {
  return performanceAlertManager.checkDomContentLoaded(domContentLoaded);
};

export const checkApiResponseTime = (endpoint: string, responseTime: number) => {
  return performanceAlertManager.checkApiResponseTime(endpoint, responseTime);
};

export const checkLongTask = (taskName: string, duration: number) => {
  return performanceAlertManager.checkLongTask(taskName, duration);
};

export const checkResourceSize = (resourceName: string, size: number) => {
  return performanceAlertManager.checkResourceSize(resourceName, size);
};

export const getActiveAlerts = () => {
  return performanceAlertManager.getActiveAlerts();
};

export const getAlertsBySeverity = (severity: AlertSeverity) => {
  return performanceAlertManager.getAlertsBySeverity(severity);
};

export const resolveAlert = (alertId: string) => {
  return performanceAlertManager.resolveAlert(alertId);
};

export const getPerformanceBudgetStatus = (metrics: Record<string, number>) => {
  return performanceAlertManager.getPerformanceBudgetStatus(metrics);
};

export const setThreshold = (metric: keyof AlertThresholds, value: number) => {
  performanceAlertManager.setThreshold(metric, value);
};

export const getThresholds = () => {
  return performanceAlertManager.getThresholds();
};

export const getAlertStatistics = () => {
  return performanceAlertManager.getAlertStatistics();
};

export const getOptimizationRecommendations = () => {
  return performanceAlertManager.getOptimizationRecommendations();
};

export const clearPerformanceAlerts = () => {
  performanceAlertManager.clearAlerts();
};

export const exportAlertsAsJson = () => {
  return performanceAlertManager.exportAlertsAsJson();
};
