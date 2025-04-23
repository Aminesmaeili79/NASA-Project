import { createContext, useState, useContext } from 'react';

const AnimationContext = createContext();

export const AnimationProvider = ({ children }) => {
    const [hasAnimationPlayed, setHasAnimationPlayed] = useState(false);

    return (
        <AnimationContext.Provider value={{ hasAnimationPlayed, setHasAnimationPlayed }}>
            {children}
        </AnimationContext.Provider>
    );
};

export const useAnimation = () => useContext(AnimationContext);