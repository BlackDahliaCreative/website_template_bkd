import { Link } from "react-router-dom";
import './navigation-bar-small-screen.scss'
import { useState } from "react";
import { useTransition, animated } from "@react-spring/web";

const NavigationBarSmallScreen = () => {
    const [isExpanded, setIsExpanded] = useState(false)
    const toggleLogic = () => {
        setIsExpanded(prevState => !prevState)
    }
    const transitions = useTransition(isExpanded, {
        from: { opacity: 0, height: '0%', width: '0%' },
        enter: { opacity: 1, height: '100%', width: '100%' },
        leave: { opacity: 0, height: '0%', width: '0%' },
        config: { duration: 200 },
    })

    return (
        <>
            <button
                className="hambContainer"
                onClick={toggleLogic}
                aria-expanded={isExpanded}
                aria-controls="smallScreenMenu"
                aria-label={isExpanded ? 'Close navigation menu' : 'Open navigation menu'}
            >
                <div className={isExpanded ? 'hamburger-menu openHam' : 'hamburger-menu'} aria-hidden="true">
                    <div className="bar" id="bar1"></div>
                    <div className="bar" id="bar2"></div>
                    <div className="bar" id="bar3"></div>
                </div>
            </button>

            {transitions((style, item) =>
                item ? (
                    <animated.div style={style} id="smallScreenMenu" role="dialog" aria-label="Navigation menu">
                        <nav aria-label="Main navigation" className='navBarSm'>
                            <Link className="navLinksSmScreen" onClick={toggleLogic} to={'/'}>Home Page</Link>
                            <Link className="navLinksSmScreen" onClick={toggleLogic} to={'/carousels/'}>Carousels</Link>
                            <Link className="navLinksSmScreen" onClick={toggleLogic} to={'/page-2/'}>Page 2</Link>
                            <Link className="navLinksSmScreen" onClick={toggleLogic} to={'/animations/'}>Animations</Link>
                        </nav>
                    </animated.div>
                ) : null
            )}
        </>
    )
}

export default NavigationBarSmallScreen
