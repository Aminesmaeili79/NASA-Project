import axios from 'axios';

const NASA_API_BASE_URL = 'https://images-api.nasa.gov';
const NASA_API_KEY = import.meta.env.VITE_NASA_API_KEY;

const apiClient = axios.create({
    baseURL: NASA_API_BASE_URL,
    timeout: 15000,
});

apiClient.interceptors.response.use(
    response => response,
    error => {
        console.error('API Error:', error.message);

        if (error.response) {
            console.error(`Server error: ${error.response.status} - ${error.response.statusText}`);
        } else if (error.request) {
            console.error('No response received from server');
        } else {
            console.error('Request error:', error.message);
        }

        error.customMessage = 'Unable to connect to NASA API. Please try again later.';
        return Promise.reject(error);
    }
);

const withRetry = async (requestFn, maxRetries = 2, delay = 1000) => {
    let lastError;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
            return await requestFn();
        } catch (error) {
            lastError = error;

            if (!error.response || (error.response.status >= 500 && error.response.status < 600)) {
                console.log(`Attempt ${attempt + 1} failed, retrying in ${delay}ms...`);
                await new Promise(resolve => setTimeout(resolve, delay));
                delay *= 2;
            } else {
                break;
            }
        }
    }

    throw lastError;
};

export const nasaApi = {
    searchMedia: async (query, mediaType = '', page = 1, pageSize = 20) => {
        return withRetry(async () => {
            const params = {
                q: query,
                page,
                page_size: pageSize
            };

            if (mediaType) {
                params.media_type = mediaType;
            }

            if (NASA_API_KEY) {
                params.api_key = NASA_API_KEY;
            }

            const response = await apiClient.get('/search', { params });
            return response.data;
        });
    },

    getVideoAssetDetails: async (nasaId) => {
        return withRetry(async () => {
            const params = NASA_API_KEY ? { api_key: NASA_API_KEY } : {};
            const response = await apiClient.get(`/asset/${nasaId}`, { params });
            return response.data;
        });
    },

    getAudioAssetDetails: async (nasaId) => {
        return withRetry(async () => {
            const params = NASA_API_KEY ? { api_key: NASA_API_KEY } : {};
            const response = await apiClient.get(`/asset/${nasaId}`, { params });
            return response.data;
        });
    },

    getVideoManifest: async (nasaId) => {
        return withRetry(async () => {
            const params = NASA_API_KEY ? { api_key: NASA_API_KEY } : {};
            const response = await apiClient.get(`/asset/${nasaId}/metadata`, { params });
            return response.data;
        });
    },

    getVideoSubsManifest: async (nasaId) => {
        return withRetry( async () => {
            const params = NASA_API_KEY ? { api_key: NASA_API_KEY } : {};
            const response = await  apiClient.get(`captions/${nasaId}`, { params });
            return response.data;
        })
    },

    getAudioManifest: async (nasaId) => {
        return withRetry(async () => {
            const params = NASA_API_KEY ? { api_key: NASA_API_KEY } : {};
            try {
                const response = await apiClient.get(`/asset/${nasaId}/metadata`, { params });
                return response.data;
            } catch (error) {
                console.log(`Error getting audio manifest for ${nasaId}, trying alternative endpoints`);
                try {
                    const fallbackResponse = await apiClient.get(`/audio/${nasaId}/metadata`, { params });
                    return fallbackResponse.data;
                } catch (fallbackError) {
                    throw error;
                }
            }
        });
    },

};

export default nasaApi;