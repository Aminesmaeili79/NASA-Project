import axios from 'axios';

const NASA_API_BASE_URL = 'https://images-api.nasa.gov';
const NASA_ASSETS_URL = 'https://images-assets.nasa.gov';
const NASA_API_KEY = import.meta.env.VITE_NASA_API_KEY;

// Create axios instance with default configuration
const apiClient = axios.create({
    baseURL: NASA_API_BASE_URL,
    timeout: 15000, // 15 seconds timeout
});

// Add response interceptor for error handling
apiClient.interceptors.response.use(
    response => response,
    error => {
        // Log errors
        console.error('API Error:', error.message);

        // Handle different types of errors
        if (error.response) {
            // Server responded with an error status
            console.error(`Server error: ${error.response.status} - ${error.response.statusText}`);
        } else if (error.request) {
            // Request was made but no response received
            console.error('No response received from server');
        } else {
            // Request setup error
            console.error('Request error:', error.message);
        }

        // Add a custom error message for users
        error.customMessage = 'Unable to connect to NASA API. Please try again later.';
        return Promise.reject(error);
    }
);

/**
 * Helper function to implement retry logic
 */
const withRetry = async (requestFn, maxRetries = 2, delay = 1000) => {
    let lastError;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
            return await requestFn();
        } catch (error) {
            lastError = error;

            // Only retry on network errors or server errors (5xx)
            if (!error.response || (error.response.status >= 500 && error.response.status < 600)) {
                console.log(`Attempt ${attempt + 1} failed, retrying in ${delay}ms...`);
                await new Promise(resolve => setTimeout(resolve, delay));
                delay *= 2; // Exponential backoff
            } else {
                // Don't retry on client errors (4xx)
                break;
            }
        }
    }

    throw lastError;
};

/**
 * NASA API Service
 */
export const nasaApi = {
    /**
     * Search NASA media
     * @param {string} query - Search query
     * @param {string} mediaType - Type of media (image, video, audio)
     * @param {number} page - Page number for pagination (starts at 1)
     * @param {number} pageSize - Number of results per page
     * @returns {Promise<Object>} - Search results
     */
    searchMedia: async (query, mediaType = '', page = 1, pageSize = 20) => {
        return withRetry(async () => {
            const params = {
                q: query,
                page,
                page_size: pageSize
            };

            // Only add media_type if it's specified (to avoid filtering too much)
            if (mediaType) {
                params.media_type = mediaType;
            }

            // Add API key if available
            if (NASA_API_KEY) {
                params.api_key = NASA_API_KEY;
            }

            const response = await apiClient.get('/search', { params });
            return response.data;
        });
    },

    /**
     * Get asset details for a video
     * @param {string} nasaId - NASA ID of the asset
     * @returns {Promise<Object>} - Asset details
     */
    getVideoAssetDetails: async (nasaId) => {
        return withRetry(async () => {
            const params = NASA_API_KEY ? { api_key: NASA_API_KEY } : {};
            const response = await apiClient.get(`/asset/${nasaId}`, { params });
            return response.data;
        });
    },

    /**
     * Get asset details for an audio file
     * @param {string} nasaId - NASA ID of the asset
     * @returns {Promise<Object>} - Asset details
     */
    getAudioAssetDetails: async (nasaId) => {
        return withRetry(async () => {
            const params = NASA_API_KEY ? { api_key: NASA_API_KEY } : {};
            const response = await apiClient.get(`/asset/${nasaId}`, { params });
            return response.data;
        });
    },

    /**
     * Get video manifest
     * @param {string} nasaId - NASA ID of the asset
     * @returns {Promise<Object>} - Video manifest
     */
    getVideoManifest: async (nasaId) => {
        return withRetry(async () => {
            const params = NASA_API_KEY ? { api_key: NASA_API_KEY } : {};
            const response = await apiClient.get(`/asset/${nasaId}/metadata`, { params });
            return response.data;
        });
    },

    /**
     * Get audio manifest
     * @param {string} nasaId - NASA ID of the asset
     * @returns {Promise<Object>} - Audio manifest
     */
    getAudioManifest: async (nasaId) => {
        return withRetry(async () => {
            const params = NASA_API_KEY ? { api_key: NASA_API_KEY } : {};
            try {
                const response = await apiClient.get(`/asset/${nasaId}/metadata`, { params });
                return response.data;
            } catch (error) {
                console.log(`Error getting audio manifest for ${nasaId}, trying alternative endpoints`);
                // Some NASA audio might use different endpoints, try a fallback
                try {
                    const fallbackResponse = await apiClient.get(`/audio/${nasaId}/metadata`, { params });
                    return fallbackResponse.data;
                } catch (fallbackError) {
                    throw error; // If fallback fails, throw the original error
                }
            }
        });
    },

    /**
     * Get media file (video or audio)
     * @param {string} fileUrl - URL of the media file
     * @returns {Promise<Object>} - Media file
     */
    getMediaFile: async (fileUrl) => {
        try {
            const fullUrl = fileUrl.startsWith('http')
                ? fileUrl
                : `${NASA_ASSETS_URL}/${fileUrl}`;

            const response = await axios.get(fullUrl, {
                responseType: 'blob', // Important for binary files like audio/video
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching media file:', error);
            throw error;
        }
    },

    /**
     * Get asset by NASA ID
     * @param {string} nasaId - NASA ID of the asset
     * @returns {Promise<Object>} - Asset details
     */
    getAssetById: async (nasaId) => {
        return withRetry(async () => {
            const params = NASA_API_KEY ? { api_key: NASA_API_KEY } : {};
            const response = await apiClient.get(`/asset/${nasaId}`, { params });
            return response.data;
        });
    }
};

export default nasaApi;