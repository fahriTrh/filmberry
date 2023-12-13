import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import Button from './Button'
import { useEffect, useRef, useState } from 'react'
import Api from '../api/Api'
import { Link } from 'react-router-dom'

const Banner = () => {

    const [movies, setMovies] = useState(null)
    const [genres, setGenres] = useState(null)

    const trailerContainer = useRef()
    const trailerIframe = useRef()

    const playTrailer = (event) => {
        const getTrailer = async () => {
            const videos = await Api(`movie/${event.target.getAttribute('data-id')}/videos`)

            videos.results.map(video => {
                if (video.type == 'Trailer') {
                    trailerContainer.current.classList.remove('hidden')
                    trailerIframe.current.src = `https://www.youtube.com/embed/${video.key}`
                }
            })
        }
        getTrailer()        
    } 

    const stopTrailer = () => {
        trailerContainer.current.classList.add('hidden')
        trailerIframe.current.src = ''
    }

    useEffect(() => {
        const topFive = async () => {
            const results = await Api('movie/popular')
            setMovies(results)
        }
        topFive()
    }, [])

    useEffect(() => {
        const allGenres = async () => {
            const results = await Api('genre/movie/list')
            setGenres(results.genres)
        }
        allGenres()
    },[])

    return (
        <>
            <Swiper
                spaceBetween={30}
                autoplay={{ 
                    delay: 5000,
                    disableOnInteraction: false
                }}
                pagination={{ 
                    clickable: true
                }}
                modules={[Autoplay]}
                centeredSlides={true}
                className='
                    flex w-full h-[500px] md:min-h-screen overflow-auto
                    cursor-grab scrollbar-hide
                    '
            >
                {
                    movies && (
                        movies.results.slice(0, 5).map(movie => (
                            <SwiperSlide key={movie.id} className='relative'>
                                <img src={`${import.meta.env.VITE_BASE_IMG}/original${movie.backdrop_path}`}
                                    className='w-full h-full object-cover object-center'    
                                    />
                                <div 
                                    className='
                                        z-40 bg-gradient-to-r from-black/90 to-black/30
                                        absolute top-0 bottom-0 left-0 right-0 flex
                                        '>
                                    <div className='w-[90%] md:w-[85%] my-auto mx-auto flex'>
                                        <div>
                                            <Button variant='sm'>
                                                Top
                                            </Button>
                                            <Link to={`/movie/${movie.id}`}>
                                                <h1
                                                    className='
                                                        text-3xl sm:text-4xl md:text-5xl
                                                        font-bold my-4 md:mt-4 md:mb-5
                                                        '
                                                >
                                                    { movie.original_title }
                                                </h1>
                                            </Link>

                                            <Link to={`/movie/${movie.id}`}>
                                                <p
                                                    className='
                                                        text-xs md:text-sm line-clamp-3 w-[80%] md:w-[75%]
                                                        mb-4 md:mb-5
                                                    '
                                                >
                                                    { movie.overview }
                                                </p>
                                            </Link>

                                            <div 
                                                className='
                                                    text-lg md:text-xl flex
                                                    items-center gap-1 my-4 md:mt-4 md:mb-5
                                            '>
                                                <img 
                                                    src="/assets/rate.png" 
                                                    className='w-4 h-4 md:w-5 md:h-5' 
                                        
                                                    />
                                                <span>{ movie.vote_average.toFixed(1) }</span>
                                                <div 
                                                    className='
                                                        ml-2 text-xs md:text-sm flex items-center
                                                        gap-1 md:gap-2
                                                        '
                                                    >
                                                    <span>| Genre</span>
                                                    {
                                                        genres && (
                                                            genres.map(genre => (
                                                                movie.genre_ids.includes(genre.id) && (
                                                                    <span key={genre.id} className='text-primary'>
                                                                        { genre.name }
                                                                    </span>
                                                                )
                                                            ))
                                                        )
                                                    }
                                                </div>
                                            </div>
                                            <Button
                                                onClick={playTrailer}
                                                dataId={movie.id}
                                            >
                                                Watch
                                            </Button>
                                        </div>
                                        <div
                                            className='
                                                hidden lg:block min-w-[260px] max-w-[260px] -translate-x-10
                                                rounded-lg h-[340px] bg-primary overflow-hidden
                                            '
                                        >
                                            <img 
                                                src={`${import.meta.env.VITE_BASE_IMG}/w500${movie.poster_path}`}
                                                className='object-cover object-center w-full h-full'
                                                />
                                        </div>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))
                    )
                }
            </Swiper>

            <div
                ref={trailerContainer}
                className='
                    hidden fixed z-40 top-0 w-[85%] lg:w-[70%] left-[7.5%] lg:left-[15%] mt-20
                '
            >
                <button
                    onClick={stopTrailer}
                    className='
                        absolute -top-5 -right-2 text-xl md:text-2xl
                    '
                >
                    x
                </button>

                <div
                    className='
                        grid grid-cols-1 rounded
                        border border-neutral-800
                        p-1.5 h-[280px] sm:h-[350px] md:h-[400px] 
                        lg:h-[450px] xl:h-[500px]
                    '
                >
                    <iframe 
                        ref={trailerIframe}
                        src="" 
                        frameBorder="0"
                        allowFullScreen={true}
                        className='
                            w-full h-full
                        '
                        >

                    </iframe>
                </div>  

            </div>
        </>
    )
}

export default Banner