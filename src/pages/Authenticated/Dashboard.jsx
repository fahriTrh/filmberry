import React, { useState, useEffect, useRef } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Film, Star, Clock, Globe, Calendar, Loader2, TrendingUp, Filter } from 'lucide-react';
import { useAuth0 } from "@auth0/auth0-react";
import Header from '../../components/Header';

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

    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    const [isLoading, setIsLoading] = useState(false);
    const [showResults, setShowResults] = useState(false);
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

    const genres = ['Action', 'Drama', 'Comedy', 'Horror', 'Sci-Fi', 'Romance', 'Thriller', 'Documentary'];
    const countries = ['USA', 'Korea', 'Japan', 'UK', 'Indonesia', 'India', 'France'];
    const years = ['2024', '2023', '2022', '2021', '2020', '2019-2015'];
    const durations = ['< 90 min', '90-120 min', '120-150 min', '> 150 min'];
    const statuses = ['Semua', 'Ongoing', 'Completed'];

    const movieResults = [
        { id: 1, title: 'The Last Guardian', genre: 'Action', rating: 8.5, year: 2024, country: 'USA', poster: '🎬', score: 92 },
        { id: 2, title: 'Silent Dreams', genre: 'Drama', rating: 8.8, year: 2023, country: 'Korea', poster: '🎭', score: 89 },
        { id: 3, title: 'Cyber Nation', genre: 'Sci-Fi', rating: 8.2, year: 2024, country: 'USA', poster: '🤖', score: 87 },
        { id: 4, title: 'Love in Tokyo', genre: 'Romance', rating: 7.9, year: 2023, country: 'Japan', poster: '💕', score: 85 },
        { id: 5, title: 'The Haunting', genre: 'Horror', rating: 8.0, year: 2024, country: 'UK', poster: '👻', score: 83 },
        { id: 6, title: 'Comedy Night', genre: 'Comedy', rating: 7.5, year: 2023, country: 'USA', poster: '😂', score: 80 }
    ];

    const handleSubmit = () => {
        setIsLoading(true);
        setShowResults(false);

        setTimeout(() => {
            setIsLoading(false);
            setShowResults(true);
        }, 2000);
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
                                <option value="">Pilih Genre</option>
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
                                <option value="">Pilih Negara</option>
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
                                <option value="">Pilih Tahun</option>
                                {years.map(y => <option key={y} value={y}>{y}</option>)}
                            </select>
                        </div>

                        {/* Duration */}
                        <div className="transition-all duration-200">
                            <label className="block text-sm font-medium mb-2 text-gray-300 flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                Durasi
                            </label>
                            <select
                                value={filters.duration}
                                onChange={(e) => setFilters({ ...filters, duration: e.target.value })}
                                className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#E50914] focus:border-transparent transition-all duration-200"
                            >
                                <option value="">Pilih Durasi</option>
                                {durations.map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                        </div>

                        {/* Status */}
                        <div className="transition-all duration-200">
                            <label className="block text-sm font-medium mb-2 text-gray-300">Status</label>
                            <select
                                value={filters.status}
                                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                                className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#E50914] focus:border-transparent transition-all duration-200"
                            >
                                <option value="">Pilih Status</option>
                                {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* Weight Sliders */}
                    <div className="bg-gray-900 bg-opacity-40 rounded-xl p-6 mb-6">
                        <h3 className="text-lg font-semibold mb-4 text-[#E50914] flex items-center gap-2">
                            <TrendingUp className="w-5 h-5" />
                            Bobot Kriteria
                        </h3>

                        <div className="space-y-5">
                            <div>
                                <div className="flex justify-between mb-2">
                                    <label className="text-sm font-medium text-gray-300">Rating</label>
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
                            className="flex-1 bg-[#E50914] hover:bg-[#b8070f] text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-[#E50914]/50"
                        >
                            Cari Rekomendasi
                        </button>
                        <button
                            onClick={handleReset}
                            className="flex-1 sm:flex-initial bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105"
                        >
                            Reset Filter
                        </button>
                    </div>
                </div>

                {/* Loading Screen */}
                {isLoading && (
                    <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
                        <Loader2 className="w-16 h-16 text-[#E50914] animate-spin mb-4" />
                        <p className="text-xl font-semibold text-gray-300">Menganalisis preferensi Anda...</p>
                        <p className="text-sm text-gray-400 mt-2">Mohon tunggu sebentar</p>
                    </div>
                )}

                {/* Results */}
                {showResults && !isLoading && (
                    <div className="animate-fade-in mb-12">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold flex items-center gap-2 text-white">
                                <Star className="w-7 h-7 text-[#E50914]" />
                                Rekomendasi untuk Anda
                            </h2>
                            <span className="text-gray-400">{movieResults.length} hasil</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {movieResults.map((movie, index) => (
                                <div
                                    key={movie.id}
                                    className="bg-gray-800 bg-opacity-60 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-[#E50914]/20 transition-all duration-300 transform hover:-translate-y-2 cursor-pointer animate-slide-up"
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    <div className="h-48 bg-gradient-to-br from-[#E50914] to-gray-900 flex items-center justify-center text-6xl">
                                        {movie.poster}
                                    </div>

                                    <div className="p-5">
                                        <h3 className="text-lg font-bold mb-2 line-clamp-1 text-white">{movie.title}</h3>

                                        <div className="flex items-center gap-2 mb-3">
                                            <span className="bg-[#E50914] text-white text-xs px-2 py-1 rounded">{movie.genre}</span>
                                            <span className="text-gray-400 text-sm">{movie.year}</span>
                                        </div>

                                        <div className="flex items-center justify-between text-sm">
                                            <div className="flex items-center gap-1">
                                                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                                <span className="font-semibold text-white">{movie.rating}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Globe className="w-4 h-4 text-gray-400" />
                                                <span className="text-gray-400">{movie.country}</span>
                                            </div>
                                        </div>

                                        <div className="mt-4 pt-4 border-t border-gray-700">
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs text-gray-400">SPK Score</span>
                                                <span className="text-[#E50914] font-bold text-lg">{movie.score}</span>
                                            </div>
                                            <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                                                <div
                                                    className="bg-gradient-to-r from-[#E50914] to-red-400 h-2 rounded-full transition-all duration-500"
                                                    style={{ width: `${movie.score}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
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