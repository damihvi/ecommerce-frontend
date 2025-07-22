// Utility functions for handling order IDs

/**
 * Formats a UUID order ID for display to users
 * Takes the last 8 characters and converts to uppercase
 */
export const formatOrderId = (orderId: string): string => {
  if (!orderId) return 'PENDING';
  return orderId.slice(-8).toUpperCase();
};

/**
 * Generates a human-readable order number with prefix
 */
export const getOrderDisplayNumber = (orderId: string): string => {
  return `#${formatOrderId(orderId)}`;
};

/**
 * Validates if a string is a valid UUID format
 */
export const isValidUUID = (str: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
};

/**
 * Extracts just the ID portion for API calls
 */
export const extractOrderId = (orderDisplayNumber: string): string => {
  return orderDisplayNumber.replace('#', '').toLowerCase();
};
