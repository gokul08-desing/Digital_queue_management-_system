import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import LocationCard from '../components/LocationCard';
import LoadingState from '../components/LoadingState';
import EmptyState from '../components/EmptyState';
import { api } from '../services/api';
import { Building2, Filter, ArrowLeft } from 'lucide-react';

export default function SearchResultsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const q = searchParams.get('q') || '';
    setQuery(q);
    setLoading(true);
    setError(null);
    api.searchLocations(q)
      .then((data) => {
        setResults(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('[SearchResultsPage] API error:', err);
        setError(err.message || 'Failed to reach the backend. Is Flask running?');
        setResults([]);
        setLoading(false);
      });
  }, [searchParams]);

  const handleSearch = (newQuery) => {
    setSearchParams(newQuery ? { q: newQuery } : {});
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Back Link */}
      <div>
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 mb-3"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight font-display">
          Search Service Locations
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Find hospitals, diagnostic clinics, or public counters by PIN code, facility name, or area.
        </p>
      </div>

      {/* Search Bar */}
      <div className="max-w-2xl">
        <SearchBar initialValue={query} onSearch={handleSearch} />
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between pt-2 border-b border-slate-200 pb-3">
        <div className="text-xs font-semibold text-slate-600 flex items-center gap-2">
          <span>
            Found <strong className="text-slate-900">{results.length}</strong> {results.length === 1 ? 'location' : 'locations'}
          </span>
          {query && (
            <span className="bg-sky-50 text-sky-800 px-2 py-0.5 rounded-md border border-sky-200">
              Matching "{query}"
            </span>
          )}
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <strong>Backend error:</strong> {error}
        </div>
      )}

      {/* Results List */}
      {loading ? (
        <LoadingState message="Searching verified service locations..." />
      ) : results.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {results.map((hospital) => (
            <LocationCard key={hospital.id} hospital={hospital} />
          ))}
        </div>
      ) : !error ? (
        <EmptyState
          title="No service locations found"
          description={`No facilities matched "${query}". Try searching for PIN "600040", "Anna Nagar", or "ABC Multispeciality".`}
          actionLabel="View All Locations"
          onAction={() => handleSearch('')}
        />
      ) : null}
    </div>
  );
}
