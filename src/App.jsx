import { Route, Routes } from "react-router-dom"
import Home from "./pages/Home"
import Movies from "./pages/Movies"
import Series from "./pages/Series"
import Movie from "./pages/Movie"
import Tv from "./pages/Tv"
import Dashboard from "./pages/Authenticated/Dashboard"

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/movies" element={<Movies />} />
      <Route path="/series" element={<Series />}/>
      <Route path="/movie/:id" element={<Movie />} />
      <Route path="/tv/:id" element={<Tv/>} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  )
}

export default App
