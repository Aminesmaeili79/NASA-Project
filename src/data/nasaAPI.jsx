import axios from 'axios';

const NASA_API_BASE_URL = 'https://images-api.nasa.gov';
const NASA_VIDEO_API_URL = 'https://images-assets.nasa.gov'

export const nasaApi = {
    searchMedia: async (query, mediaType) => {
        try {
            const response = await axios.get(`${NASA_API_BASE_URL}/search`, {
                params: {
                    q: query,
                    media_type: mediaType || '',
                    api_key: import.meta.env.NASA_API_KEY
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error searching NASA media:', error);
            throw error;
        }
    },

    getVideoAssetDetails: async (nasaId) => {
        try {
            const response = await axios.get(`${NASA_API_BASE_URL}/asset/${nasaId}`, {
                params: {
                    api_key: import.meta.env.NASA_API_KEY
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching video asset details:', error);
            throw error;
        }
    },

    getVideoManifest: async (nasaId) => {
        try {
            const response = await axios.get(`${NASA_API_BASE_URL}/asset/${nasaId}/metadata`, {
                params: {
                    api_key: import.meta.env.NASA_API_KEY
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching video manifest:', error);
            throw error;
        }
    },

    getVideoFile: async (fileUrl) => {
        try {
            const fullUrl = fileUrl.startsWith('http')
                ? fileUrl
                : `${NASA_VIDEO_API_URL}/${fileUrl}`;

            const response = await axios.get(fullUrl);
            return response.data;
        } catch (error) {
            console.error('Error fetching video file:', error);
            throw error;
        }
    }
};