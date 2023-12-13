import Header from "../components/Header"
import MediaList from "../components/MediaList"
import TopBackground from "../components/TopBackground"

const Series = () => {
    return (
        <div>
            <Header />
            <TopBackground
                title="Series"
             />

             <MediaList
                category="tv"
              />
        </div>
    )
}

export default Series