import { useEffect, useState } from "react"
import Api from '../api/Api'
import Card from '../components/Card'
import { ClipLoader } from "react-spinners"
import { Link } from "react-router-dom"

const MediaList = ({ category = '' }) => {

    const [movies, setMovies] = useState(null)
    const [page, setPage] = useState(1)
    const [query, setQuery] = useState(null)
    const [loading, setLoading] = useState(null)

    useEffect(() => {
        const getMovies = async () => {
            const results = await Api(`discover/${category}`, `&vote_count.gte=100&page=${page}`)
            setMovies(results)
        }

        getMovies()
    }, [])

    const search = (event) => {
        if (query) {
            event.preventDefault()
            const searchMovies = async () => {
                const results = await Api(`search/${category}`, `&query=${query}`)
                setMovies(results)
            }

            searchMovies()
        }
    }

    const loadMore = async () => {
        const nextPage = page + 1
        setPage(nextPage)

        setLoading(true)

        if (query) {
            const data = await Api(`search/${category}`, `&query=${query}&page=${nextPage}`)
            if(data) {
                setMovies({
                    ...movies,
                    results: [...movies.results, ...data.results],
                })

                setLoading(false)
            }
        } else {
            const data = await Api(`discover/${category}`, `&vote_count.gte=100&page=${nextPage}`)
            if (data) {
                setMovies({
                    ...movies,
                    results: [...movies.results, ...data.results]
                })
                setLoading(false)
            }
        }


    }

    return (
        <>
            <form 
                onSubmit={search}
                className="
                    flex
                    justify-center
                    mt-10
                    "
            >
                <input 
                    type="text"
                    className="
                        text-neutral-50
                        border-none
                        outline-none
                        px-3
                        py-1
                        md:px-4 
                        md:py-2
                        rounded-lg
                        bg-neutral-600
                        text-xs
                        md:text-sm
                        placeholder:text-neutral-400
                    "
                    placeholder="search"
                    onChange={(event) => setQuery(event.target.value)}
                     />
            </form>
            <div
                className="
                    w-[90%]
                    lg:w-[85%]
                    mx-auto
                    mt-10
                    grid
                    place-items-center
                    grid-cols-1
                    sm:grid-cols-2
                    md:grid-cols-3
                    lg:grid-cols-4
                    xl:grid-cols-5
                    gap-x-2 gap-y-3
                "
            >
                {
                    movies && 
                    movies.results.map(movie => (
                        <Link to={`/${category}/${movie.id}`} key={movie.id}>
                            <Card
                                category='movie'
                                item={movie}
                            />
                        </Link>
                    ))
                }
            </div>

            <div
                className="
                    w-full
                    mt-10
                    flex
                    justify-center
                "
            >
                <button
                    onClick={loadMore}
                    className={`
                        ${loading ? 'hidden' : ''}
                        px-3
                        py-1
                        rounded-md
                        bg-primary
                        hover:bg-primary/70
                        focus:bg-primary/70
                        text-xs
                        md:text-sm
                    `}
                >
                    More
                </button>

                <ClipLoader
                    color="#E50914"
                    loading={loading}
                    size={30}
                    aria-label="Loading Spinner"
                    dat-testid="loader"
                />
            </div>
        </>
    )
}

export default MediaList