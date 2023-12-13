import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import Api from "../api/Api"
import Header from "./Header"
import TopRated from "./TopRated"

const Detail = ({
    category = ''
}) => {

    const { id } = useParams()
    const [media, setMedia] = useState(null)
    const [credits, setCredits] = useState(null)
    const [trailers, setTrailers] = useState(null)

    useEffect(() => {
        const getMedia = async () => {
            const result = await Api(`${category}/${id}`)
            setMedia(result)
        }

        getMedia()
    }, [id])

    useEffect(() => {
        const getCredits = async () => {
            const results = await Api(`${category}/${id}/credits`)
            setCredits(results)
        }

        getCredits()
    }, [credits])

    useEffect(() => {
        const getTrailers = async () => {
            const results = await Api(`${category}/${id}/videos`)
            setTrailers(results)
        }

        getTrailers()
    }, [trailers])

    return (
        <div>
            <Header />
            {
                media && (
                    <div
                        className="
                    relative w-full h-[500px] md:min-h-screen overflow-auto scrollbar-hide
                "
                    >
                        <img
                            src={`${import.meta.env.VITE_BASE_IMG}/original${media.backdrop_path}`}
                            className="
                        w-full h-full object-cover object-center
                    "
                        />
                        <div
                            className="
                        z-40 bg-gradient-to-r from-black/90 to-black/30
                        absolute top-0 bottom-0 right-0 left-0 flex
                    "
                        >
                            <div
                                className="
                            w-[90%] lg:w-[85%] my-auto mx-auto flex
                        "
                            >
                                <div
                                    className="
                                hidden lg:block min-w-[260px] max-w-[260px]
                                rounded-lg h-[360px] bg-primary overflow-hidden
                            "
                                >
                                    <img
                                        src={`${import.meta.env.VITE_BASE_IMG}/w500${media.poster_path}`}
                                        className="
                                    object-cover
                                    object-center
                                    w-full h-full
                                "
                                    />
                                </div>
                                <div
                                    className="
                                lg:ml-8
                            "
                                >
                                    <h1
                                        className="
                                    text-2xl sm:text-3xl md:text-4xl
                                    font-bold my-3 md:mt-3 md:mb-2
                                "
                                    >
                                        {media.original_title}
                                    </h1>
                                    <div
                                        className="
                                    mb-5 flex flex-wrap w-[250px] lg:w-[300px]
                                    xl:w-[350px] gap-1 text-xs md:gap-2
                                "
                                    >

                                        {
                                            media.genres.map(genre => (
                                                <span
                                                    key={genre.id}
                                                    className="
                                                block px-2.5 py-0.5 bg-primary
                                                rounded-full w-[max-content] text-xs md:text-sm
                                            "
                                                >
                                                    {genre.name}
                                                </span>
                                            ))
                                        }
                                    </div>
                                    <p
                                        className="
                                    text-xs md:text-sm w-[80%] md:w-[75%]
                                    mb-3 md:mb-4
                                "
                                    >
                                        {media.overview}
                                    </p>

                                    <div
                                        className="
                                    text-lg md:text-xl flex
                                    items-center gap-1 my-4 md:mt-4 md:mb-4
                                "
                                    >
                                        <img
                                            src="/assets/rate.png"
                                            className="
                                        w-4 h-4 md:w-5 md:h-5
                                    "
                                        />
                                        <span>
                                            {media.vote_average.toFixed(1)}
                                        </span>
                                    </div>

                                    <div>
                                        <h1>Top Cast</h1>
                                        <div
                                            className="
                                        mt-2 grid grid-cols-5 w-[max-content] gap-2 md:gap-3
                                        items-center
                                    "
                                        >
                                            {
                                                credits &&
                                                credits.cast.slice(0, 5).map(cast => (
                                                    <div
                                                        key={cast.id}
                                                        className="
                                                    w-16 h-20 bg-primary rounded text-center
                                                    bg-cover bg-center relative
                                                "
                                                        style={{ backgroundImage: `url(${import.meta.env.VITE_BASE_IMG}/w500${cast.profile_path})` }}
                                                    >
                                                        <span
                                                            className="
                                                        block text-xs absolute -bottom-8
                                                    "
                                                        >
                                                            {cast.original_name}
                                                        </span>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
            {
                trailers && 
                trailers.results.map(trailer => (
                    <div key={trailer.id}>
                        <div
                            className="
                                w-[85%] lg:w-[70%] mx-auto mt-10 mb-6
                            "
                        >   
                            <h2
                                className="
                                    text-lg md:text-xl font-semibold
                                "
                            >
                                { trailer.type }
                            </h2>
                        </div>

                        <div
                            className="
                                grid grid-cols-1 w-[85%] lg:w-[70%] mx-auto
                                rounded overflow-hidden border border-neutral-800
                                p-1.5 h-[280px] sm:h-[350px] md:h-[400px] lg:h-[450px]
                                xl:h-[500px]
                            "
                        >
                            <iframe 
                                src={`https://www.youtube.com/embed/${trailer.key}`} 
                                frameborder="0"
                                allowFullScreen={true}
                                className="w-full h-full"
                                >
                            </iframe>
                        </div>
                    </div>
                ))
            }
            <TopRated 
                query={`${category}/${id}/similar`}
                title={`Similar ${category}`}
                category={category}
             />
        </div>
    )
}

export default Detail