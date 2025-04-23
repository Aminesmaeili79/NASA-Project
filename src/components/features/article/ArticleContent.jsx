import { useState } from 'react';
import { Button } from '../../common/Button';

const ArticleContent = ({
                            description,
                            keywords = [],
                            initialExpanded = false
                        }) => {
    const [expanded, setExpanded] = useState(initialExpanded);

    const isLongContent = description && description.length > 300;

    const toggleExpanded = () => {
        setExpanded(!expanded);
    };

    return (
        <div className="article-content mt-4">
            <div className="description">
                <p className={`${!expanded && isLongContent ? 'line-clamp-4' : ''}`}>
                    {description || 'No description available.'}
                </p>
            </div>

            {isLongContent && (
                <div className="mt-2">
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={toggleExpanded}
                    >
                        {expanded ? 'Show Less' : 'Show More'}
                    </Button>
                </div>
            )}

            {keywords && keywords.length > 0 && (
                <div className="keywords mt-4">
                    <h4 className="text-sm font-semibold">
                        Keywords:
                    </h4>
                    <div className="flex flex-wrap gap-2 mt-1">
                        {keywords.map((keyword, index) => (
                            <span key={index} className="px-2 py-1 bg-gray-100 rounded-md text-xs">
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