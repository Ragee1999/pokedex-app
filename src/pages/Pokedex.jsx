import { useEffect, useState } from 'react';
import PokemonCard from '../components/PokemonCard';

const POKEMON_LIMIT = 15;

function Pokedex() {
  const [allPokemon, setAllPokemon] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    async function fetchFirstPage() {
      setLoading(true);

      const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=15');
      const data = await res.json();
      const firstDetailed = await Promise.all(
        data.results.map(p => fetch(p.url).then(res => res.json()))
      );

      setAllPokemon(firstDetailed);
      setLoading(false);

      // Start background loading
      fetchRemaining();
    }

    async function fetchRemaining() {
      const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1025');
      const data = await res.json();

      const allDetailed = await Promise.all(
        data.results.map(p => fetch(p.url).then(res => res.json()))
      );

      setAllPokemon(allDetailed);
    }

    fetchFirstPage();
  }, []);

  useEffect(() => {
    const filteredList = allPokemon.filter(p =>
      p.name.toLowerCase().includes(search.toLowerCase()) &&
      (typeFilter === '' || p.types.some(t => t.type.name === typeFilter))
    );
    setFiltered(filteredList);
    setCurrentPage(0);
  }, [search, typeFilter, allPokemon]);

  const paginated = filtered.slice(
    currentPage * POKEMON_LIMIT,
    (currentPage + 1) * POKEMON_LIMIT
  );

  const totalPages = Math.ceil(filtered.length / POKEMON_LIMIT);

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-[#000428] to-[#004e92] text-white">
      <h1 className="text-4xl font-bold text-center text-white mb-6">Pokédex</h1>

      <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
        <input
          type="text"
          placeholder="Search Pokémon..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="px-4 py-2 rounded-md text-black w-full sm:w-64"
        />
        <select
          value={typeFilter}
          onChange={e => setTypeFilter(e.target.value)}
          className="px-4 py-2 rounded-md text-black w-full sm:w-48"
        >
          <option value="">All Types</option>
          {[
            'grass', 'fire', 'water', 'bug', 'poison', 'flying', 'normal',
            'electric', 'fairy', 'psychic', 'rock', 'ghost', 'dark', 'steel',
            'ice', 'dragon', 'fighting'
          ].map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className="text-center text-lg">Loading Pokémon...</p>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 max-w-6xl mx-auto">
            {paginated.map(p => (
              <PokemonCard key={p.id} p={p} />
            ))}
          </div>

          <div className="flex justify-center mt-10 gap-4">
            <button
              disabled={currentPage === 0}
              onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
              className={`px-4 py-2 rounded ${
                currentPage === 0
                  ? 'bg-gray-500 cursor-not-allowed'
                  : 'bg-indigo-500 hover:bg-indigo-600'
              } text-white transition`}
            >
              Previous
            </button>
            <span className="self-center">
              Page {currentPage + 1} of {totalPages}
            </span>
            <button
              disabled={currentPage + 1 >= totalPages}
              onClick={() => setCurrentPage(p => p + 1)}
              className={`px-4 py-2 rounded ${
                currentPage + 1 >= totalPages
                  ? 'bg-gray-500 cursor-not-allowed'
                  : 'bg-indigo-500 hover:bg-indigo-600'
              } text-white transition`}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Pokedex;

