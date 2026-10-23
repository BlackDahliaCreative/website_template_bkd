import { Link } from "react-router-dom"
import "./page.scss"
import SEOHead from "../components/SEOHead/SEOHead"

// Shown for any URL that doesn't match a route. Never indexed.
const NotFound = () => {
    return (
        <div className="page">
            <SEOHead title="Page not found" noIndex />
            <h1>Page not found</h1>
            <p>The page you're looking for doesn't exist or has moved.</p>
            <Link to="/">Back to the home page</Link>
        </div>
    )
}

export default NotFound
