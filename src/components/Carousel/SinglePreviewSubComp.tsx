import { useEffect, useRef, useState } from "react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

interface SinglePreviewProps {
    arrayPictures: Image[]
    singlePicsIndx: number
    onSelectPicture: (index: number) => void
    onDirectionChange: (direction: "left" | "right") => void
}

interface Image {
    src: string
    alt: string
    extraCaption: string | null
}
const SinglePreviewSubComp = (props: SinglePreviewProps) => {
    const { arrayPictures, singlePicsIndx, onSelectPicture, onDirectionChange } = props
    const [picShowing, setPicShowing] = useState<number>(0) 
    const previewRef = useRef<HTMLDivElement>(null)
    const imgRefs = useRef<Array<HTMLImageElement | null>>(arrayPictures.map(() => null));

    const handleScrolling = (direction: "left" | "right") => {
        if (previewRef.current) {
            const scrollAmount = 300 // Adjust this for desired scroll distance
            const newScrollPosition = direction === 'left'
            ? previewRef.current.scrollLeft - scrollAmount
            : previewRef.current.scrollLeft + scrollAmount;

            // Smooth scroll to the new position
            previewRef.current.scrollTo({
                left: newScrollPosition,
                behavior: 'smooth'
            })
        }
    }

    useEffect(() => {
        const targetImg = imgRefs.current[picShowing]
        const container = previewRef.current

        if (targetImg && container) {
            const targetRect = targetImg.getBoundingClientRect()
            const containerRect = container.getBoundingClientRect()

            // Check if the image is partially visible (either out of left or right bounds)
            const isPartiallyVisible =
                targetRect.left < containerRect.left || targetRect.right > containerRect.right

            // Scroll only if the image is partially visible
            if (isPartiallyVisible) {
                targetImg.scrollIntoView({
                    behavior: "smooth",
                    block: "nearest", // Vertical alignment
                    inline: "center", // Horizontal alignment
                })
            }
        }
    }, [picShowing])

    return (
        <div className='carouselPreview' ref={previewRef}>
            <button 
                className="previewScrollIcons left"
                onClick={() => { handleScrolling('left')}}
                tabIndex={0}
            >
                <FontAwesomeIcon 
                    icon={faChevronLeft} 
                    size="3x"  
                />
            </button>
            <div className="allPics">
                {
                    arrayPictures.map((img, index) => (
                        
                            <img
                                key={index}
                                src={`${process.env.PUBLIC_URL}${img.src.startsWith('/') ? '' : '/'}${img.src}`}
                                alt={img.alt}
                                onClick={() => {
                                    onDirectionChange(index < singlePicsIndx ? 'left' : 'right')
                                    onSelectPicture(index)
                                    setPicShowing(index)
                                }}
                                tabIndex={0}
                                onKeyDown={(event) => {
                                    if (event.key === 'Enter') {
                                        onDirectionChange(index < singlePicsIndx ? 'left' : 'right')
                                        onSelectPicture(index)
                                        setPicShowing(index)
                                    }
                                }}
                                className={picShowing === index ? "active" : ""}
                                ref={(el) => (imgRefs.current[index] = el)}
                                id={`img-${index}`}
                            />
                        
                    ))
                }
            </div> 
            <button 
                className="previewScrollIcons right"
                onClick={() => { handleScrolling('right')}}
                tabIndex={0}
            >
                <FontAwesomeIcon 
                    icon={faChevronRight} 
                    size="3x" 
                />
            </button>
        </div>
    )
}

export default SinglePreviewSubComp