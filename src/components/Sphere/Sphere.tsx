import { motion } from 'framer-motion'
import './sphere.scss'
import { useReducedMotion } from "framer-motion";



const Sphere = () => {
    const prefersReducedMotion = useReducedMotion();
    
    // animate={prefersReducedMotion ? {} : { y: [0, -90, 0], z: [0, 160, 0] }}
    return (
        <div className="perspective col-6" style={{overflow: ""}}>
            <motion.div
                className="sphere"
                animate={
                    prefersReducedMotion
                    ? {}
                    : {
                        x: ["-40vw", "0vw", "40vw"],
                        // y: [0, -90, 0],
                        scale: [1, 1.1, 1],
                        z: [0, 160, 0],
                    
                    }
                }
                
                transition={{
                    duration: 1.5,
                    ease: "easeInOut",
                    repeat: 1,
                    
                }}
                
            />
        </div>
    )
}

export default Sphere