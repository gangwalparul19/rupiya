# API Reference Documentation

**Date**: December 30, 2025  
**Status**: ✅ COMPLETE  
**Version**: 1.0

---

## Overview

This document provides comprehensive API reference for all services in the Rupiya application. It includes method signatures, parameters, return types, and usage examples.

---

## 📚 Table of Contents

1. [Firebase Authentication Service](#firebase-authentication-service)
2. [Firebase Database Service](#firebase-database-service)
3. [Analytics Service](#analytics-service)
4. [Performance Monitoring Service](#performance-monitoring-service)
5. [Advanced Analytics Service](#advanced-analytics-service)
6. [Performance Alerts Service](#performance-alerts-service)
7. [Export Service](#export-service)
8. [Zustand Store](#zustand-store)

---

## Firebase Authentication Service

**File**: `src/lib/firebaseAuth.ts`

### Sign Up

```typescript
authService.signUp(email: string, password: string, displayName: string): Promise<AuthUser>
```

**Parameters**:
- `email` (string): User email address
- `password` (string): User password (minimum 8 characters)
- `displayName` (string): User display name

**Returns**: Promise<AuthUser>

**Example**:
```typescript
const user = await authService.signUp('user@example.com', 'SecurePass123!', 'John Doe');
```

**Errors**:
- `auth/email-already-in-use` - Email already registered
- `auth/invalid-email` - Invalid email format
- `auth/weak-password` - Password too weak

---

### Sign In

```typescript
authService.signIn(email: string, password: string): Promise<AuthUser>
```

**Parameters**:
- `email` (string): User email address
- `password` (string): User password

**Returns**: Promise<AuthUser>

**Example**:
```typescript
const user = await authService.signIn('user@example.com', 'SecurePass123!');
```

**Errors**:
- `auth/user-not-found` - User not found
- `auth/wrong-password` - Incorrect password
- `auth/too-many-requests` - Too many failed attempts

---

### Sign Out

```typescript
authService.signOut(): Promise<void>
```

**Returns**: Promise<void>

**Example**:
```typescript
await authService.signOut();
```

---

### Send Password Reset Email

```typescript
authService.sendPasswordReset(email: string): Promise<void>
```

**Parameters**:
- `email` (string): User email address

**Returns**: Promise<void>

**Example**:
```typescript
await authService.sendPasswordReset('user@example.com');
```

---

### Update User Profile

```typescript
authService.updateUserProfile(displayName: string, photoURL?: string): Promise<void>
```

**Parameters**:
- `displayName` (string): New display name
- `photoURL` (string, optional): New profile photo URL

**Returns**: Promise<void>

**Example**:
```typescript
await authService.updateUserProfile('Jane Doe', 'https://example.com/photo.jpg');
```

---

### Listen to Auth State

```typescript
authService.onAuthStateChanged(callback: (user: AuthUser | null) => void): () => void
```

**Parameters**:
- `callback` (function): Called when auth state changes

**Returns**: Unsubscribe function

**Example**:
```typescript
const unsubscribe = authService.onAuthStateChanged((user) => {
  if (user) {
    console.log('User logged in:', user.email);
  } else {
    console.log('User logged out');
  }
});

// Cleanup
unsubscribe();
```

---

## Firebase Database Service

**File**: `src/lib/firebaseService.ts`

### Add Expense

```typescript
firebaseService.addExpense(userId: string, expense: Expense): Promise<string>
```

**Parameters**:
- `userId` (string): User ID
- `expense` (Expense): Expense object

**Returns**: Promise<string> - Document ID

**Example**:
```typescript
const docId = await firebaseService.addExpense(userId, {
  description: 'Groceries',
  amount: 50,
  category: 'Food',
  date: new Date(),
  paymentMethod: 'Card'
});
```

---

### Get Expenses

```typescript
firebaseService.getExpenses(userId: string): Promise<Expense[]>
```

**Parameters**:
- `userId` (string): User ID

**Returns**: Promise<Expense[]>

**Example**:
```typescript
const expenses = await firebaseService.getExpenses(userId);
```

---

### Update Expense

```typescript
firebaseService.updateExpense(userId: string, docId: string, updates: Partial<Expense>): Promise<void>
```

**Parameters**:
- `userId` (string): User ID
- `docId` (string): Document ID
- `updates` (Partial<Expense>): Fields to update

**Returns**: Promise<void>

**Example**:
```typescript
await firebaseService.updateExpense(userId, docId, {
  amount: 60,
  category: 'Groceries'
});
```

---

### Delete Expense

```typescript
firebaseService.deleteExpense(userId: string, docId: string): Promise<void>
```

**Parameters**:
- `userId` (string): User ID
- `docId` (string): Document ID

**Returns**: Promise<void>

**Example**:
```typescript
await firebaseService.deleteExpense(userId, docId);
```

---

### Similar Methods for Other Collections

All collections follow the same pattern:
- `addIncome()`, `getIncome()`, `updateIncome()`, `deleteIncome()`
- `addBudget()`, `getBudgets()`, `updateBudget()`, `deleteBudget()`
- `addInvestment()`, `getInvestments()`, `updateInvestment()`, `deleteInvestment()`
- `addGoal()`, `getGoals()`, `updateGoal()`, `deleteGoal()`
- `addHouse()`, `getHouses()`, `updateHouse()`, `deleteHouse()`
- `addVehicle()`, `getVehicles()`, `updateVehicle()`, `deleteVehicle()`
- `addNote()`, `getNotes()`, `updateNote()`, `deleteNote()`
- `addDocument()`, `getDocuments()`, `deleteDocument()`
- `addPaymentMethod()`, `getPaymentMethods()`, `updatePaymentMethod()`, `deletePaymentMethod()`
- `addCategory()`, `getCategories()`, `updateCategory()`, `deleteCategory()`
- `addRecurringTransaction()`, `getRecurringTransactions()`, `updateRecurringTransaction()`, `deleteRecurringTransaction()`

---

## Analytics Service

**File**: `src/lib/analytics.ts`

### Initialize Analytics

```typescript
initializeAnalytics(): void
```

**Example**:
```typescript
initializeAnalytics();
```

---

### Set User ID

```typescript
setAnalyticsUserId(userId: string): void
```

**Parameters**:
- `userId` (string): User ID

**Example**:
```typescript
setAnalyticsUserId('user123');
```

---

### Set User Properties

```typescript
setAnalyticsUserProperties(properties: Record<string, any>): void
```

**Parameters**:
- `properties` (object): User properties

**Example**:
```typescript
setAnalyticsUserProperties({
  email: 'user@example.com',
  displayName: 'John Doe',
  loginMethod: 'email'
});
```

---

### Track Page View

```typescript
trackPageView(pageName: string, pageTitle?: string): void
```

**Parameters**:
- `pageName` (string): Page name/path
- `pageTitle` (string, optional): Page title

**Example**:
```typescript
trackPageView('/expenses', 'Expense Management');
```

---

### Track User Action

```typescript
trackUserAction(action: string, properties?: Record<string, any>): void
```

**Parameters**:
- `action` (string): Action name
- `properties` (object, optional): Action properties

**Example**:
```typescript
trackUserAction('expense_created', {
  category: 'Food',
  amount: 50
});
```

---

### Track Feature Usage

```typescript
trackFeatureUsage(featureName: string, properties?: Record<string, any>): void
```

**Parameters**:
- `featureName` (string): Feature name
- `properties` (object, optional): Feature properties

**Example**:
```typescript
trackFeatureUsage('expense_export', {
  format: 'csv',
  count: 10
});
```

---

### Track Error

```typescript
trackError(errorName: string, errorMessage: string, errorStack?: string): void
```

**Parameters**:
- `errorName` (string): Error name
- `errorMessage` (string): Error message
- `errorStack` (string, optional): Error stack trace

**Example**:
```typescript
trackError('expense_load_failed', 'Failed to load expenses', error.stack);
```

---

## Performance Monitoring Service

**File**: `src/lib/performance.ts`

### Record Metric

```typescript
recordMetric(name: string, value: number, unit: string): void
```

**Parameters**:
- `name` (string): Metric name
- `value` (number): Metric value
- `unit` (string): Unit (ms, bytes, etc.)

**Example**:
```typescript
recordMetric('page_load_time', 1500, 'ms');
```

---

### Track API Call

```typescript
trackApiCall(endpoint: string, method: string, duration: number, status: number): void
```

**Parameters**:
- `endpoint` (string): API endpoint
- `method` (string): HTTP method
- `duration` (number): Duration in milliseconds
- `status` (number): HTTP status code

**Example**:
```typescript
trackApiCall('/api/expenses', 'GET', 250, 200);
```

---

### Get Performance Summary

```typescript
getPerformanceSummary(): PerformanceSummary
```

**Returns**: PerformanceSummary object

**Example**:
```typescript
const summary = performanceMonitor.getPerformanceSummary();
console.log(summary.averageMetricValue);
```

---

### Export Metrics

```typescript
exportMetrics(format: 'json' | 'csv'): string
```

**Parameters**:
- `format` (string): Export format

**Returns**: Formatted string

**Example**:
```typescript
const json = performanceMonitor.exportMetrics('json');
```

---

## Advanced Analytics Service

**File**: `src/lib/advancedAnalytics.ts`

### Record Event

```typescript
recordEvent(userId: string, eventName: string, properties?: Record<string, any>): void
```

**Parameters**:
- `userId` (string): User ID
- `eventName` (string): Event name
- `properties` (object, optional): Event properties

**Example**:
```typescript
recordEvent('user123', 'expense_created', { category: 'Food' });
```

---

### Create Cohort

```typescript
createCohort(cohortName: string, startDate: Date, endDate: Date): UserCohort
```

**Parameters**:
- `cohortName` (string): Cohort name
- `startDate` (Date): Start date
- `endDate` (Date): End date

**Returns**: UserCohort object

**Example**:
```typescript
const cohort = createCohort('December 2025', new Date('2025-12-01'), new Date('2025-12-31'));
```

---

### Analyze Funnel

```typescript
analyzeFunnel(funnelName: string, steps: string[]): FunnelStep[]
```

**Parameters**:
- `funnelName` (string): Funnel name
- `steps` (string[]): Array of step names

**Returns**: FunnelStep[] array

**Example**:
```typescript
const funnel = analyzeFunnel('signup_funnel', [
  'page_visit',
  'signup_start',
  'email_verified',
  'profile_completed'
]);
```

---

### Create Segment

```typescript
createSegment(segmentName: string, criteria: (userId: string) => boolean, properties?: Record<string, any>): UserSegment
```

**Parameters**:
- `segmentName` (string): Segment name
- `criteria` (function): Criteria function
- `properties` (object, optional): Segment properties

**Returns**: UserSegment object

**Example**:
```typescript
const segment = createSegment('High Value Users', (userId) => {
  return userSpending[userId] > 1000;
});
```

---

## Performance Alerts Service

**File**: `src/lib/performanceAlerts.ts`

### Create Alert

```typescript
createAlert(name: string, metric: string, threshold: number, severity: 'low' | 'medium' | 'high' | 'critical'): PerformanceAlert
```

**Parameters**:
- `name` (string): Alert name
- `metric` (string): Metric to monitor
- `threshold` (number): Threshold value
- `severity` (string): Alert severity

**Returns**: PerformanceAlert object

**Example**:
```typescript
const alert = createAlert('Slow Page Load', 'page_load_time', 3000, 'high');
```

---

### Set Budget

```typescript
setBudget(metric: string, limit: number): PerformanceBudget
```

**Parameters**:
- `metric` (string): Metric name
- `limit` (number): Budget limit

**Returns**: PerformanceBudget object

**Example**:
```typescript
const budget = setBudget('page_load_time', 2000);
```

---

### Check Thresholds

```typescript
checkThresholds(metrics: Record<string, number>): AlertTriggered[]
```

**Parameters**:
- `metrics` (object): Metrics to check

**Returns**: AlertTriggered[] array

**Example**:
```typescript
const triggered = checkThresholds({
  page_load_time: 3500,
  api_response_time: 500
});
```

---

## Export Service

**File**: `src/lib/exportService.ts`

### Export to CSV

```typescript
exportToCSV(data: any[], filename: string): void
```

**Parameters**:
- `data` (array): Data to export
- `filename` (string): Output filename

**Example**:
```typescript
exportToCSV(expenses, 'expenses.csv');
```

---

### Export to TXT

```typescript
exportToTXT(content: string, filename: string): void
```

**Parameters**:
- `content` (string): Content to export
- `filename` (string): Output filename

**Example**:
```typescript
exportToTXT('Financial Report\n...', 'report.txt');
```

---

## Zustand Store

**File**: `src/lib/store.ts`

### Get Store

```typescript
const store = useAppStore();
```

**Available State**:
- `user` - Current user
- `isAuthenticated` - Authentication status
- `expenses` - Expense list
- `income` - Income list
- `budgets` - Budget list
- `investments` - Investment list
- `goals` - Goal list
- `houses` - House list
- `vehicles` - Vehicle list
- `notes` - Note list
- `documents` - Document list
- `categories` - Category list
- `recurringTransactions` - Recurring transaction list

**Available Actions**:
- `setUser()` - Set current user
- `setIsAuthenticated()` - Set authentication status
- `addExpense()` - Add expense
- `updateExpense()` - Update expense
- `deleteExpense()` - Delete expense
- `setExpenses()` - Set expense list
- Similar actions for all other collections

**Example**:
```typescript
const { expenses, addExpense } = useAppStore();

const handleAddExpense = async (expense) => {
  await addExpense(expense);
};
```

---

## Error Handling

All API methods include error handling. Errors are thrown with Firebase error codes:

```typescript
try {
  await authService.signIn(email, password);
} catch (error: any) {
  const errorCode = error.code; // e.g., 'auth/wrong-password'
  const errorMessage = error.message;
}
```

---

## Rate Limiting

**Current Limits**:
- Authentication: 5 attempts per 15 minutes
- API calls: No limit (implement in production)
- Database queries: Firestore quotas apply

---

## Pagination

For large datasets, use pagination:

```typescript
const pageSize = 20;
const startIndex = (pageNumber - 1) * pageSize;
const paginatedData = data.slice(startIndex, startIndex + pageSize);
```

---

## Caching

Use Zustand store for caching:

```typescript
const { expenses, setExpenses } = useAppStore();

if (expenses.length === 0) {
  const data = await firebaseService.getExpenses(userId);
  setExpenses(data);
}
```

---

## Best Practices

1. **Always handle errors** - Use try-catch blocks
2. **Use TypeScript** - Leverage type safety
3. **Cache data** - Use Zustand store
4. **Validate input** - Check parameters before API calls
5. **Track performance** - Use performance monitoring
6. **Log errors** - Use analytics service for error tracking
7. **Implement pagination** - For large datasets
8. **Use memoization** - For expensive calculations

---

**Last Updated**: December 30, 2025  
**Version**: 1.0  
**Status**: ✅ Complete

