const ArticleHeader = ({ title, date }) => {
    const formattedDate = date ? date.split('T')[0] : '';

    return (
        <header className="article-header text-center mb-8">
            <h1 className="text-3xl md:text-5xl font-bold mb-4 md:mb-8">{title}</h1>

            {formattedDate && (
                <p className="text-gray-600 text-base md:text-xl">
                    Date: {formattedDate}
                </p>
            )}
        </header>
    );
};

export default ArticleHeader;
