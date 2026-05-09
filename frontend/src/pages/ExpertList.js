import React, { useState, useEffect } from 'react';
import { expertAPI } from '../services/api';
import { Link } from 'react-router-dom';

import BBTransition from '../components/BBTransition/BBTransition';
import BBGlitchButton from '../components/BBGlitchButton/BBGlitchButton';

const ExpertList = () => {
  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');


  const categories = [
    'All',
    'Web Development',
    'Mobile Development',
    'UI/UX Design',
    'Data Science',
    'Cloud Architecture',
  ];

  const fetchExperts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await expertAPI.getExperts(page, 10, category, search);
      setExperts(response.data.experts);
      setTotalPages(response.data.pagination.pages);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch experts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
  }, [category, search]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchExperts();
  }, [page, category, search]);

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

return (
    <div className="space-y-8 bb-backdrop">

      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-2">Find Your Expert</h1>
        <p className="text-slate-400">Discover and book sessions with top-rated professionals</p>
      </div>

      <div className="flex gap-4 flex-col md:flex-row">
        <input
          type="text"
          placeholder="Search by expert name..."
          value={search}
          onChange={handleSearchChange}
          className="flex-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200"
        />
        <select
          value={category}
          onChange={handleCategoryChange}
          className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat} className="bg-slate-900">
              {cat}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="relative w-16 h-16 rounded-full bg-gradient-to-r from-blue-500/25 to-purple-500/25 border border-white/10 bb-shimmer" />

          <div className="relative">
            <div className="w-12 h-12 border-4 border-slate-700 rounded-full"></div>
            <div className="absolute top-0 left-0 w-12 h-12 border-4 border-blue-500 rounded-full animate-spin" style={{borderTopColor: 'transparent', borderRightColor: 'transparent'}}></div>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {experts.map((expert) => (
              <div key={expert._id} className="bg-slate-800 rounded-lg overflow-hidden border border-slate-700 hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300 transform hover:scale-105">
                <div className="relative h-48 overflow-hidden bg-slate-700">
                  <img
                    src={expert.profileImage}
                    alt={expert.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-white">{expert.name}</h3>
                    <p className="text-sm text-blue-400 mt-1">{expert.category}</p>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-yellow-400">⭐ {expert.rating}</span>
                    <span className="text-slate-300">{expert.experience} yrs exp</span>
                  </div>
                  
                  <div className="pt-2 border-t border-slate-700">
                    <p className="text-2xl font-bold text-white">${expert.hourlyRate}<span className="text-sm text-slate-400">/hour</span></p>
                  </div>
                  
                  <Link 
                    to={`/expert/${expert._id}`}
                    className="block w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-200 text-center"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {experts.length === 0 && !loading && (
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-8 text-center">
              <p className="text-slate-400 text-lg">No experts found. Try adjusting your search or filters.</p>
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {page > 1 && (
                <button 
                  onClick={() => setPage(page - 1)}
                  className="px-4 py-2 bg-slate-800 border border-slate-700 text-white rounded-lg hover:bg-slate-700 transition-colors duration-200"
                >
                  ← Previous
                </button>
              )}
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                const startPage = Math.max(1, page - 2);
                return startPage + i;
              }).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
                    page === p
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                      : 'bg-slate-800 border border-slate-700 text-white hover:bg-slate-700'
                  }`}
                >
                  {p}
                </button>
              ))}
              {page < totalPages && (
                <button 
                  onClick={() => setPage(page + 1)}
                  className="px-4 py-2 bg-slate-800 border border-slate-700 text-white rounded-lg hover:bg-slate-700 transition-colors duration-200"
                >
                  Next →
                </button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ExpertList;
