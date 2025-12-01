import { Route, Routes } from "react-router-dom"
import Home from "./pages/Home"
import Movies from "./pages/Movies"
import Series from "./pages/Series"
import Movie from "./pages/Movie"
import Tv from "./pages/Tv"
import Dashboard from "./pages/Authenticated/Dashboard3"
import Favorites from './pages/Authenticated/Favorite';
import Callback from "./pages/Callback"

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/movies" element={<Movies />} />
      <Route path="/series" element={<Series />} />
      <Route path="/movie/:id" element={<Movie />} />
      <Route path="/tv/:id" element={<Tv />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/favorites" element={<Favorites />} />
      <Route path="/callback" element={<Callback />} />
    </Routes>
  )
}

export default App
