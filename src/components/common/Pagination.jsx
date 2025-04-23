export const Pagination = ({
                               currentPage,
                               totalPages,
                               onPageChange,
                               siblingCount = 1
                           }) => {
    const range = (start, end) => {
        let length = end - start + 1;
        return Array.from({ length }, (_, idx) => idx + start);
    };

    const generatePageNumbers = () => {
        const firstPage = 1;
        const lastPage = totalPages;

        let startPage = Math.max(firstPage, currentPage - siblingCount);
        let endPage = Math.min(lastPage, currentPage + siblingCount);

        const pageNumbers = [];

        if (firstPage < startPage) {
            pageNumbers.push(firstPage);

            if (startPage > firstPage + 1) {
                pageNumbers.push('...');
            }
        }

        pageNumbers.push(...range(startPage, endPage));

        if (lastPage > endPage) {
            if (endPage < lastPage - 1) {
                pageNumbers.push('...');
            }

            pageNumbers.push(lastPage);
        }

        return pageNumbers;
    };

    if (totalPages <= 1) {
        return null;
    }

    return (
        <nav className="flex justify-center mt-8">
            <ul className="flex items-center space-x-1">
                <li className="pagination-button">
                    <button
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage <= 1}
                        className=" rounded-md
                       bg-gray-200 text-gray-700
                       disabled:opacity-50 disabled:cursor-not-allowed
                       hover:bg-gray-300"
                        aria-label="Previous page"
                    >
                        &laquo;
                    </button>
                </li>

                {generatePageNumbers().map((page, index) => (
                    <li key={`page-${index}`}>
                        {page === '...' ? (
                            <span className="px-3 py-1">...</span>
                        ) : (
                            <button
                                onClick={() => onPageChange(page)}
                                className={`pagination-number rounded-md
                           ${currentPage === page
                                    ? 'bg-blue-400 text-white'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                                aria-current={currentPage === page ? 'page' : undefined}
                                aria-label={`Page ${page}`}
                            >
                                {page}
                            </button>
                        )}
                    </li>
                ))}

                <li>
                    <button
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage >= totalPages}
                        className="rounded-md
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