import { useEffect, useState } from "react";
import { useTransition, animated } from "@react-spring/web";
import { easings } from "@react-spring/web"; // Import easings for smoother transitions
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import AllPics from './services/service.carousel-images-data.json' 
import AllPicsSingleFolder from './services/service.single-folder-carousel-images-data.json' 
import './carousel.scss'
import { publicUrl } from '../../utils/publicUrl'

import SinglePreviewSubComp from "./SinglePreviewSubComp";

interface CarouselProps {
    id?: string
    className?: string
    type: "multi-folder" | "single-folder" | "single-preview"
}

interface Image {
    src: string,
    alt: string,
    extraCaption: string | null
}


const Carousel = (props: CarouselProps) => {
    const [folderPicsIndx, setFolderPicsIndx] = useState<number>(0)
    const [singlePicsIndx, setSinglePicsIndx] = useState<number>(0)
    const [transitionDirection, setTransitionDirection] = useState< "left" | "right" >('left')
    
    const carouselType = props.type
    const isMultifolder = carouselType === "multi-folder"
    let objTransition = {}

    useEffect(()=> {
        setFolderPicsIndx(0)
        setSinglePicsIndx(0)
    },[props.type])

    
    const picturesToUse = isMultifolder ? AllPics[folderPicsIndx] : AllPicsSingleFolder
    const imagesLength = picturesToUse?.images?.length || 0
    const currentImage: Image | undefined = picturesToUse?.images[singlePicsIndx] 
    
    const handleScrolling = (direction: "left" | "right") => {
        if (props.type === "single-folder") { setTransitionDirection(direction) }

        setSinglePicsIndx((prev) => {
            if (direction === 'left') {
                return prev > 0 ? prev - 1 : prev
            } else {
                return prev < imagesLength - 1 ? prev + 1 : prev
            }
        })
    }

    isMultifolder ? 
        ( objTransition = {
            from: { opacity: 0, height: '0%', width: '0%' },
            enter: { opacity: 1, height: '100%', width: '100%' },
            leave: { opacity: 0, height: '0%', width: '0%' },
            config: {
                duration: 400, // Slightly longer duration for smoother effect
                easing: easings.easeInOutQuad // Smoother easing function
            }
        }) 
        :
        ( objTransition = {
            from: { 
                opacity: 1, 
                height: '100%', 
                width: '100%', 
                transform: transitionDirection === 'right' ? 'translateX(100%)' : 'translateX(-100%)' 
            },
            enter: { 
                opacity: 1, 
                height: '100%', 
                width: '100%', 
                transform: 'translateX(0%)' 
            },
            leave: { 
                opacity: 1, 
                height: '100%', 
                width: '100%', 
                transform: transitionDirection === 'right' ? 'translateX(-100%)' : 'translateX(100%)' 
            },
            config: {
                duration: 400, // Slightly longer duration for smoother effect
                easing: easings.easeInOutQuad // Smoother easing function
            }
        })

    const picturesTransitions = useTransition(currentImage, {
        ...objTransition,
        keys: singlePicsIndx // Ensures unique key for transitions
    })

    return (
        <div 
            className={`carouselFrame ${props.className || ''}`}
            id={props.id}
        >
            <div className="carouselContent">
                {
                    /** Show folder Section is the type is multi-folder */
                    carouselType === "multi-folder" && 
                    <div 
                        className="multiFoldersBtnsSection"
                        tabIndex={0}
                    >
                        {AllPics.map((folder,index) => {
                            return (
                                <button 
                                    className={folderPicsIndx === index ? "carouselBtnFold active" : "carouselBtnFold"}
                                    key={index} 
                                    onClick={() => {
                                        setFolderPicsIndx(index)
                                        setSinglePicsIndx(0)
                                    }}
                                    tabIndex={0}
                                >
                                    {folder.name}
                                </button>
                            )
                        })}
                    </div>
                }

                <div 
                    className={`carouselPictures ${!isMultifolder ? "fullWidth" : ""}`}
                    onKeyDown={(event) => {
                        if (carouselType !== "single-preview") {

                            if (event.key === "ArrowLeft") {
                                handleScrolling('left')
                            }
                            if (event.key === "ArrowRight") {
                                handleScrolling('right')
                            }
                        }
                    }}
                    tabIndex={0}
                >
                    {
                        carouselType !== "single-preview" && singlePicsIndx !== 0 &&
                        <button 
                            className="carouselScrollIcon left"
                            onClick={() => { handleScrolling('left')}}
                        >
                            <FontAwesomeIcon 
                                icon={faChevronLeft} 
                                size="3x"  
                            />
                        </button>
                    }
                    {
                        picturesTransitions((style, item) =>
                            item ? (
                                <animated.div 
                                    className="animatedPic"
                                    style={style}
                                >
                                    <img
                                        className='carouselSinglePic'
                                        src={publicUrl(item.src)}
                                        alt={item.alt}
                                    />
                                </animated.div>
                            ) : null
                        )
                    }
                    {
                        carouselType !== "single-preview" && singlePicsIndx + 1 < imagesLength  &&
                        <button 
                            className="carouselScrollIcon right"
                            onClick={() => { handleScrolling('right')}}
                        >
                            <FontAwesomeIcon 
                                icon={faChevronRight} 
                                size="3x" 
                            />
                        </button>
                    }       
                    { currentImage?.extraCaption && (
                        <p className='picCaption'>{currentImage?.extraCaption}</p>
                    )}
                </div>
            </div>
            {
                carouselType === "single-preview" ? 
                (
                    <SinglePreviewSubComp
                        arrayPictures={picturesToUse.images}
                        singlePicsIndx={singlePicsIndx}
                        onSelectPicture={(index) => setSinglePicsIndx(index)}
                        onDirectionChange={(direction) => setTransitionDirection(direction)}
                    ></SinglePreviewSubComp>
                ) : null
            }
        </div>
    )
}
export default Carousel