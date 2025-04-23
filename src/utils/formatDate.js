// src/utils/formatDate.js
/**
 * Format a date string to a more readable format
 * @param {string} dateString - Date string in ISO format (YYYY-MM-DDTHH:mm:ss.sssZ)
 * @param {Object} options - Formatting options
 * @param {string} options.format - Format type ('short', 'medium', 'long')
 * @param {boolean} options.includeTime - Whether to include time
 * @returns {string} Formatted date string
 */
export const formatDate = (dateString, { format = 'medium', includeTime = false } = {}) => {
    if (!dateString) return '';

    try {
        const date = new Date(dateString);

        // Check if date is valid
        if (isNaN(date.getTime())) {
            throw new Error('Invalid date');
        }

        // Format options based on desired format length
        let options = {};

        switch (format) {
            case 'short':
                options = {
                    year: 'numeric',
                    month: 'numeric',
                    day: 'numeric'
                };
                break;
            case 'long':
                options = {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                };
                break;
            case 'medium':
            default:
                options = {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                };
                break;
        }

        // Add time options if requested
        if (includeTime) {
            options = {
                ...options,
                hour: '2-digit',
                minute: '2-digit'
            };
        }

        return date.toLocaleDateString(undefined, options);
    } catch (error) {
        console.error('Error formatting date:', error);

        // Fallback to simple date parsing
        if (dateString.includes('T')) {
            return dateString.split('T')[0];
        }

        return dateString;
    }
};