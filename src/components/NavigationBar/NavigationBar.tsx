import { Link } from "react-router-dom";
import './navigation-bar.scss'

const NavigationBar = () => {

    return (
        <nav aria-label="Main navigation" className="flex flex-alignItems-center flex-justifyContent-center navBar">
            <Link className="navLinks" to={'/'}>Home Page</Link>
            <Link className="navLinks" to={'/carousels/'}>Carousels</Link>
            <Link className="navLinks" to={'/page-2/'}>Page 2</Link>
            <Link className="navLinks" to={'/animations/'}>Animations</Link>
        </nav>
    )
}

export default NavigationBar