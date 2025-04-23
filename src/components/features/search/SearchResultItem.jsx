import { Link } from 'react-router-dom';

const SearchResultItem = ({
                              item,
                              onSelect,
                              baseUrl = '/NASA-Project/search'
                          }) => {
    const determineMediaType = () => {
        if (item.data?.[0]?.media_type) {
            return item.data[0].media_type;
        }
        return 'image';
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        return dateString.split('T')[0];
    };

    const truncateDescription = (text, maxLength = 100) => {
        if (!text) return '';
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    };

    const handleSelect = () => {
        if (onSelect) {
            onSelect(item, determineMediaType());
        }
    };

    return (
        <Link
            to={`${baseUrl}/${encodeURIComponent(item.data?.[0]?.title || 'Untitled')}`}
            onClick={handleSelect}
            className="cursor-pointer flex flex-col gap-6 items-center text-center h-full transition-transform hover:scale-105"
        >
            <div className="result-image-container relative w-full overflow-hidden rounded-lg aspect-video">
                {item.links && item.links[0]?.href ? (
                    <img
                        src={item.links[0].href}
                        alt={item.data?.[0]?.title || 'NASA media'}
                        className="w-full h-full object-cover"
                        loading="lazy"
                    />
                ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <span>No preview available</span>
                    </div>
                )}

                {item.data?.[0]?.media_type && (
                    <div className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded text-xs">
                        {item.data[0].media_type}
                    </div>
                )}
            </div>

            <div className="result-info flex flex-col gap-2 flex-grow">
                <h3 className="text-lg font-semibold line-clamp-2">
                    {item.data?.[0]?.title || 'Untitled'}
                </h3>

                <p className="text-sm text-gray-400 line-clamp-3">
                    {truncateDescription(item.data?.[0]?.description)}
                </p>

                <p className="date text-xs mt-auto">
                    {formatDate(item.data?.[0]?.date_created)}
                </p>
            </div>
        </Link>
    );
};

export default SearchResultItem;
