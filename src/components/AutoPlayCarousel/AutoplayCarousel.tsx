import { useEffect, useState } from 'react'
import { useTransition, animated } from "@react-spring/web";
import { easings } from "@react-spring/web"; // Import easings for smoother transitions
import allPictures from '../Carousel/services/service.single-folder-carousel-images-data.json'
import { publicUrl } from '../../utils/publicUrl'
import './AutoPlayCarousel.scss'

interface AutoplayProps {
    interval: number
    className?: string
}

const AutoplayCarousel = (props: AutoplayProps) => {

    const [currentSlide, setCurrentSlide] = useState<number>(0) 
    const [isPaused, setIsPaused] = useState<boolean>(false)

    useEffect(()=>{
        if (isPaused) return

        const slideShow = 
            setInterval(()=>{
                setCurrentSlide((currentSlide) => (currentSlide + 1) % allPictures.images.length)
            }, props.interval)

        return () => clearInterval(slideShow)

    }, [isPaused, props.interval])

    const picturesTransitions = useTransition(currentSlide, 
        {   
            from: { 
                opacity: 0.5, 
                transform: 'translateX(100%)' 
            },
            enter: { 
                opacity: 1, 
                transform: 'translateX(0%)' 
            },
            leave: { 
                opacity: 0.1,
                transform: 'translateX(-100%)' 
            },
            config: {
                duration: 500, // Slightly longer duration for smoother effect
                easing: easings.easeInOutQuad // Smoother easing function
            },
            key: currentSlide
        }
    )

    return (
        <div 
            className={`autoplayCarousel ${props.className ? props.className : ''}`}
            onClick={() => { setIsPaused(!isPaused) }}
        >
            {  
                picturesTransitions((style, index) =>
                    (
                        <animated.div  
                            key={index} 
                            style={{
                                ...style,
                                position: 'absolute', // Layer slides on top of each other
                            }}  
                            className={`autoPlaySlide`}
                        >
                            <img 
                                src={publicUrl(allPictures.images[index].src)}
                                alt={allPictures.images[index].alt}
                                onClick={() => { setIsPaused(!isPaused) }}
                                onMouseOver={() => { setIsPaused(true) }}
                                onMouseLeave={() => { setIsPaused(false) }}
                            />
                        </animated.div>
                    )
                )  
            }
        </div>
    )
}

export default AutoplayCarousel