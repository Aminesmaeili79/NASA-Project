export const nasaApi = {
    searchMedia: async (query, page = 1) => {
        try {
            const response = await fetch(
                `https://images-api.nasa.gov/search?q=${encodeURIComponent(query)}&page=${page}&media_type=image,video,audio`
            );
            return await response.json();
        } catch (error) {
            console.error('Error searching NASA media:', error);
            throw error;
        }
    }
}