import "./page.scss" 
import Carousel from "../components/Carousel/Carousel"
import AutoplayCarousel from "../components/AutoPlayCarousel/AutoplayCarousel"
import { useState } from "react"
import SEOHead from "../components/SEOHead/SEOHead"

const Page1 = () => {
    const [carouselType, setCarouselType] = useState<"multi-folder" | "single-folder" | "single-preview">("multi-folder")

    return(
        <div className="page">
            <SEOHead title="Carousels" description="CLIENT_CAROUSELS_DESC" canonicalPath="/Carousels" />
            <div className="flex flex-alignItems-center">
                <p>Select type</p>
                <select 
                    id="selectCarouselType"
                    value={carouselType}
                    onChange={(event) => {
                        setCarouselType(event.target.value as "multi-folder" | "single-folder" | "single-preview")
                    }}
                    className="ml-5 mr-50"
                >
                    <option value="multi-folder">multi-folder</option>
                    <option value="single-folder">single-folder</option>
                    <option value="single-preview">single-preview</option>
                </select>

                <p className="mb-20"> <b>{carouselType.toUpperCase().replace('-'," ")}</b> Carousel</p>
            </div>

            <Carousel className="my-30" type={carouselType}/>


            <h3>Auto Play Slide Show</h3>
            <div className="flex col-12 flex-justifyContent-center pb-20">
                <AutoplayCarousel className="mt-30 mb-30" interval={3000}/>
            </div>

        </div>
    )
}

export default Page1