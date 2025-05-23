import img1 from '../assets/img-1.jpg';
import img2 from '../assets/img-2.webp';
import img3 from '../assets/img-3.jpg';
import img4 from '../assets/img-4.jpg';
import imgHero from '../assets/img-hero.png';
import img5 from '../assets/img-5.webp';
import img6 from '../assets/img-6.jpg';
import img7 from '../assets/img-7.png';
import img8 from '../assets/img-8.webp';
import img9 from '../assets/img-11.jpg';
import img10 from '../assets/img-12.webp';

import gsap from "gsap";
import { CustomEase } from "gsap/all";
import SplitType from "split-type";
import { projectsData } from "../services/projects.js";
import {useAnimation} from "../context/AnimationContext.jsx";
import {useEffect} from "react";

const LandingPage = () => {
    const { hasAnimationPlayed, setHasAnimationPlayed } = useAnimation();

    useEffect(() => {

        gsap.registerPlugin(CustomEase);
        CustomEase.create("hop", "0.9, 0, 0.1, 1");

        const projectsContainer = document.querySelector(".projects");
        const locationsContainer = document.querySelector(".locations");
        const gridImages = gsap.utils.toArray(".img");
        const heroImage = document.querySelector(".img.hero-img");
        const images = gridImages.filter((img) => img != heroImage);
        const introCopy = new SplitType(".intro-copy h3", {
            type: "words",
            absolute: false,
        });

        const titleHeading = new SplitType(".title h1", {
            type: "words",
            absolute: false,
        });

        const allImageSources = [
            img1, img2, img3, img4, img5, img6, img7, img8, img9, img10
        ];

        const getRandomImageSet = () => {
            const shuffled = [...allImageSources].sort(() => 0.5 - Math.random());
            return shuffled.slice(0, 9);
        };

        function startImageRotation() {
            const totalCycles = 25;

            for (let cycle = 0; cycle < totalCycles; cycle++) {
                const randomImages = getRandomImageSet();
                gsap.to(
                    {},
                    {
                        duration: 3,
                        delay: cycle * 0.075,
                        onComplete: () => {
                            gridImages.forEach((img, index) => {
                                if (index < randomImages.length) {
                                    const imgElement = img.querySelector("img");

                                    if (cycle === totalCycles - 1 && img === heroImage) {
                                        imgElement.src = imgHero;
                                    } else {
                                        imgElement.src = randomImages[index];
                                    }
                                }
                            });
                        },
                    }
                );
            }
        }

        function initializeDynamicContent() {
            if (projectsData && projectsContainer) {
                projectsData.forEach((project) => {
                    const projectItem = document.createElement("div");
                    projectItem.className = "project-item";
                    const projectName = document.createElement("p");
                    projectName.textContent = project.name;
                    const directorName = document.createElement("p");
                    directorName.textContent = project.director;
                    projectItem.appendChild(projectName);
                    projectItem.appendChild(directorName);
                    projectsContainer.appendChild(projectItem);
                });
            }

            if (projectsData && locationsContainer) {
                projectsData.forEach((project) => {
                    const locationItem = document.createElement("div");
                    locationItem.className = "location-item";
                    const locationName = document.createElement("p");
                    locationName.textContent = project.location;
                    locationItem.appendChild(locationName);
                    locationsContainer.appendChild(locationItem);
                });
            }
        }

        function setupInitialStates() {
            gsap.set("nav", {
                y: "-125%",
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
        }

        function createAnimationTimelines() {
            const overlayTimeline = gsap.timeline();
            const imagesTimeline = gsap.timeline();
            const textTimeline = gsap.timeline();

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

            overlayTimeline.to(
                [".locations__header", ".location-item"],
                {
                    opacity: 1,
                    duration: 0.15,
                    stagger: 0.075,
                },
                "<"
            );

            overlayTimeline.to(".project-item", {
                color: "#fff",
                duration: 0.15,
                stagger: 0.075,
            });

            overlayTimeline.to(
                ".location-item",
                {
                    color: "#fff",
                    duration: 0.15,
                    stagger: 0.075,
                },
                "<"
            );

            overlayTimeline.to([".projects__header", ".project-item"], {
                opacity: 0,
                duration: 0.15,
                stagger: 0.075,
            });

            overlayTimeline.to(
                [".locations__header", ".location-item"],
                {
                    opacity: 0,
                    duration: 0.15,
                    stagger: 0.075
                },
                "<",
            );

            overlayTimeline.to(".overlay", {
                opacity: 0,
                duration: 0.5,
                delay: 1.5,
                onComplete: () => {
                    gsap.set(".overlay", { display: "none" });
                }
            });

            imagesTimeline.to(".img", {
                clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
                duration: 1,
                delay: 3,
                stagger: 0.05,
                ease: "hop",
                onStart: () => {
                    gsap.to(".loader", {
                        opacity: 0,
                        duration: 0.3
                    });
                },
            });

            imagesTimeline.to(images, {
                clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
                duration: 1,
                delay: 2.5,
                stagger: 0.05,
                ease: "hop",
            });

            imagesTimeline.to(".hero-img", {
                y: -20,
                duration: 1,
                ease: "hop",
            });

            imagesTimeline.to("nav", {
                y: "0%",
                duration: 1,
                ease: "hop",
                delay: 0.5
            });

            imagesTimeline.to(".banner-image-1", {
                left: "40%",
                scale: 1,
                duration: 1,
                ease: "power2.out",
                delay: 1
            });

            imagesTimeline.to(".banner-image-2", {
                left: "60%",
                scale: 1,
                duration: 1,
                ease: "power2.out",
            }, "<0.2");

            textTimeline.to(titleHeading.words, {
                y: "0%",
                duration: 1,
                stagger: 0.5,
                delay: 6,
                ease: "power3.out",
            });

            textTimeline.to(
                introCopy.words,
                {
                    y: "0%",
                    duration: 5,
                    stagger: 0.2,
                    delay: 3,
                    ease: "power3.out",
                },
                "<"
            );
        }

        function init() {
            initializeDynamicContent();
            setupInitialStates();

            if (!hasAnimationPlayed) {
                createAnimationTimelines();
                setHasAnimationPlayed(true);
            } else {
                skipToFinalState();
            }
        }

        function skipToFinalState() {
            gsap.set(".overlay", { opacity: 0, display: "none" });
            gsap.set(".img", { clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)" });
            gsap.set(images, { clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)" });
            gsap.set(".hero-img", { y: -20 });
            gsap.set("nav", { y: "0%" });
            gsap.set(".banner-image-1", { left: "40%", scale: 1 });
            gsap.set(".banner-image-2", { left: "60%", scale: 1 });

            if (titleHeading && titleHeading.words) {
                gsap.set(titleHeading.words, { y: "0%" });
            }

            if (introCopy && introCopy.words) {
                gsap.set(introCopy.words, { y: "0%" });
            }
        }

        init();



        return () => {
            gsap.killTweensOf("*");
        };
    }, []);

    return (
        <>
            <div className="overlay">
                <div className="projects">
                    <div className="projects__header">
                        <p>Projects</p>
                        <p>By</p>
                    </div>
                </div>
                <div className="loader">
                    <h1 className="logo-line-1">NASA</h1>
                    <h1 className="logo-line-2">PROJECT</h1>
                </div>
                <div className="locations">
                    <div className="locations__header">
                        <p>Locations</p>
                    </div>
                </div>
            </div>

            <div className="image-grid">
                <div className="grid-row">
                    <div className="img"><img src={img1} alt="" /></div>
                    <div className="img"><img src={img2} alt="" /></div>
                    <div className="img"><img src={img3} alt="" /></div>
                </div>
                <div className="grid-row">
                    <div className="img"><img src={img4} alt="" /></div>
                    <div className="img hero-img"><img src={imgHero} alt="" /></div>
                    <div className="img"><img src={img5} alt="" /></div>
                </div>
                <div className="grid-row">
                    <div className="img"><img src={img6} alt="" /></div>
                    <div className="img"><img src={img7} alt="" /></div>
                    <div className="img"><img src={img8} alt="" /></div>
                </div>
            </div>

            <div className="banner-image banner-image-1"><img src={img9} alt="" /></div>
            <div className="banner-image banner-image-2"><img src={img10} alt="" /></div>

            <div className="intro-copy text-large">
                <h3>Creative Scientists</h3>
                <h3>Build The Future</h3>
            </div>

            <div className="title">
                <h1><a href="https://www.nasa.gov/">Find Out More About NASA</a></h1>
            </div>
        </>
    );
};

export default LandingPage;