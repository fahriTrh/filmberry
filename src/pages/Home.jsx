import Header from "../components/Header"
import Banner from "../components/Banner"
import TopRated from "../components/TopRated"

const Home = () => {
    return (
        <div>
            <Header />
            <Banner />
            <TopRated
                title="Top Trending Movies"
                query="movie/popular"
                category="movie"
             />
            <TopRated
                title="Top Trending Series"
                query="tv/top_rated"
                category="tv"
             />
        </div>
    )
}

export default Home