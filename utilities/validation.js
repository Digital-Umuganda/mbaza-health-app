/**
 * Input validation and sanitization utilities
 */

/**
 * Sanitize user input by removing potentially dangerous characters
 * @param {string} input - The input string to sanitize
 * @returns {string} - Sanitized string
 */
export const sanitizeInput = (input) => {
  if (!input || typeof input !== 'string') return '';
  
  // Remove HTML tags and potentially dangerous characters
  return input
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/[<>'"&]/g, '') // Remove dangerous characters
    .trim();
};

/**
 * Validate phone number format (Rwanda format)
 * @param {string} phoneNumber - Phone number to validate
 * @returns {boolean} - True if valid
 */
export const validatePhoneNumber = (phoneNumber) => {
  if (!phoneNumber || typeof phoneNumber !== 'string') return false;
  
  const sanitized = sanitizeInput(phoneNumber);
  // Rwanda phone numbers: 07XXXXXXXX (10 digits)
  const phoneRegex = /^07\d{8}$/;
  return phoneRegex.test(sanitized);
};

/**
 * Validate PIN format
 * @param {string} pin - PIN to validate
 * @returns {boolean} - True if valid
 */
export const validatePin = (pin) => {
  if (!pin || typeof pin !== 'string') return false;
  
  const sanitized = sanitizeInput(pin);
  // PIN should be at least 5 digits, only numbers
  const pinRegex = /^\d{5,}$/;
  return pinRegex.test(sanitized);
};

/**
 * Validate name format
 * @param {string} name - Name to validate
 * @returns {boolean} - True if valid
 */
export const validateName = (name) => {
  if (!name || typeof name !== 'string') return false;
  
  const sanitized = sanitizeInput(name);
  // Name should be at least 2 characters, only letters and spaces
  const nameRegex = /^[a-zA-Z\s]{2,}$/;
  return nameRegex.test(sanitized) && sanitized.trim().length >= 2;
};

/**
 * Validate numeric input (weight, height, age)
 * @param {string} value - Numeric value to validate
 * @param {number} min - Minimum value (optional)
 * @param {number} max - Maximum value (optional)
 * @returns {boolean} - True if valid
 */
export const validateNumeric = (value, min = 0, max = 999) => {
  if (!value || typeof value !== 'string') return false;
  
  const sanitized = sanitizeInput(value);
  const numValue = parseFloat(sanitized);
  
  return !isNaN(numValue) && numValue >= min && numValue <= max;
};

/**
 * Sanitize and validate general text input
 * @param {string} text - Text to validate
 * @param {number} maxLength - Maximum length allowed
 * @returns {object} - {isValid: boolean, sanitized: string}
 */
export const validateText = (text, maxLength = 500) => {
  if (!text || typeof text !== 'string') {
    return { isValid: false, sanitized: '' };
  }
  
  const sanitized = sanitizeInput(text);
  const isValid = sanitized.length > 0 && sanitized.length <= maxLength;
  
  return { isValid, sanitized };
};