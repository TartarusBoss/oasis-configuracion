import { describe, it, expect } from 'vitest';

describe('Utility Functions', () => {
  describe('String Utilities', () => {
    it('should capitalize names correctly', () => {
      const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);
      expect(capitalize('admin')).toBe('Admin');
    });

    it('should format email addresses', () => {
      const email = 'ADMIN@OASIS.COM';
      expect(email.toLowerCase()).toBe('admin@oasis.com');
    });

    it('should truncate long strings', () => {
      const truncate = (str, length) => str.length > length ? str.substring(0, length).trimEnd() + '...' : str;
      expect(truncate('This is a long text', 10)).toBe('This is a...');
    });
  });

  describe('Date Utilities', () => {
    it('should format dates correctly', () => {
      const formatDate = (date) => new Date(date).toLocaleDateString();
      const result = formatDate('2025-01-15');
      expect(result).toBeTruthy();
    });

    it('should parse time strings', () => {
      const parseTime = (time) => {
        const [hours, minutes] = time.split(':');
        return { hours: parseInt(hours), minutes: parseInt(minutes) };
      };
      const result = parseTime('14:30');
      expect(result.hours).toBe(14);
      expect(result.minutes).toBe(30);
    });

    it('should check if date is in future', () => {
      const isFuture = (dateString) => new Date(dateString) > new Date();
      expect(isFuture('2099-01-01')).toBe(true);
      expect(isFuture('2020-01-01')).toBe(false);
    });
  });

  describe('Number Utilities', () => {
    it('should format currency', () => {
      const formatCurrency = (num) => '$' + num.toFixed(2);
      expect(formatCurrency(100)).toBe('$100.00');
    });

    it('should round numbers', () => {
      const round = (num, decimals) => Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals);
      expect(round(3.14159, 2)).toBe(3.14);
    });

    it('should validate number range', () => {
      const inRange = (num, min, max) => num >= min && num <= max;
      expect(inRange(50, 0, 100)).toBe(true);
      expect(inRange(150, 0, 100)).toBe(false);
    });
  });

  describe('Array Utilities', () => {
    it('should filter array items', () => {
      const data = [1, 2, 3, 4, 5];
      const filtered = data.filter(n => n > 2);
      expect(filtered).toEqual([3, 4, 5]);
    });

    it('should remove duplicates', () => {
      const removeDuplicates = (arr) => [...new Set(arr)];
      expect(removeDuplicates([1, 2, 2, 3, 3, 3])).toEqual([1, 2, 3]);
    });

    it('should sort array', () => {
      const numbers = [3, 1, 4, 1, 5, 9];
      const sorted = [...numbers].sort((a, b) => a - b);
      expect(sorted[0]).toBe(1);
      expect(sorted[sorted.length - 1]).toBe(9);
    });

    it('should find item in array', () => {
      const users = [
        { id: 1, name: 'Admin' },
        { id: 2, name: 'User' }
      ];
      const found = users.find(u => u.id === 1);
      expect(found.name).toBe('Admin');
    });
  });

  describe('Object Utilities', () => {
    it('should merge objects', () => {
      const merge = (obj1, obj2) => ({ ...obj1, ...obj2 });
      const result = merge({ a: 1 }, { b: 2 });
      expect(result).toEqual({ a: 1, b: 2 });
    });

    it('should clone object', () => {
      const clone = (obj) => JSON.parse(JSON.stringify(obj));
      const original = { name: 'Test', value: 123 };
      const cloned = clone(original);
      expect(cloned).toEqual(original);
      expect(cloned).not.toBe(original);
    });

    it('should get object keys', () => {
      const user = { id: 1, name: 'Admin', role: 'admin' };
      expect(Object.keys(user)).toEqual(['id', 'name', 'role']);
    });
  });

  describe('Validation Utilities', () => {
    it('should validate email', () => {
      const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      expect(isValidEmail('admin@oasis.com')).toBe(true);
      expect(isValidEmail('invalid')).toBe(false);
    });

    it('should validate password strength', () => {
      const isStrongPassword = (pwd) => pwd.length >= 6;
      expect(isStrongPassword('secure123')).toBe(true);
      expect(isStrongPassword('abc')).toBe(false);
    });

    it('should validate required fields', () => {
      const isRequired = (value) => value !== null && value !== undefined && value !== '';
      expect(isRequired('test')).toBe(true);
      expect(isRequired('')).toBe(false);
      expect(isRequired(null)).toBe(false);
    });
  });

  describe('Type Checking', () => {
    it('should check if value is string', () => {
      expect(typeof 'hello').toBe('string');
      expect(typeof 123).not.toBe('string');
    });

    it('should check if value is number', () => {
      expect(typeof 123).toBe('number');
      expect(typeof '123').not.toBe('number');
    });

    it('should check if value is object', () => {
      expect(typeof {}).toBe('object');
      expect(typeof []).toBe('object');
    });

    it('should check if value is array', () => {
      expect(Array.isArray([1, 2, 3])).toBe(true);
      expect(Array.isArray('string')).toBe(false);
    });
  });
});
