import { Routes, Route, Link } from 'react-router-dom';
import Pokedex from './pages/Pokedex';
import About from './pages/About';
import PokemonDetail from './pages/PokemonDetail';




function App() {
  return (
    <div>
     <nav className="bg-gradient-to-r from-black via-gray-900 to-black text-white p-4 shadow-md flex gap-4 font-semibold sticky top-0 z-50">
  <Link to="/" className="hover:underline">Pokédex</Link>
  <Link to="/about" className="hover:underline">About</Link>
</nav>

      <Routes>
        <Route path="/" element={<Pokedex />} />
        <Route path="/about" element={<About />} />
        <Route path="/pokemon/:name" element={<PokemonDetail />} />
      </Routes>
    </div>
  );
}

export default App;
