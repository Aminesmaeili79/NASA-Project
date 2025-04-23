import SearchResultItem from './SearchResultItem.jsx';
import { Loading } from '../../common/Loading';
import { Pagination } from '../../common/Pagination';

const SearchResults = ({
                           results,
                           loading,
                           error,
                           onSelectItem,
                           currentPage,
                           totalPages,
                           onPageChange,
                           lastSearchedQuery
                       }) => {
    if (loading) {
        return <Loading text="Searching NASA archives..." />;
    }

    if (error) {
        return (
            <div className="error text-center my-8">
                <h3 className="text-xl text-red-500 mb-2">Error</h3>
                <p>{error}</p>
            </div>
        );
    }

    if (results.length === 0 && lastSearchedQuery) {
        return (
            <div className="no-results text-center my-8">
                <h3 className="text-xl mb-2">No results found</h3>
                <p>Try different search terms or filters</p>
            </div>
        );
    }

    if (results.length === 0 && !lastSearchedQuery) {
        return null;
    }

    return (
        <div className="search-results-container">
            <div className="results-info text-center mb-6">
                <h2 className="text-xl">
                    {results.length} results for "{lastSearchedQuery}"
                </h2>
            </div>

            <div className="results grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-16 gap-x-8">
                {results.map((item, index) => (
                    <SearchResultItem
                        key={`result-${index}-${item.data?.[0]?.nasa_id || index}`}
                        item={item}
                        onSelect={onSelectItem}
                    />
                ))}
            </div>

            {totalPages > 1 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={onPageChange}
                />
            )}
        </div>
    );
};

export default SearchResults;
