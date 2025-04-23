import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { nasaApi } from '../services/nasaApi';
import { ArticleContext } from '../context/ArticleContext';
import audioImage from '../assets/audio.png'

const SearchPage = () => {
    const { setArticle } = useContext(ArticleContext);

    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchType, setSearchType] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalResults, setTotalResults] = useState(0);
    const [lastSearchedQuery, setLastSearchedQuery] = useState('');
    const pageSize = 24;

    const handleType = (type) => {
        const updatedTypes = [...searchType];
        const index = updatedTypes.indexOf(type);

        if (index === -1) {
            updatedTypes.push(type);
        } else {
            updatedTypes.splice(index, 1);
        }

        setSearchType(updatedTypes);
    };

    const handleSearch = async (e, page = 1) => {
        e?.preventDefault();

        if (!query.trim()) return;

        setLoading(true);
        setError(null);

        try {
            const searchTypeString = searchType.join(',');

            const data = await nasaApi.searchMedia(query, searchTypeString, page, pageSize);

            if (!data.collection?.items?.length) {
                setResults([]);
                setError("No results found. Try different search terms.");
                return;
            }

            setResults(data.collection.items);
            setLastSearchedQuery(query);

            // Set pagination data
            if (data.collection?.metadata?.total_hits) {
                const totalHits = parseInt(data.collection.metadata.total_hits);
                setTotalResults(totalHits);
                setTotalPages(Math.ceil(totalHits / pageSize));
            } else {
                setTotalPages(1);
                setTotalResults(data.collection.items.length);
            }

            setCurrentPage(page);
        } catch (err) {
            console.error("Search error:", err);
            setError("An error occurred while fetching data. Please try again.");
            setResults([]);
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (newPage) => {
        if (newPage < 1 || newPage > totalPages || loading) return;

        window.scrollTo(0, 0); // Scroll to top when changing pages
        handleSearch(null, newPage);
    };

    // Render pagination component
    const renderPagination = () => {
        if (totalPages <= 1 || results.length === 0) return null;

        // Calculate what page numbers to show
        const renderPageNumbers = () => {
            const pageNumbers = [];
            const maxPagesToShow = 5;

            if (totalPages <= maxPagesToShow) {
                // Show all pages if there are few
                for (let i = 1; i <= totalPages; i++) {
                    pageNumbers.push(i);
                }
            } else {
                // Always show first page
                pageNumbers.push(1);

                // Calculate start and end of page range around current page
                let start = Math.max(2, currentPage - 1);
                let end = Math.min(totalPages - 1, currentPage + 1);

                // Adjust if we're near the start or end
                if (currentPage <= 3) {
                    end = Math.min(totalPages - 1, 4);
                } else if (currentPage >= totalPages - 2) {
                    start = Math.max(2, totalPages - 3);
                }

                // Add ellipsis after first page if needed
                if (start > 2) {
                    pageNumbers.push('...');
                }

                // Add page numbers around current page
                for (let i = start; i <= end; i++) {
                    pageNumbers.push(i);
                }

                // Add ellipsis before last page if needed
                if (end < totalPages - 1) {
                    pageNumbers.push('...');
                }

                // Always show last page
                pageNumbers.push(totalPages);
            }

            return pageNumbers;
        };

        return (
            <div className="pagination flex justify-center items-center gap-6">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage <= 1 || loading}
                    className="pagination-button disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer opacity-75 not-disabled:hover:opacity-100"
                    aria-label="Previous page"
                >
                    Previous
                </button>

                <div className="page-numbers flex gap-2">
                    {renderPageNumbers().map((page, index) => (
                        page === '...' ? (
                            <span key={`ellipsis-${index}`} className="px-3 py-2 text-[1.2rem] flex items-center">.  .  .</span>
                        ) : (
                            <button
                                key={`page-${page}`}
                                onClick={() => handlePageChange(page)}
                                disabled={page === currentPage || loading}
                                className={`pagination-number px-3 py-1 rounded ${
                                    page === currentPage
                                        ? 'bg-blue-900 text-white'
                                        : 'bg-blue-700 hover:bg-blue-800'
                                }`}
                                aria-current={page === currentPage ? 'page' : undefined}
                                aria-label={`Page ${page}`}
                            >
                                {page}
                            </button>
                        )
                    ))}
                </div>

                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages || loading}
                    className="pagination-button disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer opacity-75 not-disabled:hover:opacity-100"
                    aria-label="Next page"
                >
                    Next
                </button>
            </div>
        );
    };

    return (
        <main className="flex flex-col justify-center items-center mt-48 px-4">
            <form onSubmit={(e) => handleSearch(e, 1)} className="search flex flex-col gap-8 items-center w-full max-w-3xl">
                <div className="search__box w-full">
                    <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search For NASA media..."
                        className="search-input px-4 w-full"
                        type="text"
                    />
                </div>
                <div className="search__options text-4xl flex flex-wrap justify-center gap-3">
                    <div className="search__option">
                        <input
                            className="option-input"
                            type="checkbox"
                            name="audio"
                            id="audio"
                            value="audio"
                            checked={searchType.includes('audio')}
                            onChange={() => handleType('audio')}
                        />
                        <label htmlFor="audio">Audio</label>
                    </div>
                    <div className="search__option">
                        <input
                            className="option-input"
                            type="checkbox"
                            name="image"
                            id="image"
                            value="image"
                            checked={searchType.includes('image')}
                            onChange={() => handleType('image')}
                        />
                        <label htmlFor="image">Image</label>
                    </div>
                    <div className="search__option">
                        <input
                            className="option-input"
                            type="checkbox"
                            name="video"
                            id="video"
                            value="video"
                            checked={searchType.includes('video')}
                            onChange={() => handleType('video')}
                        />
                        <label htmlFor="video">Video</label>
                    </div>
                </div>
                <button
                    type="submit"
                    className="search-button px-6 py-2 rounded"
                    disabled={loading || !query.trim()}
                >
                    {loading ? 'Searching...' : 'Search'}
                </button>
            </form>

            {results.length > 0 && !loading && (
                <div className="search-results-info text-center">
                    <h2 className="text-2xl">
                        {totalResults > 0
                            ? `Found ${totalResults.toLocaleString()} results for "${lastSearchedQuery}"`
                            : `Results for "${lastSearchedQuery}"`
                        }
                    </h2>
                    {totalPages > 1 && (
                        <p className="text-gray-500 mt-2">
                            Page {currentPage} of {totalPages}
                        </p>
                    )}
                </div>
            )}

            <div className="results grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-16 gap-x-8 w-full max-w-7xl">
                {loading && (
                    <div className="loading flex gap-4 items-center text-6xl col-span-full justify-center py-16">
                        <div role="status">
                            <svg aria-hidden="true"
                                 className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                                 viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                    fill="currentColor"/>
                                <path
                                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                    fill="currentFill"/>
                            </svg>
                            <span className="sr-only">Loading</span>
                        </div>
                        <span>Searching NASA archives...</span>
                    </div>
                )}

                {error && !loading && (
                    <div className="error text-center col-span-full py-16">
                        <p className="text-red-500 text-2xl mb-4">{error}</p>
                        <p>Please try adjusting your search terms or filters.</p>
                    </div>
                )}

                {!loading && results.length === 0 && lastSearchedQuery && !error && (
                    <div className="no-results text-center col-span-full py-16">
                        <p className="text-xl mb-4">No results found for "{lastSearchedQuery}"</p>
                        <p>Try different search terms or filters.</p>
                    </div>
                )}

                {!loading && results.map((item, index) => (
                    <Link
                        to={`/search/${encodeURIComponent(item.data[0].title)}`}
                        onClick={() => {
                            let itemType = "image";

                            if (item.data[0].media_type) {
                                itemType = item.data[0].media_type;
                            }
                            else if (searchType.length === 1) {
                                itemType = searchType[0];
                            }

                            setArticle(item, itemType);
                        }}
                        className="cursor-pointer flex flex-col gap-6 items-center text-center h-full transition-transform hover:scale-105"
                        key={`${index}-${item.data?.[0]?.nasa_id || ''}`}
                    >
                        <div className="result-image overflow-hidden rounded-lg aspect-video w-full relative">
                            {item.links && item.links[0]?.href ? (
                                <img
                                    src={item.links[0].href}
                                    alt={item.data?.[0]?.title || 'NASA media'}
                                    className="w-full h-full object-cover"
                                    loading="lazy"
                                />
                            ) : (
                                <img
                                    src={audioImage}
                                    alt={item.data?.[0].title || 'NASA media'}
                                    className="w-full h-full bg-gray-200 flex items-center justify-center">
                                </img>
                            )}

                            {item.data?.[0]?.media_type && (
                                <div className="article-type__tag absolute top-2 right-2 bg-blue-600 text-white rounded text-xs">
                                    {item.data[0].media_type}
                                </div>
                            )}
                        </div>

                        <div className="result-info flex flex-col gap-2 flex-grow">
                            <h3 className="text-[2.4rem] font-semibold line-clamp-2">{item.data?.[0]?.title || 'Untitled'}</h3>
                            <p className="date text-[1.2rem] mt-auto">{item.data?.[0]?.date_created?.split('T')[0]}</p>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Pagination component */}
            {renderPagination()}
        </main>
    );
};

export default SearchPage;