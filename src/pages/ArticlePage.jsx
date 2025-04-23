import { useContext, useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArticleContext } from '../context/ArticleContext';
import { nasaApi } from "../services/nasaApi";
import ArticleHeader from '../components/features/article/ArticleHeader';
import ArticleContent from '../components/features/article/ArticleContent';
import ArticleMedia from '../components/features/article/ArticleMedia';

const ArticlePage = () => {
    const { article, articleType, setArticle, setArticleType } = useContext(ArticleContext);
    const { title } = useParams();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isFullContext, setIsFullContext] = useState(false);
    const articleContextRef = useRef(null);
    const navigate = useNavigate();

    const handleFullContext = () => {
        setIsFullContext(prev => !prev);
        if (articleContextRef.current) {
            articleContextRef.current.classList.toggle("context-hidden");
        }
    };

    useEffect(() => {
        const fetchArticleByTitle = async () => {
            if (!article && title) {
                setLoading(true);
                try {
                    const searchResult = await nasaApi.searchMedia(title, "");

                    if (searchResult?.collection?.items?.length > 0) {
                        const matchingItem = searchResult.collection.items.find(
                            item => item.data?.[0]?.title === decodeURIComponent(title)
                        );

                        if (matchingItem) {
                            let itemType = "image";
                            if (matchingItem.data[0].media_type) {
                                itemType = matchingItem.data[0].media_type;
                            }

                            setArticle(matchingItem, itemType);
                        } else {
                            setError("Couldn't find the exact article");
                        }
                    } else {
                        setError("No results found");
                    }
                } catch (err) {
                    console.error("Error fetching article:", err);
                    setError("Failed to fetch article data");
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchArticleByTitle();
    }, [article, title, setArticle]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <div className="loading flex gap-4 items-center text-4xl">
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
                        <span className="sr-only">Loading...</span>
                    </div>Loading article...
                </div>
            </div>
        );
    }

    if (error || !article) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <h2 className="text-4xl mb-4">Article not found</h2>
                <p>{error || "The article you're looking for is not available."}</p>
                <button
                    onClick={() => navigate('/NASA-Project/search')}
                    className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Return to Search
                </button>
            </div>
        );
    }

    // Set initial state for the article context
    useEffect(() => {
        if (articleContextRef.current) {
            articleContextRef.current.classList.add("context-hidden");
        }
    }, [article]);

    return (
        <main className="article-container flex flex-col items-center justify-center min-h-screen py-16 px-4">
            <div className="flex flex-col gap-4 max-w-6xl w-full mx-auto">
                <ArticleHeader
                    title={article.data[0].title}
                    date={article.data[0].date_created}
                />

                <div className="flex flex-col items-center mb-8">
                    <ArticleMedia
                        articleData={article}
                        mediaType={articleType}
                        title={article.data[0].title}
                    />
                </div>

                <div ref={articleContextRef} className="article-context prose lg:prose-xl max-w-full text-[1.8rem]">
                    <p>{article.data[0].description}</p>
                </div>

                {article.data[0].description && article.data[0].description.length > 300 && (
                    <p onClick={handleFullContext} className="text-gray-600 text-[2rem] cursor-pointer text-center">
                        {isFullContext ? "Show less" : "Show more..."}
                    </p>
                )}

                {article.data[0].keywords && article.data[0].keywords.length > 0 && (
                    <div className="keywords mt-8">
                        <h3 className="text-[2.2rem] mb-2">Keywords:</h3>
                        <div className="flex flex-wrap gap-2">
                            {article.data[0].keywords.map((keyword, index) => (
                                <span key={index} className="px-3 py-1 rounded-full text-[1.6rem]">
                                    {keyword}{index < article.data[0].keywords.length - 1 ? "," : ""}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
};

export default ArticlePage;