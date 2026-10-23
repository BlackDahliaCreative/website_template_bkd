import { publicUrl } from "../../utils/publicUrl"
import './timeline-story.scss'
import { slideList } from './slidesList' 
import { useState } from 'react'
import { useTransition, easings, animated } from '@react-spring/web'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons';

interface TimeLineStoryProps  {
    className?: string
}

// ./timelineStory-pictures/
const TimeLineStory = (props: TimeLineStoryProps) => {

    const [singleSlide, setSingleSlide] = useState<number>(0)
    const [upOrDown, setUpOrDown] = useState< 'up' | 'down' >()

    const getLineClass = (index: number) => {
        let classString: string = '' 

        if (index === 0) { classString = 'bottomHalf' } 
        else if (index + 1 === slideList.length) {classString = 'topHalf'}
        else {classString = ''}

        return classString
    }

    const picturesTransitions = useTransition(singleSlide, 
        {   
            from: { 
                opacity: 1, 
                transform: `${upOrDown === 'up' ? 'translateY(100%)' : 'translateY(-100%)'}` 
            },
            enter: { 
                opacity: 1, 
                transform: 'translateY(0%)' 
            },
            leave: { 
                opacity: 0,
                transform: `${upOrDown === 'down' ? 'translateY(100%)' : 'translateY(-100%)'}`
            },
            config: {
                duration: 500, // Slightly longer duration for smoother effect
                easing: easings.easeInOutQuad // Smoother easing function
            },
            key: singleSlide
        }
    )

    const circleTransition = useTransition(singleSlide, {
        from: {
            scale: 0,
            opacity: 1,
            top: `${upOrDown === 'up' ? '0' : '100%'}`
        },
        enter: {
            scale: 1,
            opacity: 1,
            top: '50%' 
        },
        leave: {
            scale: 0,
            opacity: 0,
            top: `${upOrDown === 'up' ? '0' : '100%'}`,
            zindex: -1
        },
        config: {
            duration: 300,
            easing: easings.easeInOutQuad
        },
        key: singleSlide,
        exitBeforeEnter: true 
    })

    return (
        <div className={`timelineStory ${props.className ? props.className : ''}`}>
            {
                picturesTransitions((style, index) => (

                    <animated.div
                        key={index}
                        style={{
                            ...style,
                            position: 'absolute'
                        }}
                        className={'singleSlide'}
                    >

                        <div className="singleSlide">
                            <div id="timeline" className="flex flex-column flex-justifyContent-spaceAround">
                                <div id="lineWhite" className={getLineClass(index)} ></div>
                                {
                                    circleTransition((circleStyle, item, phase) => (
                                        item === singleSlide && (
                                            <animated.div
                                                key={singleSlide}
                                                style={{
                                                    ...circleStyle,
                                                    transformOrigin: 'center', // Ensures the circle scales from the center
                                                }}
                                                id="circleWhite"
                                            ></animated.div>
                                        )
                                    ))
                                }
                            </div>
                                
                            <div 
                                id="slideDescription" 
                                className="flex flex-column flex-justifyContent-center flex-alignItems-center" 
                                style={{backgroundColor: slideList[index].slide_body.leftBG}}
                            > 
                                {
                                    index > 0 && (

                                        <FontAwesomeIcon 
                                            id="prevSlide" 
                                            icon={faChevronUp} 
                                            className="fontSize40"
                                            onClick={() => {
                                                setSingleSlide(prev=> prev - 1)
                                                setUpOrDown('down')
                                            }}
                                        />            
                                    ) 
                                }
                                <div id="slideText" className="p-20 mx-30" >
                                    <p className="my-0 fontSize16">{slideList[index].slide_body.description}</p>
                                </div>

                                {
                                    index + 1 < slideList.length && ( 
                                        <FontAwesomeIcon 
                                            id="nextSlide" 
                                            icon={faChevronDown} 
                                            className="fontSize40"
                                            onClick={() => {
                                                setSingleSlide(prev=> prev + 1)
                                                setUpOrDown('up')
                                            }}
                                        />
                                    )
                                }     
                            </div>

                            <div id="slidePic">
                                <img id="slideImg" src={publicUrl(`/timelineStory-pictures/${slideList[index].slide_body.rightBG}`)} alt="Carousel 2"/>
                                <p className={`m-0 note_${index}`} id="picNote">{slideList[index].slide_body.picNote}</p>
                            </div>
                        </div>

                    </animated.div>
                ))  
            }
        </div>
    )
}

export default TimeLineStory