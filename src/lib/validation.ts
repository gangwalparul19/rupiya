/**
 * Form validation utilities for real-time field validation
 */

/**
 * Validates an amount field
 * @param value - The amount value to validate
 * @returns Error message if invalid, null if valid
 * @example
 * const error = validateAmount("100");
 * if (error) console.log(error); // null
 */
export const validateAmount = (value: string): string | null => {
  if (!value) return 'Amount is required';
  const num = parseFloat(value);
  if (isNaN(num)) return 'Must be a valid number';
  if (num <= 0) return 'Amount must be positive';
  if (num > 999999999) return 'Amount too large';
  return null;
};

/**
 * Validates a month field in YYYY-MM format
 * @param value - The month value to validate
 * @returns Error message if invalid, null if valid
 * @example
 * const error = validateMonth("2024-01");
 * if (error) console.log(error); // null
 */
export const validateMonth = (value: string): string | null => {
  if (!value) return 'Month is required';
  if (!/^\d{4}-\d{2}$/.test(value)) return 'Invalid month format';
  return null;
};

/**
 * Validates a name field
 * @param value - The name value to validate
 * @returns Error message if invalid, null if valid
 * @example
 * const error = validateName("John");
 * if (error) console.log(error); // null
 */
export const validateName = (value: string): string | null => {
  if (!value) return 'Name is required';
  if (value.length < 2) return 'Name too short';
  if (value.length > 50) return 'Name too long';
  return null;
};

/**
 * Validates an email field
 * @param value - The email value to validate
 * @returns Error message if invalid, null if valid
 * @example
 * const error = validateEmail("user@example.com");
 * if (error) console.log(error); // null
 */
export const validateEmail = (value: string): string | null => {
  if (!value) return 'Email is required';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Invalid email';
  return null;
};

/**
 * Validates a date field
 * @param value - The date value to validate
 * @returns Error message if invalid, null if valid
 * @example
 * const error = validateDate("2024-01-15");
 * if (error) console.log(error); // null
 */
export const validateDate = (value: string): string | null => {
  if (!value) return 'Date is required';
  const date = new Date(value);
  if (isNaN(date.getTime())) return 'Invalid date';
  return null;
};

/**
 * Validates a description field
 * @param value - The description value to validate
 * @returns Error message if invalid, null if valid
 * @example
 * const error = validateDescription("This is a description");
 * if (error) console.log(error); // null
 */
export const validateDescription = (value: string): string | null => {
  if (!value) return 'Description is required';
  if (value.length < 2) return 'Description too short';
  if (value.length > 500) return 'Description too long';
  return null;
};

/**
 * Validates a category field
 * @param value - The category value to validate
 * @returns Error message if invalid, null if valid
 */
export const validateCategory = (value: string): string | null => {
  if (!value) return 'Category is required';
  return null;
};

/**
 * Validates an emoji field
 * @param value - The emoji value to validate
 * @returns Error message if invalid, null if valid
 */
export const validateEmoji = (value: string): string | null => {
  if (!value) return 'Emoji is required';
  return null;
};

/**
 * Validates a color field
 * @param value - The color value to validate
 * @returns Error message if invalid, null if valid
 */
export const validateColor = (value: string): string | null => {
  if (!value) return 'Color is required';
  return null;
};

/**
 * Validates a quantity field
 * @param value - The quantity value to validate
 * @returns Error message if invalid, null if valid
 * @example
 * const error = validateQuantity("10");
 * if (error) console.log(error); // null
 */
export const validateQuantity = (value: string): string | null => {
  if (!value) return 'Quantity is required';
  const num = parseFloat(value);
  if (isNaN(num)) return 'Must be a valid number';
  if (num <= 0) return 'Quantity must be positive';
  return null;
};

/**
 * Validates a unit price field
 * @param value - The unit price value to validate
 * @returns Error message if invalid, null if valid
 * @example
 * const error = validateUnitPrice("99.99");
 * if (error) console.log(error); // null
 */
export const validateUnitPrice = (value: string): string | null => {
  if (!value) return 'Unit price is required';
  const num = parseFloat(value);
  if (isNaN(num)) return 'Must be a valid number';
  if (num <= 0) return 'Unit price must be positive';
  return null;
};

/**
 * Validates a target amount field
 * @param value - The target amount value to validate
 * @returns Error message if invalid, null if valid
 * @example
 * const error = validateTargetAmount("50000");
 * if (error) console.log(error); // null
 */
export const validateTargetAmount = (value: string): string | null => {
  if (!value) return 'Target amount is required';
  const num = parseFloat(value);
  if (isNaN(num)) return 'Must be a valid number';
  if (num <= 0) return 'Target amount must be positive';
  if (num > 999999999) return 'Target amount too large';
  return null;
};

/**
 * Validates a target date field (must be in the future)
 * @param value - The target date value to validate
 * @returns Error message if invalid, null if valid
 * @example
 * const error = validateTargetDate("2025-12-31");
 * if (error) console.log(error); // null
 */
export const validateTargetDate = (value: string): string | null => {
  if (!value) return 'Target date is required';
  const date = new Date(value);
  if (isNaN(date.getTime())) return 'Invalid date';
  if (date <= new Date()) return 'Target date must be in the future';
  return null;
};

/**
 * Validates a priority field
 * @param value - The priority value to validate (high, medium, low)
 * @returns Error message if invalid, null if valid
 * @example
 * const error = validatePriority("high");
 * if (error) console.log(error); // null
 */
export const validatePriority = (value: string): string | null => {
  if (!value) return 'Priority is required';
  if (!['high', 'medium', 'low'].includes(value)) return 'Invalid priority';
  return null;
};

/**
 * Validates an investment type field
 * @param value - The investment type value to validate
 * @returns Error message if invalid, null if valid
 * @example
 * const error = validateInvestmentType("stock");
 * if (error) console.log(error); // null
 */
export const validateInvestmentType = (value: string): string | null => {
  if (!value) return 'Investment type is required';
  const validTypes = ['stock', 'mutual_fund', 'crypto', 'real_estate', 'gold', 'bonds', 'other'];
  if (!validTypes.includes(value)) return 'Invalid investment type';
  return null;
};

/**
 * Validates a title field
 * @param value - The title value to validate
 * @returns Error message if invalid, null if valid
 * @example
 * const error = validateTitle("My Title");
 * if (error) console.log(error); // null
 */
export const validateTitle = (value: string): string | null => {
  if (!value) return 'Title is required';
  if (value.length < 2) return 'Title too short';
  if (value.length > 100) return 'Title too long';
  return null;
};

/**
 * Validates an event type field
 * @param value - The event type value to validate
 * @returns Error message if invalid, null if valid
 * @example
 * const error = validateEventType("bill_reminder");
 * if (error) console.log(error); // null
 */
export const validateEventType = (value: string): string | null => {
  if (!value) return 'Event type is required';
  const validTypes = ['bill_reminder', 'recurring_transaction', 'goal_milestone', 'custom'];
  if (!validTypes.includes(value)) return 'Invalid event type';
  return null;
};

/**
 * Validates a reminder days field
 * @param value - The reminder days value to validate
 * @returns Error message if invalid, null if valid
 * @example
 * const error = validateReminderDays("3");
 * if (error) console.log(error); // null
 */
export const validateReminderDays = (value: string): string | null => {
  if (!value) return 'Reminder days is required';
  const num = parseInt(value, 10);
  if (isNaN(num)) return 'Must be a valid number';
  if (num < 0) return 'Reminder days cannot be negative';
  if (num > 365) return 'Reminder days too large';
  return null;
};

/**
 * Validates a frequency field
 * @param value - The frequency value to validate
 * @returns Error message if invalid, null if valid
 * @example
 * const error = validateFrequency("monthly");
 * if (error) console.log(error); // null
 */
export const validateFrequency = (value: string): string | null => {
  if (!value) return 'Frequency is required';
  const validFrequencies = ['monthly', 'quarterly', 'yearly', 'one-time'];
  if (!validFrequencies.includes(value)) return 'Invalid frequency';
  return null;
};
