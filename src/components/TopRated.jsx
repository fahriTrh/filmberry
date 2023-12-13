import { useEffect } from "react"
import { useState } from "react"
import Api from '../api/Api'
import Card from "./Card"
import { Link } from "react-router-dom"

const TopRated = ({ title = '', query = '', category = '' }) => {

    const [topRated, setTopRated] = useState('')

    useEffect(() => {
        const getTopRated = async () => {
            const results = await Api(query)
            setTopRated(results)
        }

        getTopRated()
    },[])

    return (
        <div
            className="
                w-[90%]
                lg:w-[85%]
                mx-auto
                mt-10
            "
        >

            <h1
                className="
                    text-primary
                    mb-6
                    font-semibold
                    text-xl
                    lg:text-2xl
                    "
            >
                { title }
            </h1>

            <div
                className="
                    w-full
                    flex
                    gap-3
                    scrollbar-hide
                    overflow-auto
                "
            >
                {/* card */}
                {
                    topRated && (
                        topRated.results.map(top => (
                            <Link to={`/${category}/${top.id}`} key={top.id}>
                                <Card
                                    category={category}
                                    item={top}
                                />
                            </Link>
                        ))
                    )
                }

            </div>

        </div>
    )
}

export default TopRated