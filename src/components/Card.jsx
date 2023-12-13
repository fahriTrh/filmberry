import { useEffect, useState } from "react"
import Api from "../api/Api"

const Card = ({ item, category }) => {

    const [genres, setGenres] = useState(null)

    useEffect(() => {
        const allGenres = async () => {
            const results = await Api(`genre/${category}/list`)
            setGenres(results.genres)
        }
        allGenres()
    }, [])

    return (
        <div
            className="
                group
                cursor-pointer
                min-w-[210px]
                max-w-[210px]
                h-[300px]
                bg-primary
                rounded-md
                overflow-hidden
                relative
            "
        >
            <img
                src={`${import.meta.env.VITE_BASE_IMG}/w500${item.poster_path}`}
                className="
                    object-cover
                    object-center
                    w-full
                    group-hover:scale-105
                    duration-300
                "
             />

            <div
                className="
                    absolute
                    top-0 right-0 left-0 bottom-0
                    bg-gradient-to-b from-transparent to-black/70
                    p-4
                    flex flex-col
                    justify-end
                    group-hover:bg-base/30
                    duration-300
                "
            >
                <div>
                    <span
                        className="
                            block
                            px-3
                            py-1
                            bg-primary
                            rounded-md
                            w-[max-content]
                            text-xs
                            md:text-sm
                            mb-3
                        "
                    >
                        {
                            genres &&
                            genres.map(genre => {
                                if (item.genre_ids.includes(genre.id)) {
                                    return (
                                        <span
                                            key={genre.id}
                                        >
                                            { genre.name }
                                        </span>
                                    )
                                }
                                return null
                            }).find(Boolean)
                        }
                    </span>

                    <img
                        width={80}
                        src="/assets/rates.png"
                        className="mb-3"
                     />

                    <h1
                        className="
                            md:text-lg
                            font-semibold
                        "
                    >
                        {
                            item.original_title || item.original_name
                        }
                    </h1>
                </div>
            </div>

            <div
                className="
                    opacity-0
                    group-hover:opacity-100
                    duration-300
                    absolute
                    top-[45%] left-[40%]
                    z-30
                    w-auto
                    h-auto
                "
            >
                <svg stroke="red" fill="red" strokeWidth={0} viewBox="0 0 576 512" className="w-10 h-8"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M549.655 124.083c-6.281-23.65-24.787-42.276-48.284-48.597C458.781 64 288 64 288 64S117.22 64 74.629 75.486c-23.497 6.322-42.003 24.947-48.284 48.597-11.412 42.867-11.412 132.305-11.412 132.305s0 89.438 11.412 132.305c6.281 23.65 24.787 41.5 48.284 47.821C117.22 448 288 448 288 448s170.78 0 213.371-11.486c23.497-6.321 42.003-24.171 48.284-47.821 11.412-42.867 11.412-132.305 11.412-132.305s0-89.438-11.412-132.305zm-317.51 213.508V175.185l142.739 81.205-142.739 81.201z" />
                </svg>
            </div>

        </div>
    )
}

export default Card