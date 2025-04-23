import { useState, useCallback, useEffect } from 'react';
import gsap from 'gsap';
import { CustomEase } from 'gsap/all';
import SplitType from 'split-type';

/**
 * Custom hook for managing GSAP animations
 * @returns {Object} Animation-related state and functions
 */
export const useAnimation = () => {
    const [hasAnimationPlayed, setHasAnimationPlayed] = useState(false);

    // Register GSAP plugins
    useEffect(() => {
        gsap.registerPlugin(CustomEase);
        CustomEase.create("hop", "0.9, 0, 0.1, 1");
    }, []);

    // Initialize the animation
    const initAnimation = useCallback(() => {
        // Skip animation if it has already played
        if (hasAnimationPlayed) {
            skipToFinalState();
            return;
        }

        // Create the animation
        setupInitialStates();
        createAnimationTimelines();
        setHasAnimationPlayed(true);
    }, [hasAnimationPlayed]);

    // Set up initial states for animation
    const setupInitialStates = useCallback(() => {
        gsap.set("nav", {
            y: "-125%",
        });

        const introCopy = new SplitType(".intro-copy h3", {
            type: "words",
            absolute: false,
        });

        const titleHeading = new SplitType(".title h1", {
            type: "words",
            absolute: false,
        });

        if (introCopy && introCopy.words) {
            gsap.set(introCopy.words, {
                y: "110%",
            });
        }

        if (titleHeading && titleHeading.words) {
            gsap.set(titleHeading.words, {
                y: "500%",
            });
        }

        gsap.set(".img", {
            clipPath: "polygon(0 0, 0 0, 0 0, 0 0)",
        });

        gsap.set(".img img", {
            objectFit: "cover",
            width: "100%",
            height: "100%"
        });

        gsap.set(".banner-image", {
            top: "45%",
            transform: "translate(-50%, -50%) scale(0)",
            width: "20%",
            aspectRatio: "4/5"
        });

        gsap.set(".banner-image-1", {
            left: "50%"
        });

        gsap.set(".banner-image-2", {
            left: "50%"
        });

        gsap.set(".banner-image img", {
            objectFit: "cover",
            width: "100%",
            height: "100%"
        });
    }, []);

    // Create animation timelines
    const createAnimationTimelines = useCallback(() => {
        const overlayTimeline = gsap.timeline();
        const imagesTimeline = gsap.timeline();
        const textTimeline = gsap.timeline();

        // Overlay animations
        overlayTimeline.to(".logo-line-1", {
            backgroundPosition: "0% 0%",
            color: "#fff",
            duration: 1,
            ease: "none",
            delay: 0.5,
            onComplete: () => {
                gsap.to(".logo-line-2", {
                    backgroundPosition: "0% 0%",
                    color: "#fff",
                    duration: 1,
                    ease: "none"
                });
            },
        });

        overlayTimeline.to([".projects__header", ".project-item"], {
            opacity: 1,
            duration: 0.15,
            stagger: 0.075,
            delay: 1,
            onComplete: () => {
                startImageRotation();
            }
        });

        // Add more animation timeline code here
        // ...

        // Skip to final animation state for returning users
        const skipToFinalState = () => {
            gsap.set(".overlay", { opacity: 0, display: "none" });
            gsap.set(".img", { clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)" });
            gsap.set(".hero-img", { y: -20 });
            gsap.set("nav", { y: "0%" });
            gsap.set(".banner-image-1", { left: "40%", scale: 1 });
            gsap.set(".banner-image-2", { left: "60%", scale: 1 });

            const introCopy = new SplitType(".intro-copy h3", {
                type: "words",
                absolute: false,
            });

            const titleHeading = new SplitType(".title h1", {
                type: "words",
                absolute: false,
            });

            if (titleHeading && titleHeading.words) {
                gsap.set(titleHeading.words, { y: "0%" });
            }

            if (introCopy && introCopy.words) {
                gsap.set(introCopy.words, { y: "0%" });
            }
        };

        // Start image rotation animation
        const startImageRotation = () => {
            // Implementation depends on your image sources
            console.log("Starting image rotation animation");
        };
    }, []);

    // Skip to final animation state
    const skipToFinalState = useCallback(() => {
        gsap.set(".overlay", { opacity: 0, display: "none" });
        gsap.set(".img", { clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)" });
        gsap.set(".hero-img", { y: -20 });
        gsap.set("nav", { y: "0%" });
        gsap.set(".banner-image-1", { left: "40%", scale: 1 });
        gsap.set(".banner-image-2", { left: "60%", scale: 1 });

        const introCopy = new SplitType(".intro-copy h3", {
            type: "words",
            absolute: false,
        });

        const titleHeading = new SplitType(".title h1", {
            type: "words",
            absolute: false,
        });

        if (titleHeading && titleHeading.words) {
            gsap.set(titleHeading.words, { y: "0%" });
        }

        if (introCopy && introCopy.words) {
            gsap.set(introCopy.words, { y: "0%" });
        }
    }, []);

    // Clean up GSAP animations
    useEffect(() => {
        return () => {
            gsap.killTweensOf("*");
        };
    }, []);

    return {
        hasAnimationPlayed,
        setHasAnimationPlayed,
        initAnimation,
        skipToFinalState
    };
};