import { createContext, useState, useContext } from 'react';

const AnimationContext = createContext();

export const AnimationProvider = ({ children }) => {
    const [hasAnimationPlayed, setHasAnimationPlayed] = useState(false);

    const value = {
        hasAnimationPlayed,
        setHasAnimationPlayed
    };

    return (
        <AnimationContext.Provider value={value}>
            {children}
        </AnimationContext.Provider>
    );
};

export const useAnimation = () => {
    const context = useContext(AnimationContext);

    if (context === undefined) {
        throw new Error('useAnimation must be used within an AnimationProvider');
    }

    return context;
};