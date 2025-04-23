import React, { createContext, useState, useEffect } from 'react';

export const ArticleContext = createContext();

export const ArticleProvider = ({ children }) => {
    const [article, setArticle] = useState(() => {
        const savedArticle = localStorage.getItem('nasaArticle');
        return savedArticle ? JSON.parse(savedArticle) : null;
    });

    const [articleType, setArticleType] = useState(() => {
        const savedType = localStorage.getItem('nasaArticleType');
        return savedType || "";
    });

    useEffect(() => {
        if (article) {
            localStorage.setItem('nasaArticle', JSON.stringify(article));
        }
    }, [article]);

    useEffect(() => {
        if (articleType) {
            localStorage.setItem('nasaArticleType', articleType);
        }
    }, [articleType]);

    const handleSetArticle = (newArticle, type) => {
        setArticle(newArticle);
        if (type) {
            setArticleType(type);
        }
    };

    return (
        <ArticleContext.Provider value={{
            article,
            articleType,
            setArticle: handleSetArticle,
            setArticleType
        }}>
            {children}
        </ArticleContext.Provider>
    );
};