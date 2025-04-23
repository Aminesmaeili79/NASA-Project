import React, { createContext, useState, useContext } from 'react';

// Create context
const AnimationContext = createContext();

/**
 * Provider component for animation context
 */
export const AnimationProvider = ({ children }) => {
    const [hasAnimationPlayed, setHasAnimationPlayed] = useState(false);

    // Context value
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

/**
 * Custom hook to use animation context
 */
export const useAnimation = () => {
    const context = useContext(AnimationContext);

    if (context === undefined) {
        throw new Error('useAnimation must be used within an AnimationProvider');
    }

    return context;
};