/**
 * Advanced Analytics Service
 * Provides cohort analysis, funnel analysis, user segmentation, and retention analysis
 */

interface UserCohort {
  cohortId: string;
  startDate: Date;
  users: string[];
  size: number;
  retentionRate: number;
}

interface FunnelStep {
  stepName: string;
  stepNumber: number;
  userCount: number;
  conversionRate: number;
}

interface UserSegment {
  segmentId: string;
  segmentName: string;
  criteria: Record<string, any>;
  users: string[];
  size: number;
  properties: Record<string, any>;
}

interface RetentionData {
  cohortDate: string;
  day0: number;
  day1: number;
  day7: number;
  day30: number;
  day90: number;
}

interface AnalyticsEvent {
  userId: string;
  eventName: string;
  timestamp: number;
  properties: Record<string, any>;
}

class AdvancedAnalytics {
  private events: AnalyticsEvent[] = [];
  private cohorts: Map<string, UserCohort> = new Map();
  private segments: Map<string, UserSegment> = new Map();

  /**
   * Record an analytics event
   */
  recordEvent(userId: string, eventName: string, properties?: Record<string, any>) {
    this.events.push({
      userId,
      eventName,
      timestamp: Date.now(),
      properties: properties || {},
    });
  }

  /**
   * Cohort Analysis - Group users by signup date
   */
  createCohort(startDate: Date, endDate: Date): UserCohort {
    const cohortId = `cohort_${Date.now()}`;
    const users = this.getUsersSignedUpBetween(startDate, endDate);

    const cohort: UserCohort = {
      cohortId,
      startDate,
      users,
      size: users.length,
      retentionRate: this.calculateRetentionRate(users),
    };

    this.cohorts.set(cohortId, cohort);
    return cohort;
  }

  /**
   * Get cohort retention over time
   */
  getCohortRetention(cohortId: string, days: number[] = [0, 1, 7, 30, 90]): RetentionData {
    const cohort = this.cohorts.get(cohortId);
    if (!cohort) throw new Error('Cohort not found');

    const retentionData: RetentionData = {
      cohortDate: cohort.startDate.toISOString(),
      day0: cohort.size,
      day1: 0,
      day7: 0,
      day30: 0,
      day90: 0,
    };

    const cohortStartTime = cohort.startDate.getTime();

    for (const day of days) {
      const dayTime = day * 24 * 60 * 60 * 1000;
      const activeUsers = cohort.users.filter((userId) => {
        const userEvents = this.events.filter((e) => e.userId === userId);
        return userEvents.some((e) => e.timestamp >= cohortStartTime + dayTime);
      });

      if (day === 0) retentionData.day0 = activeUsers.length;
      else if (day === 1) retentionData.day1 = activeUsers.length;
      else if (day === 7) retentionData.day7 = activeUsers.length;
      else if (day === 30) retentionData.day30 = activeUsers.length;
      else if (day === 90) retentionData.day90 = activeUsers.length;
    }

    return retentionData;
  }

  /**
   * Funnel Analysis - Track user progression through steps
   */
  analyzeFunnel(steps: string[]): FunnelStep[] {
    const funnelSteps: FunnelStep[] = [];
    let previousStepUsers = new Set<string>();

    for (let i = 0; i < steps.length; i++) {
      const stepName = steps[i];
      const stepUsers = new Set<string>();

      this.events.forEach((event) => {
        if (event.eventName === stepName) {
          stepUsers.add(event.userId);
        }
      });

      const conversionRate =
        i === 0 ? 100 : (stepUsers.size / previousStepUsers.size) * 100;

      funnelSteps.push({
        stepName,
        stepNumber: i + 1,
        userCount: stepUsers.size,
        conversionRate: Math.round(conversionRate * 100) / 100,
      });

      previousStepUsers = stepUsers;
    }

    return funnelSteps;
  }

  /**
   * User Segmentation - Group users by criteria
   */
  createSegment(
    segmentName: string,
    criteria: (userId: string) => boolean,
    properties?: Record<string, any>
  ): UserSegment {
    const segmentId = `segment_${Date.now()}`;
    const allUsers = [...new Set(this.events.map((e) => e.userId))];
    const users = allUsers.filter(criteria);

    const segment: UserSegment = {
      segmentId,
      segmentName,
      criteria: { description: 'Custom criteria function' },
      users,
      size: users.length,
      properties: properties || {},
    };

    this.segments.set(segmentId, segment);
    return segment;
  }

  /**
   * Get segment properties
   */
  getSegmentProperties(segmentId: string): Record<string, any> {
    const segment = this.segments.get(segmentId);
    if (!segment) throw new Error('Segment not found');

    const properties: Record<string, any> = {
      segmentName: segment.segmentName,
      size: segment.size,
      users: segment.users.length,
      averageEventsPerUser: 0,
      topEvents: [],
      engagementScore: 0,
    };

    // Calculate average events per user
    let totalEvents = 0;
    const eventCounts: Record<string, number> = {};

    segment.users.forEach((userId) => {
      const userEvents = this.events.filter((e) => e.userId === userId);
      totalEvents += userEvents.length;

      userEvents.forEach((event) => {
        eventCounts[event.eventName] = (eventCounts[event.eventName] || 0) + 1;
      });
    });

    properties.averageEventsPerUser = Math.round((totalEvents / segment.size) * 100) / 100;
    properties.topEvents = Object.entries(eventCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([event, count]) => ({ event, count }));

    // Calculate engagement score (0-100)
    properties.engagementScore = Math.min(
      100,
      Math.round((properties.averageEventsPerUser / 10) * 100)
    );

    return properties;
  }

  /**
   * Retention Analysis - Calculate user retention rates
   */
  calculateRetentionRate(users: string[]): number {
    if (users.length === 0) return 0;

    const now = Date.now();
    const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;

    const activeUsers = users.filter((userId) => {
      const userEvents = this.events.filter((e) => e.userId === userId);
      return userEvents.some((e) => e.timestamp >= sevenDaysAgo);
    });

    return Math.round((activeUsers.length / users.length) * 100);
  }

  /**
   * Get users signed up between dates
   */
  private getUsersSignedUpBetween(startDate: Date, endDate: Date): string[] {
    const startTime = startDate.getTime();
    const endTime = endDate.getTime();

    const signupEvents = this.events.filter(
      (e) => e.eventName === 'user_signup' && e.timestamp >= startTime && e.timestamp <= endTime
    );

    return [...new Set(signupEvents.map((e) => e.userId))];
  }

  /**
   * Get all cohorts
   */
  getAllCohorts(): UserCohort[] {
    return Array.from(this.cohorts.values());
  }

  /**
   * Get all segments
   */
  getAllSegments(): UserSegment[] {
    return Array.from(this.segments.values());
  }

  /**
   * Get event distribution
   */
  getEventDistribution(): Record<string, number> {
    const distribution: Record<string, number> = {};

    this.events.forEach((event) => {
      distribution[event.eventName] = (distribution[event.eventName] || 0) + 1;
    });

    return distribution;
  }

  /**
   * Get user journey
   */
  getUserJourney(userId: string): AnalyticsEvent[] {
    return this.events
      .filter((e) => e.userId === userId)
      .sort((a, b) => a.timestamp - b.timestamp);
  }

  /**
   * Get top users by activity
   */
  getTopUsersByActivity(limit: number = 10): Array<{ userId: string; eventCount: number }> {
    const userActivity: Record<string, number> = {};

    this.events.forEach((event) => {
      userActivity[event.userId] = (userActivity[event.userId] || 0) + 1;
    });

    return Object.entries(userActivity)
      .map(([userId, eventCount]) => ({ userId, eventCount }))
      .sort((a, b) => b.eventCount - a.eventCount)
      .slice(0, limit);
  }

  /**
   * Get feature adoption rate
   */
  getFeatureAdoptionRate(featureName: string): number {
    const totalUsers = new Set(this.events.map((e) => e.userId)).size;
    const featureUsers = new Set(
      this.events.filter((e) => e.eventName === featureName).map((e) => e.userId)
    ).size;

    if (totalUsers === 0) return 0;
    return Math.round((featureUsers / totalUsers) * 100);
  }

  /**
   * Get feature usage frequency
   */
  getFeatureUsageFrequency(featureName: string): Record<string, number> {
    const frequency: Record<string, number> = {};
    const featureEvents = this.events.filter((e) => e.eventName === featureName);

    featureEvents.forEach((event) => {
      const date = new Date(event.timestamp).toISOString().split('T')[0];
      frequency[date] = (frequency[date] || 0) + 1;
    });

    return frequency;
  }

  /**
   * Clear all data
   */
  clearData() {
    this.events = [];
    this.cohorts.clear();
    this.segments.clear();
  }
}

// Create singleton instance
export const advancedAnalytics = new AdvancedAnalytics();

// Export functions
export const recordEvent = (userId: string, eventName: string, properties?: Record<string, any>) => {
  advancedAnalytics.recordEvent(userId, eventName, properties);
};

export const createCohort = (startDate: Date, endDate: Date) => {
  return advancedAnalytics.createCohort(startDate, endDate);
};

export const getCohortRetention = (cohortId: string, days?: number[]) => {
  return advancedAnalytics.getCohortRetention(cohortId, days);
};

export const analyzeFunnel = (steps: string[]) => {
  return advancedAnalytics.analyzeFunnel(steps);
};

export const createSegment = (
  segmentName: string,
  criteria: (userId: string) => boolean,
  properties?: Record<string, any>
) => {
  return advancedAnalytics.createSegment(segmentName, criteria, properties);
};

export const getSegmentProperties = (segmentId: string) => {
  return advancedAnalytics.getSegmentProperties(segmentId);
};

export const calculateRetentionRate = (users: string[]) => {
  return advancedAnalytics.calculateRetentionRate(users);
};

export const getAllCohorts = () => {
  return advancedAnalytics.getAllCohorts();
};

export const getAllSegments = () => {
  return advancedAnalytics.getAllSegments();
};

export const getEventDistribution = () => {
  return advancedAnalytics.getEventDistribution();
};

export const getUserJourney = (userId: string) => {
  return advancedAnalytics.getUserJourney(userId);
};

export const getTopUsersByActivity = (limit?: number) => {
  return advancedAnalytics.getTopUsersByActivity(limit);
};

export const getFeatureAdoptionRate = (featureName: string) => {
  return advancedAnalytics.getFeatureAdoptionRate(featureName);
};

export const getFeatureUsageFrequency = (featureName: string) => {
  return advancedAnalytics.getFeatureUsageFrequency(featureName);
};

export const clearAnalyticsData = () => {
  advancedAnalytics.clearData();
};
