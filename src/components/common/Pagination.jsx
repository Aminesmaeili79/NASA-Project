export const Pagination = ({
                               currentPage,
                               totalPages,
                               onPageChange,
                               siblingCount = 1
                           }) => {
    // Helper functions
    const range = (start, end) => {
        let length = end - start + 1;
        return Array.from({ length }, (_, idx) => idx + start);
    };

    // Generate page numbers to display
    const generatePageNumbers = () => {
        // Always show first page, last page, current page, and pages around current
        const firstPage = 1;
        const lastPage = totalPages;

        // Calculate range around current page
        let startPage = Math.max(firstPage, currentPage - siblingCount);
        let endPage = Math.min(lastPage, currentPage + siblingCount);

        // Collect page numbers
        const pageNumbers = [];

        // Add first page
        if (firstPage < startPage) {
            pageNumbers.push(firstPage);

            // Add ellipsis if needed
            if (startPage > firstPage + 1) {
                pageNumbers.push('...');
            }
        }

        // Add range around current page
        pageNumbers.push(...range(startPage, endPage));

        // Add last page
        if (lastPage > endPage) {
            // Add ellipsis if needed
            if (endPage < lastPage - 1) {
                pageNumbers.push('...');
            }

            pageNumbers.push(lastPage);
        }

        return pageNumbers;
    };

    // If there's only one page, don't show pagination
    if (totalPages <= 1) {
        return null;
    }

    return (
        <nav className="flex justify-center mt-8">
            <ul className="flex items-center space-x-1">
                {/* Previous button */}
                <li>
                    <button
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage <= 1}
                        className="pagination-button rounded-md
                       bg-gray-200 text-gray-700
                       disabled:opacity-50 disabled:cursor-not-allowed
                       hover:bg-gray-300"
                        aria-label="Previous page"
                    >
                        &laquo;
                    </button>
                </li>

                {/* Page numbers */}
                {generatePageNumbers().map((page, index) => (
                    <li key={`page-${index}`}>
                        {page === '...' ? (
                            <span className="px-3 py-1">...</span>
                        ) : (
                            <button
                                onClick={() => onPageChange(page)}
                                className={`pagination-number rounded-md
                           ${currentPage === page
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                                aria-current={currentPage === page ? 'page' : undefined}
                                aria-label={`Page ${page}`}
                            >
                                {page}
                            </button>
                        )}
                    </li>
                ))}

                {/* Next button */}
                <li>
                    <button
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage >= totalPages}
                        className="pagination-button rounded-md
                       bg-gray-200 text-gray-700
                       disabled:opacity-50 disabled:cursor-not-allowed
                       hover:bg-gray-300"
                        aria-label="Next page"
                    >
                        &raquo;
                    </button>
                </li>
            </ul>
        </nav>
    );
};