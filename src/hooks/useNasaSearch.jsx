import { useState, useCallback, useEffect } from 'react';
import { nasaApi } from '../services/nasaApi';

/**
 * Custom hook for NASA API search functionality
 * @param {Object} options - Options for the search
 * @param {string} options.initialQuery - Initial search query
 * @param {Array} options.initialMediaTypes - Initial media types to search for
 * @param {number} options.initialPage - Initial page number
 * @param {number} options.pageSize - Number of results per page
 * @returns {Object} Search-related state and functions
 */
export const useNasaSearch = ({
                                  initialQuery = '',
                                  initialMediaTypes = [],
                                  initialPage = 1,
                                  pageSize = 20
                              } = {}) => {
    // State
    const [query, setQuery] = useState(initialQuery);
    const [mediaTypes, setMediaTypes] = useState(initialMediaTypes);
    const [results, setResults] = useState([]);
    const [currentPage, setCurrentPage] = useState(initialPage);
    const [totalPages, setTotalPages] = useState(1);
    const [totalResults, setTotalResults] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [lastSearchedQuery, setLastSearchedQuery] = useState('');

    // Toggle media type selection
    const toggleMediaType = useCallback((type) => {
        setMediaTypes(prev => {
            const index = prev.indexOf(type);
            if (index === -1) {
                return [...prev, type];
            } else {
                return prev.filter(t => t !== type);
            }
        });
    }, []);

    // Reset search state
    const resetSearch = useCallback(() => {
        setResults([]);
        setCurrentPage(initialPage);
        setTotalPages(1);
        setTotalResults(0);
        setError(null);
        setLastSearchedQuery('');
    }, [initialPage]);

    // Perform search
    const performSearch = useCallback(async (searchQuery = query, page = currentPage) => {
        if (!searchQuery.trim()) {
            resetSearch();
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const mediaTypesString = mediaTypes.join(',');

            const data = await nasaApi.searchMedia(searchQuery, mediaTypesString, page, pageSize);

            if (data?.collection?.items) {
                setResults(data.collection.items);

                // Set pagination services
                const totalHits = data.collection?.metadata?.total_hits || 0;
                setTotalResults(totalHits);
                setTotalPages(Math.ceil(totalHits / pageSize) || 1);
                setCurrentPage(page);
                setLastSearchedQuery(searchQuery);
            } else {
                setResults([]);
                setError("No results found");
            }
        } catch (err) {
            console.error("Search error:", err);
            setError(err.customMessage || "An error occurred while searching");
            setResults([]);
        } finally {
            setLoading(false);
        }
    }, [query, currentPage, mediaTypes, pageSize, resetSearch]);

    // Handle page change
    const changePage = useCallback((newPage) => {
        if (newPage < 1 || newPage > totalPages) return;

        setCurrentPage(newPage);
        performSearch(lastSearchedQuery, newPage);
    }, [lastSearchedQuery, performSearch, totalPages]);

    // Execute search function
    const executeSearch = useCallback((e) => {
        if (e) e.preventDefault();
        performSearch(query, 1); // Reset to first page on new search
    }, [query, performSearch]);

    // Return values and functions
    return {
        // State
        query,
        mediaTypes,
        results,
        currentPage,
        totalPages,
        totalResults,
        loading,
        error,
        lastSearchedQuery,

        // Functions
        setQuery,
        toggleMediaType,
        performSearch,
        executeSearch,
        changePage,
        resetSearch
    };
};

