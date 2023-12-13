import Header from "../components/Header"
import MediaList from "../components/MediaList"
import TopBackground from "../components/TopBackground"

const Movies = () => {
    return (
        <div>
            <Header />
            <TopBackground
                title="Movies"
             />

             <MediaList
                category="movie"
              />
        </div>
    )
}

export default Movies