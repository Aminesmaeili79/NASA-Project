// src/utils/mediaHelpers.js
/**
 * Get appropriate icon for media type
 * @param {string} mediaType - Media type (image, video, audio)
 * @returns {string} Icon name
 */
export const getMediaTypeIcon = (mediaType) => {
    switch (mediaType?.toLowerCase()) {
        case 'video':
            return 'video-camera';
        case 'audio':
            return 'music';
        case 'image':
        default:
            return 'image';
    }
};

/**
 * Determine the type of media from various sources
 * @param {Object} item - Media item
 * @param {Array} selectedTypes - User-selected media types
 * @returns {string} Media type (image, video, audio)
 */
export const determineMediaType = (item, selectedTypes = []) => {
    // First try to get type from item services
    if (item?.data?.[0]?.media_type) {
        return item.data[0].media_type;
    }

    // If only one type is selected, use that
    if (selectedTypes.length === 1) {
        return selectedTypes[0];
    }

    // Try to determine by file extension
    if (item?.links && item.links[0]?.href) {
        const href = item.links[0].href.toLowerCase();

        if (href.endsWith('.mp4') || href.endsWith('.avi') || href.endsWith('.mov')) {
            return 'video';
        }

        if (href.endsWith('.mp3') || href.endsWith('.wav') || href.endsWith('.m4a')) {
            return 'audio';
        }

        // Default to image for common image extensions
        if (href.endsWith('.jpg') || href.endsWith('.jpeg') || href.endsWith('.png') ||
            href.endsWith('.gif') || href.endsWith('.webp')) {
            return 'image';
        }
    }

    // Default to image if nothing else matches
    return 'image';
};

/**
 * Truncate text to a specific length and add ellipsis
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
export const truncateText = (text, maxLength = 100) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;

    // Try to truncate at word boundary
    const truncated = text.substring(0, maxLength);
    const lastSpace = truncated.lastIndexOf(' ');

    if (lastSpace > 0 && lastSpace > maxLength * 0.8) {
        return truncated.substring(0, lastSpace) + '...';
    }

    return truncated + '...';
};