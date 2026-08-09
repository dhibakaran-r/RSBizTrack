import { useCallback } from 'react';

export function useDateTime(locale = 'en-IN') {
  
  // Helper to safely parse any date string format safely across all browsers
  const parseDate = (input) => {
    if (!input) return null;
    
    if (input instanceof Date || typeof input === 'number') {
      return new Date(input);
    }
    
    if (typeof input === 'string') {
      const sanitized = input.trim().replace(' ', 'T');
      return new Date(sanitized);
    }
    
    return new Date(input);
  };

  // Format only the date (DD/MM/YYYY)
  const formatDate = useCallback((dateInput, options = {}) => {
    const date = parseDate(dateInput);
    if (!date || isNaN(date.getTime())) return '';
    
    const defaultOptions = { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit',
      timeZone: 'Asia/Kolkata',
      ...options 
    };
    
    return new Intl.DateTimeFormat(locale, defaultOptions).format(date);
  }, [locale]);

  // Format date and time together (DD/MM/YYYY, hh:mm am/pm)
  const formatDateTime = useCallback((dateInput, options = {}) => {
    const date = parseDate(dateInput);
    if (!date || isNaN(date.getTime())) return '';
    
    const defaultOptions = { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit', 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true,
      timeZone: 'Asia/Kolkata',
      ...options 
    };
    
    return new Intl.DateTimeFormat(locale, defaultOptions).format(date);
  }, [locale]);

  return { formatDate, formatDateTime };
}
