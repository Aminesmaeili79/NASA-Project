// src/utils/storageHelpers.js
/**
 * Store services in local storage with expiration
 * @param {string} key - Storage key
 * @param {any} value - Value to store
 * @param {number} expirationMinutes - Expiration time in minutes
 */
export const setWithExpiry = (key, value, expirationMinutes = 60) => {
    const now = new Date();
    const item = {
        value,
        expiry: now.getTime() + expirationMinutes * 60 * 1000
    };

    localStorage.setItem(key, JSON.stringify(item));
};

/**
 * Get services from local storage, respecting expiration
 * @param {string} key - Storage key
 * @returns {any|null} Stored value or null if expired/not found
 */
export const getWithExpiry = (key) => {
    const itemStr = localStorage.getItem(key);

    if (!itemStr) {
        return null;
    }

    try {
        const item = JSON.parse(itemStr);
        const now = new Date();

        if (now.getTime() > item.expiry) {
            localStorage.removeItem(key);
            return null;
        }

        return item.value;
    } catch (error) {
        console.error('Error retrieving from storage:', error);
        return null;
    }
};