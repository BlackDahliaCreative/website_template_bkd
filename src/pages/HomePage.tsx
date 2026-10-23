import "./page.scss" 
import TimeLineStory from "../components/TimelineStory/TimelineStory"
import SEOHead from "../components/SEOHead/SEOHead"

const HomePage = () => {

    return(
        <div className="page">
            <SEOHead path="/" />
            <h1>HOME PAGE</h1>

            <h4>Time Line Story</h4>
            <TimeLineStory className="my-20"/>
        </div>
    )
}

export default HomePage