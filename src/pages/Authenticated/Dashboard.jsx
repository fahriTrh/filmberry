import React, { useState, useEffect, useRef } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { Film, Star, Clock, Globe, Calendar, Loader2, TrendingUp, Filter } from 'lucide-react';
import { useAuth0 } from "@auth0/auth0-react";
import Header from '../../components/Header';

// TMDB API Configuration
const TMDB_API_KEY = import.meta.env.VITE_API_KEY // Ganti dengan API key Anda
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
    const [allMovies, setAllMovies] = useState([]); // Semua movie untuk pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [moviesPerPage] = useState(6); // Jumlah film per halaman
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

    // Keywords yang menandakan konten dewasa (blacklist)
    const adultKeywords = [
        'sex', 'prostitute', 'prostitution', 'erotic', 'adult', 'porn', 
        'xxx', 'softcore', 'hardcore', 'sexual', 'nude', 'nudity',
        'stripper', 'escort', 'brothel', 'gigolo', 'hentai'
    ];

    // Fungsi untuk cek apakah film mengandung konten dewasa
    const isAdultContent = (movie) => {
        const title = (movie.title || '').toLowerCase();
        const overview = (movie.overview || '').toLowerCase();
        
        // Cek apakah title atau overview mengandung kata-kata dewasa
        return adultKeywords.some(keyword => 
            title.includes(keyword) || overview.includes(keyword)
        );
    };

    // Fungsi untuk fetch movies dari TMDB (multiple pages)
    const fetchMoviesFromTMDB = async () => {
        try {
            setError(null);
            
            // Fetch 3 halaman untuk mendapat lebih banyak hasil (3 x 20 = 60 film)
            const pages = [1, 2, 3];
            const allResults = [];
            
            for (const pageNum of pages) {
                // Build query parameters
                let url = `${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&language=en-US&sort_by=popularity.desc&include_adult=false&certification_country=US&certification.lte=R&page=${pageNum}`;
                
                // Add genre filter
                if (filters.genre) {
                    url += `&with_genres=${genreMap[filters.genre]}`;
                }
                
                // Add country filter
                if (filters.country) {
                    url += `&with_origin_country=${filters.country}`;
                }
                
                // Add year filter
                if (filters.year) {
                    url += `&primary_release_year=${filters.year}`;
                }
                
                // Add runtime filter (duration)
                if (filters.duration) {
                    const [min, max] = filters.duration.split('-');
                    if (filters.duration.startsWith('<')) {
                        url += `&with_runtime.lte=90`;
                    } else if (filters.duration.startsWith('>')) {
                        url += `&with_runtime.gte=150`;
                    } else {
                        url += `&with_runtime.gte=${min}&with_runtime.lte=${max}`;
                    }
                }

                const response = await fetch(url);
                
                if (!response.ok) {
                    throw new Error('Gagal mengambil data dari TMDB');
                }
                
                const data = await response.json();
                allResults.push(...(data.results || []));
            }
            
            // Filter tambahan: buang film yang mengandung konten dewasa
            const filteredMovies = allResults.filter(movie => !isAdultContent(movie));
            
            return filteredMovies;
            
        } catch (err) {
            console.error('Error fetching movies:', err);
            throw err;
        }
    };

    // Fungsi normalisasi untuk metode SAW
    const normalizeMovies = (movies) => {
        if (movies.length === 0) return [];

        // Cari nilai max untuk setiap kriteria (benefit)
        const maxRating = Math.max(...movies.map(m => m.vote_average || 0));
        const maxPopularity = Math.max(...movies.map(m => m.popularity || 0));
        const maxYear = Math.max(...movies.map(m => new Date(m.release_date).getFullYear() || 0));

        return movies.map(movie => {
            const year = new Date(movie.release_date).getFullYear();
            
            // Normalisasi (benefit: nilai/max)
            const normalizedRating = maxRating > 0 ? movie.vote_average / maxRating : 0;
            const normalizedPopularity = maxPopularity > 0 ? movie.popularity / maxPopularity : 0;
            const normalizedYear = maxYear > 0 ? year / maxYear : 0;

            return {
                ...movie,
                normalized: {
                    rating: normalizedRating,
                    popularity: normalizedPopularity,
                    year: normalizedYear
                }
            };
        });
    };

    // Fungsi hitung score SPK menggunakan SAW
    const calculateSPKScore = (movie) => {
        const { weightRating, weightPopularity, weightYear } = filters;
        
        // Konversi bobot ke desimal
        const wRating = weightRating / 100;
        const wPopularity = weightPopularity / 100;
        const wYear = weightYear / 100;

        // Hitung score SAW
        const score = 
            (movie.normalized.rating * wRating) +
            (movie.normalized.popularity * wPopularity) +
            (movie.normalized.year * wYear);

        // Convert ke skala 0-100
        return Math.round(score * 100);
    };

    // Handle submit untuk cari rekomendasi
    const handleSubmit = async () => {
        setIsLoading(true);
        setShowResults(false);
        setError(null);
        setCurrentPage(1); // Reset ke halaman pertama

        try {
            // Fetch movies dari TMDB
            const movies = await fetchMoviesFromTMDB();
            
            if (movies.length === 0) {
                setError('Tidak ada film yang sesuai dengan filter Anda');
                setIsLoading(false);
                return;
            }

            // Normalisasi data
            const normalizedMovies = normalizeMovies(movies);

            // Hitung SPK score untuk setiap film
            const moviesWithScore = normalizedMovies.map(movie => ({
                ...movie,
                spkScore: calculateSPKScore(movie)
            }));

            // Sort berdasarkan SPK score (tertinggi ke terendah)
            const sortedMovies = moviesWithScore.sort((a, b) => b.spkScore - a.spkScore);

            // Simulate delay untuk UX
            setTimeout(() => {
                setAllMovies(sortedMovies); // Simpan semua hasil
                setIsLoading(false);
                setShowResults(true);
            }, 1500);

        } catch (err) {
            setError(err.message || 'Terjadi kesalahan saat mengambil data');
            setIsLoading(false);
        }
    };

    const handleReset = () => {
        setFilters({
            genre: '',
            country: '',
            year: '',
            duration: '',
            status: '',
            weightRating: 50,
            weightPopularity: 30,
            weightYear: 20
        });
        setShowResults(false);
        setMovieResults([]);
        setAllMovies([]);
        setCurrentPage(1);
        setError(null);
    };

    // Handle klik movie card untuk redirect ke detail
    const handleMovieClick = (movieId) => {
        navigate(`/movie/${movieId}`);
    };

    // Pagination logic
    const indexOfLastMovie = currentPage * moviesPerPage;
    const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
    const currentMovies = allMovies.slice(indexOfFirstMovie, indexOfLastMovie);
    const totalPages = Math.ceil(allMovies.length / moviesPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
            <style>{`
        * {
          font-family: 'Poppins', sans-serif;
        }

        .text-primary {
          color: #E50914;
        }

        .bg-primary {
          background-color: #E50914;
        }

        .animate-fade-in {
          animation: fadeIn 0.5s ease-in;
        }

        .animate-slide-up {
          animation: slideUp 0.6s ease-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        input[type="range"]::-webkit-slider-thumb {
          appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #E50914;
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(229, 9, 20, 0.4);
          transition: all 0.2s;
        }

        input[type="range"]::-webkit-slider-thumb:hover {
          transform: scale(1.2);
          box-shadow: 0 4px 12px rgba(229, 9, 20, 0.6);
        }

        input[type="range"]::-moz-range-thumb {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #E50914;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 6px rgba(229, 9, 20, 0.4);
          transition: all 0.2s;
        }

        input[type="range"]::-moz-range-thumb:hover {
          transform: scale(1.2);
          box-shadow: 0 4px 12px rgba(229, 9, 20, 0.6);
        }
      `}</style>

            <Header />
            <div className="w-[90%] lg:w-[85%] mx-auto">
                {isAuthenticated && user && (
                    <div className="pt-20">
                        <img
                            className="mt-20 rounded-full border-4 border-[#E50914] shadow-lg shadow-[#E50914]/30"
                            width={100}
                            src={user.picture}
                            alt="User Avatar"
                        />  
                        <h1 className="mt-3 text-white text-2xl md:text-3xl font-semibold">
                            Welcome <span className="text-primary">{user.name}</span>
                        </h1>
                    </div>
                )}

                {/* Info Box - API Key Warning */}
                {TMDB_API_KEY === 'YOUR_TMDB_API_KEY' && (
                    <div className="mt-8 bg-yellow-900 bg-opacity-50 border border-yellow-600 rounded-lg p-4 animate-fade-in">
                        <p className="text-yellow-200 text-sm">
                            ⚠️ <strong>Perhatian:</strong> Silakan ganti <code className="bg-yellow-800 px-2 py-1 rounded">TMDB_API_KEY</code> dengan API key Anda dari <a href="https://www.themoviedb.org/settings/api" target="_blank" rel="noopener noreferrer" className="underline hover:text-white">TMDB</a>
                        </p>
                    </div>
                )}

                {/* Filter Form */}
                <div className="mt-8 bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-2xl shadow-2xl p-6 mb-8 transition-all duration-300 hover:shadow-[#E50914]/20 hover:shadow-xl animate-slide-up">
                    <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-white">
                        <Filter className="w-6 h-6 text-[#E50914]" />
                        Filter & Kriteria Pencarian
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        {/* Genre */}
                        <div className="transition-all duration-200">
                            <label className="block text-sm font-medium mb-2 text-gray-300">Genre</label>
                            <select
                                value={filters.genre}
                                onChange={(e) => setFilters({ ...filters, genre: e.target.value })}
                                className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#E50914] focus:border-transparent transition-all duration-200"
                            >
                                <option value="">Semua Genre</option>
                                {genres.map(g => <option key={g} value={g}>{g}</option>)}
                            </select>
                        </div>

                        {/* Country */}
                        <div className="transition-all duration-200">
                            <label className="block text-sm font-medium mb-2 text-gray-300 flex items-center gap-1">
                                <Globe className="w-4 h-4" />
                                Negara
                            </label>
                            <select
                                value={filters.country}
                                onChange={(e) => setFilters({ ...filters, country: e.target.value })}
                                className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#E50914] focus:border-transparent transition-all duration-200"
                            >
                                <option value="">Semua Negara</option>
                                {countries.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>

                        {/* Year */}
                        <div className="transition-all duration-200">
                            <label className="block text-sm font-medium mb-2 text-gray-300 flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                Tahun
                            </label>
                            <select
                                value={filters.year}
                                onChange={(e) => setFilters({ ...filters, year: e.target.value })}
                                className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#E50914] focus:border-transparent transition-all duration-200"
                            >
                                <option value="">Semua Tahun</option>
                                {years.map(y => <option key={y} value={y}>{y}</option>)}
                            </select>
                        </div>

                        {/* Duration */}
                        <div className="transition-all duration-200">
                            <label className="block text-sm font-medium mb-2 text-gray-300 flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                Durasi (menit)
                            </label>
                            <select
                                value={filters.duration}
                                onChange={(e) => setFilters({ ...filters, duration: e.target.value })}
                                className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#E50914] focus:border-transparent transition-all duration-200"
                            >
                                <option value="">Semua Durasi</option>
                                {durations.map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* Weight Sliders */}
                    <div className="bg-gray-900 bg-opacity-40 rounded-xl p-6 mb-6">
                        <h3 className="text-lg font-semibold mb-4 text-[#E50914] flex items-center gap-2">
                            <TrendingUp className="w-5 h-5" />
                            Bobot Kriteria SPK (Total: {filters.weightRating + filters.weightPopularity + filters.weightYear}%)
                        </h3>

                        <div className="space-y-5">
                            <div>
                                <div className="flex justify-between mb-2">
                                    <label className="text-sm font-medium text-gray-300">Rating Film</label>
                                    <span className="text-[#E50914] font-semibold">{filters.weightRating}%</span>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={filters.weightRating}
                                    onChange={(e) => setFilters({ ...filters, weightRating: parseInt(e.target.value) })}
                                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                                    style={{
                                        background: `linear-gradient(to right, #E50914 0%, #E50914 ${filters.weightRating}%, #374151 ${filters.weightRating}%, #374151 100%)`
                                    }}
                                />
                            </div>

                            <div>
                                <div className="flex justify-between mb-2">
                                    <label className="text-sm font-medium text-gray-300">Popularitas</label>
                                    <span className="text-[#E50914] font-semibold">{filters.weightPopularity}%</span>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={filters.weightPopularity}
                                    onChange={(e) => setFilters({ ...filters, weightPopularity: parseInt(e.target.value) })}
                                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                                    style={{
                                        background: `linear-gradient(to right, #E50914 0%, #E50914 ${filters.weightPopularity}%, #374151 ${filters.weightPopularity}%, #374151 100%)`
                                    }}
                                />
                            </div>

                            <div>
                                <div className="flex justify-between mb-2">
                                    <label className="text-sm font-medium text-gray-300">Tahun Rilis</label>
                                    <span className="text-[#E50914] font-semibold">{filters.weightYear}%</span>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={filters.weightYear}
                                    onChange={(e) => setFilters({ ...filters, weightYear: parseInt(e.target.value) })}
                                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                                    style={{
                                        background: `linear-gradient(to right, #E50914 0%, #E50914 ${filters.weightYear}%, #374151 ${filters.weightYear}%, #374151 100%)`
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <button
                            onClick={handleSubmit}
                            disabled={isLoading}
                            className="flex-1 bg-[#E50914] hover:bg-[#b8070f] text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-[#E50914]/50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Memproses...' : 'Cari Rekomendasi'}
                        </button>
                        <button
                            onClick={handleReset}
                            disabled={isLoading}
                            className="flex-1 sm:flex-initial bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50"
                        >
                            Reset Filter
                        </button>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-900 bg-opacity-50 border border-red-600 rounded-lg p-4 mb-8 animate-fade-in">
                        <p className="text-red-200">❌ {error}</p>
                    </div>
                )}

                {/* Loading Screen */}
                {isLoading && (
                    <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
                        <Loader2 className="w-16 h-16 text-[#E50914] animate-spin mb-4" />
                        <p className="text-xl font-semibold text-gray-300">Menganalisis preferensi Anda...</p>
                        <p className="text-sm text-gray-400 mt-2">Menghitung score SPK menggunakan metode SAW</p>
                    </div>
                )}

                {/* Results */}
                {showResults && !isLoading && allMovies.length > 0 && (
                    <div className="animate-fade-in mb-12">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold flex items-center gap-2 text-white">
                                <Star className="w-7 h-7 text-[#E50914]" />
                                Rekomendasi Terbaik untuk Anda
                            </h2>
                            <span className="text-gray-400">{allMovies.length} hasil ditemukan</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {currentMovies.map((movie, index) => (
                                <div
                                    key={movie.id}
                                    onClick={() => handleMovieClick(movie.id)}
                                    className="bg-gray-800 bg-opacity-60 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-[#E50914]/20 transition-all duration-300 transform hover:-translate-y-2 cursor-pointer animate-slide-up"
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    <div className="h-72 bg-gradient-to-br from-[#E50914] to-gray-900 overflow-hidden">
                                        {movie.poster_path ? (
                                            <img 
                                                src={`${TMDB_IMAGE_BASE}${movie.poster_path}`}
                                                alt={movie.title}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                    e.target.parentElement.innerHTML = '<div class="w-full h-full flex items-center justify-center text-6xl">🎬</div>';
                                                }}
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-6xl">🎬</div>
                                        )}
                                    </div>

                                    <div className="p-5">
                                        <h3 className="text-lg font-bold mb-2 line-clamp-2 text-white min-h-[3.5rem]">
                                            {movie.title}
                                        </h3>

                                        <div className="flex items-center gap-2 mb-3 flex-wrap">
                                            <span className="text-gray-400 text-sm">
                                                {new Date(movie.release_date).getFullYear()}
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between text-sm mb-3">
                                            <div className="flex items-center gap-1">
                                                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                                <span className="font-semibold text-white">{movie.vote_average?.toFixed(1)}</span>
                                            </div>
                                            <div className="text-gray-400 text-xs">
                                                {movie.vote_count} votes
                                            </div>
                                        </div>

                                        <div className="mt-4 pt-4 border-t border-gray-700">
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs text-gray-400">SPK Score (SAW)</span>
                                                <span className="text-[#E50914] font-bold text-lg">{movie.spkScore}</span>
                                            </div>
                                            <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                                                <div
                                                    className="bg-gradient-to-r from-[#E50914] to-red-400 h-2 rounded-full transition-all duration-500"
                                                    style={{ width: `${movie.spkScore}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center items-center gap-2 mt-8">
                                {/* Previous Button */}
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Previous
                                </button>

                                {/* Page Numbers */}
                                <div className="flex gap-2">
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => {
                                        // Show first page, last page, current page, and pages around current
                                        if (
                                            pageNum === 1 ||
                                            pageNum === totalPages ||
                                            (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                                        ) {
                                            return (
                                                <button
                                                    key={pageNum}
                                                    onClick={() => handlePageChange(pageNum)}
                                                    className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                                                        currentPage === pageNum
                                                            ? 'bg-[#E50914] text-white'
                                                            : 'bg-gray-700 hover:bg-gray-600 text-white'
                                                    }`}
                                                >
                                                    {pageNum}
                                                </button>
                                            );
                                        } else if (
                                            pageNum === currentPage - 2 ||
                                            pageNum === currentPage + 2
                                        ) {
                                            return <span key={pageNum} className="px-2 text-gray-500">...</span>;
                                        }
                                        return null;
                                    })}
                                </div>

                                {/* Next Button */}
                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Next
                                </button>
                            </div>
                        )}

                        {/* Page Info */}
                        <div className="text-center mt-4 text-gray-400 text-sm">
                            Halaman {currentPage} dari {totalPages} • Menampilkan {indexOfFirstMovie + 1}-{Math.min(indexOfLastMovie, allMovies.length)} dari {allMovies.length} film
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {!showResults && !isLoading && (
                    <div className="text-center py-20 mb-12">
                        <Film className="w-20 h-20 text-gray-600 mx-auto mb-4" />
                        <p className="text-xl text-gray-400">Silakan atur filter dan klik "Cari Rekomendasi"</p>
                        <p className="text-sm text-gray-500 mt-2">untuk mendapatkan film yang sesuai dengan preferensi Anda</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MovieRecommendationSPK;