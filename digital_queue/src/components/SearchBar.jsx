import React, { useState } from 'react';
import { Search, MapPin, X } from 'lucide-react';

export default function SearchBar({
  initialValue = '',
  onSearch,
  placeholder = 'Search hospital, clinic, pharmacy or PIN code (e.g. 600040)...'
}) {
  const [query, setQuery] = useState(initialValue);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(query);
  };

  const handleClear = () => {
    setQuery('');
    if (onSearch) onSearch('');
  };

  return (
    <form onSubmit={handleSubmit} className="w-full relative">
      <div className="relative flex items-center">
        <div className="absolute left-4 text-slate-400 pointer-events-none flex items-center">
          <Search className="w-5 h-5 text-sky-600" />
        </div>
        <input
          type="text"
          id="service-search-input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-11 pr-24 py-3.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder-slate-400 shadow-xs focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-600 transition"
        />
        <div className="absolute right-2.5 flex items-center gap-1.5">
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            type="submit"
            className="px-3.5 py-2 bg-sky-700 hover:bg-sky-800 text-white rounded-lg text-xs font-semibold transition cursor-pointer shadow-xs"
          >
            Search
          </button>
        </div>
      </div>
      <div className="flex items-center gap-2 mt-2 px-1 text-xs text-slate-500">
        <MapPin className="w-3.5 h-3.5 text-slate-400" />
        <span>Quick search:</span>
        <button
          type="button"
          onClick={() => { setQuery('600040'); if (onSearch) onSearch('600040'); }}
          className="text-sky-700 hover:underline font-medium"
        >
          PIN 600040
        </button>
        <span>•</span>
        <button
          type="button"
          onClick={() => { setQuery('ABC Multispeciality'); if (onSearch) onSearch('ABC Multispeciality'); }}
          className="text-sky-700 hover:underline font-medium"
        >
          ABC Multispeciality
        </button>
        <span>•</span>
        <button
          type="button"
          onClick={() => { setQuery('OPD Registration'); if (onSearch) onSearch('OPD Registration'); }}
          className="text-sky-700 hover:underline font-medium"
        >
          OPD
        </button>
      </div>
    </form>
  );
}
