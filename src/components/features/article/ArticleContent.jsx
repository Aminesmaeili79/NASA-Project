import React, { useState } from 'react';
import { Button } from '../../common/Button';

/**
 * Component to display article content/description
 */
const ArticleContent = ({
                            description,
                            keywords = [],
                            initialExpanded = false
                        }) => {
    const [expanded, setExpanded] = useState(initialExpanded);

    // Check if content is long enough to need expansion
    const isLongContent = description && description.length > 300;

    // Toggle expanded state
    const toggleExpanded = () => {
        setExpanded(!expanded);
    };

    return (
        <div className="article-content flex flex-col gap-4 max-w-4xl mx-auto">
            <div className={`prose lg:prose-xl max-w-full text-lg md:text-xl ${isLongContent && !expanded ? 'line-clamp-4' : ''}`}>
                <p>{description || 'No description available.'}</p>
            </div>

            {isLongContent && (
                <div className="text-center mt-2">
                    <Button
                        variant="outline"
                        onClick={toggleExpanded}
                        size="small"
                    >
                        {expanded ? 'Show Less' : 'Show More'}
                    </Button>
                </div>
            )}

            {keywords && keywords.length > 0 && (
                <div className="keywords mt-8">
                    <h3 className="text-xl mb-2">Keywords:</h3>
                    <div className="flex flex-wrap gap-2">
                        {keywords.map((keyword, index) => (
                            <span
                                key={`keyword-${index}`}
                                className="px-3 py-1 bg-gray-800 rounded-full text-sm"
                            >
                {keyword}
              </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ArticleContent;

