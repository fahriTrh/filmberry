import { useEffect } from "react"
import Detail from "../components/Detail"
import { useParams } from "react-router-dom"

const Movie = () => {
    const { id } = useParams()

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        })
    },[id])

    return (
        <Detail
            category="movie"
        />
    )
}

export default Movie