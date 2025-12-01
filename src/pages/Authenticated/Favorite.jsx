import React, { useState, useEffect } from 'react';
import { Heart, Star, Trash2, Film, Calendar } from 'lucide-react';
import Header from '../../components/Header';
import { useAuth0 } from '@auth0/auth0-react';
import { Navigate } from 'react-router-dom';

const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

const Favorites = () => {
    const { user, isAuthenticated } = useAuth0();
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        loadFavorites();
    }, []);

    const loadFavorites = () => {
        const savedFavorites = localStorage.getItem('movieFavorites');
        if (savedFavorites) {
            setFavorites(JSON.parse(savedFavorites));
        }
    };

    const removeFromFavorites = (movieId) => {
        const updatedFavorites = favorites.filter(movie => movie.id !== movieId);
        setFavorites(updatedFavorites);
        localStorage.setItem('movieFavorites', JSON.stringify(updatedFavorites));
    };

    const clearAllFavorites = () => {
        if (window.confirm('Apakah Anda yakin ingin menghapus semua film favorit?')) {
            setFavorites([]);
            localStorage.removeItem('movieFavorites');
        }
    };

    const handleMovieClick = (movieId) => {
        window.open(`/movie/${movieId}`, '_blank');
    };

    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return (
        <div>
            <Header />
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6">
                <style>{`
          * {
            font-family: 'Poppins', sans-serif;
          }
          .animate-fade-in {
            animation: fadeIn 0.5s ease-in;
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>

                <div className="lg:w-[85%] mx-auto">
                    {isAuthenticated && user && (
                        <div className="py-10">
                            <img
                                className="mt-20 rounded-full border-4 border-[#E50914] shadow-lg shadow-[#E50914]/30"
                                width={100}
                                src={user.picture}
                                alt="User Avatar"
                            />
                            <h1 className="mt-3 text-white text-2xl md:text-3xl font-semibold">
                                Daftar Tonton <span className="text-primary">{user.name}</span>
                            </h1>
                        </div>
                    )}

                    <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-2xl shadow-2xl p-6 mb-8">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold flex items-center gap-2 text-white">
                                <Heart className="w-7 h-7 text-[#E50914] fill-[#E50914]" />
                                Daftar Tonton Saya
                            </h2>
                            {favorites.length > 0 && (
                                <button
                                    onClick={clearAllFavorites}
                                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    Hapus Semua
                                </button>
                            )}
                        </div>

                        {favorites.length === 0 ? (
                            <div className="text-center py-20">
                                <Heart className="w-20 h-20 text-gray-600 mx-auto mb-4" />
                                <p className="text-xl text-gray-400">Belum ada film favorit</p>
                                <p className="text-sm text-gray-500 mt-2">
                                    Tambahkan film favorit dari halaman rekomendasi
                                </p>
                            </div>
                        ) : (
                            <>
                                <p className="text-gray-400 mb-6">{favorites.length} film tersimpan</p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {favorites.map((movie, index) => (
                                        <div
                                            key={movie.id}
                                            className="bg-gray-800 bg-opacity-60 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-[#E50914]/20 transition-all duration-300 transform hover:-translate-y-2 animate-fade-in"
                                            style={{ animationDelay: `${index * 100}ms` }}
                                        >
                                            <div
                                                className="h-72 bg-gradient-to-br from-[#E50914] to-gray-900 overflow-hidden cursor-pointer"
                                                onClick={() => handleMovieClick(movie.id)}
                                            >
                                                {movie.poster_path ? (
                                                    <img
                                                        src={`${TMDB_IMAGE_BASE}${movie.poster_path}`}
                                                        alt={movie.title}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-6xl">🎬</div>
                                                )}
                                            </div>

                                            <div className="p-5">
                                                <h3 className="text-lg font-bold mb-2 line-clamp-2 text-white min-h-[3.5rem]">
                                                    {movie.title}
                                                </h3>

                                                <div className="flex items-center gap-2 mb-3">
                                                    <Calendar className="w-4 h-4 text-gray-400" />
                                                    <span className="text-gray-400 text-sm">
                                                        {new Date(movie.release_date).getFullYear()}
                                                    </span>
                                                </div>

                                                <div className="flex items-center justify-between text-sm mb-3">
                                                    <div className="flex items-center gap-1">
                                                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                                        <span className="font-semibold text-white">
                                                            {movie.vote_average?.toFixed(1)}
                                                        </span>
                                                    </div>
                                                    <div className="text-gray-400 text-xs">
                                                        {movie.vote_count} votes
                                                    </div>
                                                </div>

                                                {movie.topsisScore && (
                                                    <div className="mt-4 pt-4 border-t border-gray-700">
                                                        <div className="flex items-center justify-between mb-2">
                                                            <span className="text-xs text-gray-400">TOPSIS Score</span>
                                                            <span className="text-[#E50914] font-bold text-lg">
                                                                {movie.topsisScore}
                                                            </span>
                                                        </div>
                                                        <div className="w-full bg-gray-700 rounded-full h-2">
                                                            <div
                                                                className="bg-gradient-to-r from-[#E50914] to-red-400 h-2 rounded-full transition-all duration-500"
                                                                style={{ width: `${movie.topsisScore}%` }}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                )}

                                                <button
                                                    onClick={() => removeFromFavorites(movie.id)}
                                                    className="w-full mt-4 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                    Hapus dari Favorit
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Favorites;