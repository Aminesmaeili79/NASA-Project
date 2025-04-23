import { Input } from '../../common/Input';
import { Button } from '../../common/Button';

const SearchForm = ({
                        query,
                        setQuery,
                        mediaTypes,
                        toggleMediaType,
                        onSearch,
                        disabled = false
                    }) => {
    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch();
    };

    return (
        <form onSubmit={handleSubmit} className="search flex flex-col gap-8 items-center max-w-3xl mx-auto">
            <div className="search__box w-full">
                <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search For NASA media..."
                    className="search-input px-4"
                    type="text"
                    disabled={disabled}
                />
            </div>

            <div className="search__options text-4xl flex justify-center gap-3 flex-wrap">
                <div className="search__option">
                    <input
                        className="option-input"
                        type="checkbox"
                        name="audio"
                        id="audio"
                        value="audio"
                        checked={mediaTypes.includes('audio')}
                        onChange={() => toggleMediaType('audio')}
                        disabled={disabled}
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
                        checked={mediaTypes.includes('image')}
                        onChange={() => toggleMediaType('image')}
                        disabled={disabled}
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
                        checked={mediaTypes.includes('video')}
                        onChange={() => toggleMediaType('video')}
                        disabled={disabled}
                    />
                    <label htmlFor="video">Video</label>
                </div>
            </div>

            <Button
                type="submit"
                variant="primary"
                size="large"
                disabled={disabled || !query.trim()}
                className="search-button"
            >
                Search
            </Button>
        </form>
    );
};

export default SearchForm;
