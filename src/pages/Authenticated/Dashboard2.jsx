import React, { useState, useEffect, useRef } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { Film, Star, Clock, Globe, Calendar, Loader2, TrendingUp, Filter } from 'lucide-react';
import { useAuth0 } from "@auth0/auth0-react";
import Header from '../../components/Header';

// TMDB API Configuration
const TMDB_API_KEY = import.meta.env.VITE_API_KEY
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

// Komponen MyNavLink 
const MyNavLink = ({ to, children, isButton, onClick }) => {
    if (isButton) {
        return (
            <button onClick={onClick} className="text-white hover:text-[#E50914] transition-colors duration-200">
                {children}
            </button>
        );
    }
    return (
        <Link to={to} className="text-white hover:text-[#E50914] transition-colors duration-200 font-medium">
            {children}
        </Link>
    );
};

// Komponen Button 
const Button = ({ variant, onClick, children }) => {
    const baseClasses = "font-semibold rounded-lg transition-all duration-200 transform hover:scale-105";
    const variantClasses = variant === 'sm'
        ? "px-4 py-2 text-sm bg-[#E50914] hover:bg-[#b8070f] text-white shadow-lg hover:shadow-[#E50914]/50"
        : "px-6 py-3 bg-[#E50914] hover:bg-[#b8070f] text-white shadow-lg hover:shadow-[#E50914]/50";

    return (
        <button onClick={onClick} className={`${baseClasses} ${variantClasses}`}>
            {children}
        </button>
    );
};

const MovieRecommendationSPK = () => {
    const { user, isAuthenticated } = useAuth0();
    const navigate = useNavigate();

    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    const [isLoading, setIsLoading] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [movieResults, setMovieResults] = useState([]);
    const [allMovies, setAllMovies] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [moviesPerPage] = useState(6);
    const [error, setError] = useState(null);

    const [filters, setFilters] = useState({
        genre: '',
        country: '',
        year: '',
        duration: '',
        status: '',
        weightRating: 50,
        weightPopularity: 30,
        weightYear: 20
    });

    // Genre IDs dari TMDB
    const genreMap = {
        'Action': 28,
        'Drama': 18,
        'Comedy': 35,
        'Horror': 27,
        'Sci-Fi': 878,
        'Romance': 10749,
        'Thriller': 53,
        'Documentary': 99
    };

    const genres = Object.keys(genreMap);
    const countries = ['US', 'KR', 'JP', 'GB', 'ID', 'IN', 'FR'];
    const years = ['2024', '2023', '2022', '2021', '2020', '2019'];
    const durations = ['< 90', '90-120', '120-150', '> 150'];
    const statuses = ['Semua', 'Upcoming', 'Released'];

    const adultKeywords = [
        'sex', 'prostitute', 'prostitution', 'erotic', 'adult', 'porn',
        'xxx', 'softcore', 'hardcore', 'sexual', 'nude', 'nudity',
        'stripper', 'escort', 'brothel', 'gigolo', 'hentai'
    ];

    const isAdultContent = (movie) => {
        const title = (movie.title || '').toLowerCase();
        const overview = (movie.overview || '').toLowerCase();
        return adultKeywords.some(keyword =>
            title.includes(keyword) || overview.includes(keyword)
        );
    };

    // FETCH MOVIES
    const fetchMoviesFromTMDB = async () => {
        try {
            setError(null);

            const pages = [1, 2, 3];
            const allResults = [];

            for (const pageNum of pages) {
                let url = `${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&language=en-US&sort_by=popularity.desc&include_adult=false&page=${pageNum}`;

                if (filters.genre) url += `&with_genres=${genreMap[filters.genre]}`;
                if (filters.country) url += `&with_origin_country=${filters.country}`;
                if (filters.year) url += `&primary_release_year=${filters.year}`;

                if (filters.duration) {
                    const [min, max] = filters.duration.split('-');
                    if (filters.duration.startsWith('<')) url += `&with_runtime.lte=90`;
                    else if (filters.duration.startsWith('>')) url += `&with_runtime.gte=150`;
                    else url += `&with_runtime.gte=${min}&with_runtime.lte=${max}`;
                }

                const res = await fetch(url);
                const data = await res.json();
                allResults.push(...(data.results || []));
            }

            return allResults.filter(m => !isAdultContent(m));

        } catch (err) {
            throw err;
        }
    };

    // ⭐ TOPSIS NORMALISASI
    const topsisNormalize = (movies) => {
        if (movies.length === 0) return [];

        const ratingList = movies.map(m => m.vote_average || 0);
        const popularityList = movies.map(m => m.popularity || 0);
        const yearList = movies.map(m => new Date(m.release_date).getFullYear() || 0);

        const denomRating = Math.sqrt(ratingList.reduce((a, b) => a + (b * b), 0));
        const denomPopularity = Math.sqrt(popularityList.reduce((a, b) => a + (b * b), 0));
        const denomYear = Math.sqrt(yearList.reduce((a, b) => a + (b * b), 0));

        return movies.map(m => {
            const y = new Date(m.release_date).getFullYear();

            return {
                ...m,
                topsisNorm: {
                    rating: denomRating ? m.vote_average / denomRating : 0,
                    popularity: denomPopularity ? m.popularity / denomPopularity : 0,
                    year: denomYear ? y / denomYear : 0
                }
            };
        });
    };

    // ⭐ TOPSIS HITUNG SCORE
    const calculateTopsisScore = (movies, weights) => {
        const wRating = weights.weightRating / 100;
        const wPopularity = weights.weightPopularity / 100;
        const wYear = weights.weightYear / 100;

        const weighted = movies.map(m => ({
            ...m,
            weighted: {
                rating: m.topsisNorm.rating * wRating,
                popularity: m.topsisNorm.popularity * wPopularity,
                year: m.topsisNorm.year * wYear
            }
        }));

        const idealPos = {
            rating: Math.max(...weighted.map(m => m.weighted.rating)),
            popularity: Math.max(...weighted.map(m => m.weighted.popularity)),
            year: Math.max(...weighted.map(m => m.weighted.year)),
        };

        const idealNeg = {
            rating: Math.min(...weighted.map(m => m.weighted.rating)),
            popularity: Math.min(...weighted.map(m => m.weighted.popularity)),
            year: Math.min(...weighted.map(m => m.weighted.year)),
        };

        return weighted.map(m => {
            const dPos = Math.sqrt(
                Math.pow(m.weighted.rating - idealPos.rating, 2) +
                Math.pow(m.weighted.popularity - idealPos.popularity, 2) +
                Math.pow(m.weighted.year - idealPos.year, 2)
            );

            const dNeg = Math.sqrt(
                Math.pow(m.weighted.rating - idealNeg.rating, 2) +
                Math.pow(m.weighted.popularity - idealNeg.popularity, 2) +
                Math.pow(m.weighted.year - idealNeg.year, 2)
            );

            const score = dNeg / (dPos + dNeg);

            return {
                ...m,
                spkScore: Math.round(score * 100)
            };
        });
    };
    // HANDLE SUBMIT — PAKAI TOPSIS
    const handleSubmit = async () => {
        try {
            setIsLoading(true);
            setShowResults(false);

            const movies = await fetchMoviesFromTMDB();

            const normalized = topsisNormalize(movies);
            const withScore = calculateTopsisScore(normalized, filters);

            withScore.sort((a, b) => b.spkScore - a.spkScore);

            setAllMovies(withScore);
            setMovieResults(withScore);
            setShowResults(true);

        } catch (err) {
            console.error(err);
            setError("Gagal memuat data. Coba ulangi.");
        } finally {
            setIsLoading(false);
        }
    };

    // PAGINATION
    const indexOfLastMovie = currentPage * moviesPerPage;
    const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
    const currentMovies = movieResults.slice(indexOfFirstMovie, indexOfLastMovie);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);


    return (
        <div className="min-h-screen bg-black text-white">
            <Header />

            <div className="max-w-6xl mx-auto px-6 py-10">

                {/* TITLE */}
                <h1 className="text-4xl font-extrabold mb-6 text-center">
                    🎥 Smart Movie Recommendation — <span className="text-[#E50914]">TOPSIS</span>
                </h1>

                {/* FILTERS CARD */}
                <div className="bg-[#111] p-6 rounded-xl shadow-xl border border-gray-800 mb-10">

                    <h2 className="text-2xl font-bold flex items-center gap-2 mb-5">
                        <Filter size={20} className="text-[#E50914]" />
                        Filter Kriteria
                    </h2>

                    {/* GRID 3 KOLOM */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                        {/* GENRE */}
                        <div>
                            <label className="block mb-2 font-semibold">Genre</label>
                            <select
                                value={filters.genre}
                                onChange={(e) => setFilters({ ...filters, genre: e.target.value })}
                                className="w-full p-3 rounded-lg bg-[#1a1a1a] border border-gray-800"
                            >
                                <option value="">Semua Genre</option>
                                {genres.map((g) => (
                                    <option key={g} value={g}>{g}</option>
                                ))}
                            </select>
                        </div>

                        {/* COUNTRY */}
                        <div>
                            <label className="block mb-2 font-semibold">Negara</label>
                            <select
                                value={filters.country}
                                onChange={(e) => setFilters({ ...filters, country: e.target.value })}
                                className="w-full p-3 rounded-lg bg-[#1a1a1a] border border-gray-800"
                            >
                                <option value="">Semua Negara</option>
                                {countries.map((c) => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                        </div>

                        {/* YEAR */}
                        <div>
                            <label className="block mb-2 font-semibold">Tahun Rilis</label>
                            <select
                                value={filters.year}
                                onChange={(e) => setFilters({ ...filters, year: e.target.value })}
                                className="w-full p-3 rounded-lg bg-[#1a1a1a] border border-gray-800"
                            >
                                <option value="">Semua Tahun</option>
                                {years.map((y) => (
                                    <option key={y} value={y}>{y}</option>
                                ))}
                            </select>
                        </div>

                    </div>

                    {/* WEIGHTS */}
                    <h2 className="text-xl font-bold mt-8 mb-4">Bobot Kriteria (TOPSIS)</h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                        {/* RATING */}
                        <div>
                            <label className="block mb-2 font-semibold">Rating (%)</label>
                            <input
                                type="number"
                                value={filters.weightRating}
                                onChange={(e) => setFilters({ ...filters, weightRating: Number(e.target.value) })}
                                className="w-full p-3 rounded-lg bg-[#1a1a1a] border border-gray-800"
                            />
                        </div>

                        {/* POPULARITY */}
                        <div>
                            <label className="block mb-2 font-semibold">Popularitas (%)</label>
                            <input
                                type="number"
                                value={filters.weightPopularity}
                                onChange={(e) => setFilters({ ...filters, weightPopularity: Number(e.target.value) })}
                                className="w-full p-3 rounded-lg bg-[#1a1a1a] border border-gray-800"
                            />
                        </div>

                        {/* YEAR */}
                        <div>
                            <label className="block mb-2 font-semibold">Tahun (%)</label>
                            <input
                                type="number"
                                value={filters.weightYear}
                                onChange={(e) => setFilters({ ...filters, weightYear: Number(e.target.value) })}
                                className="w-full p-3 rounded-lg bg-[#1a1a1a] border border-gray-800"
                            />
                        </div>

                    </div>

                    <div className="mt-6 text-center">
                        <Button onClick={handleSubmit}>🔍 Cari Rekomendasi</Button>
                    </div>

                </div>

                {/* LOADING */}
                {isLoading && (
                    <div className="flex justify-center py-20">
                        <Loader2 className="animate-spin text-[#E50914]" size={50} />
                    </div>
                )}

                {/* ERROR */}
                {error && (
                    <div className="text-center text-red-400 font-semibold">{error}</div>
                )}

                {/* RESULTS */}
                {showResults && !isLoading && (
                    <>
                        <h2 className="text-3xl font-bold mb-6 text-center">Hasil Rekomendasi</h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">

                            {currentMovies.map((movie) => (
                                <div
                                    key={movie.id}
                                    className="bg-[#111] rounded-xl shadow-lg p-4 border border-gray-800 hover:border-[#E50914] transition-all duration-300"
                                >
                                    <img
                                        src={movie.poster_path ? `${TMDB_IMAGE_BASE}${movie.poster_path}` : "/no-image.jpg"}
                                        alt={movie.title}
                                        className="rounded-lg shadow mb-4"
                                    />

                                    <h3 className="text-xl font-bold mb-2">{movie.title}</h3>

                                    <p className="text-gray-400 text-sm mb-3 line-clamp-3">
                                        {movie.overview}
                                    </p>

                                    <div className="flex justify-between text-sm text-gray-300 mb-3">
                                        <span className="flex items-center gap-1"><Star size={14} /> {movie.vote_average}</span>
                                        <span className="flex items-center gap-1"><TrendingUp size={14} /> {movie.popularity}</span>
                                        <span className="flex items-center gap-1"><Calendar size={14} /> {movie.release_date}</span>
                                    </div>

                                    <p className="text-lg font-bold text-[#E50914]">
                                        TOPSIS Score: {movie.spkScore}
                                    </p>
                                </div>
                            ))}

                        </div>

                        {/* PAGINATION */}
                        <div className="flex justify-center mt-10 gap-2">
                            {Array.from({ length: Math.ceil(movieResults.length / moviesPerPage) }).map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => paginate(index + 1)}
                                    className={`px-3 py-2 rounded-lg border ${currentPage === index + 1
                                            ? "bg-[#E50914] border-[#E50914]"
                                            : "border-gray-700 bg-[#111]"
                                        }`}
                                >
                                    {index + 1}
                                </button>
                            ))}
                        </div>
                    </>
                )}

            </div>
        </div>
    );
};

export default MovieRecommendationSPK;
