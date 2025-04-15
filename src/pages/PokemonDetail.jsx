import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const typeGradients = {
  normal: 'bg-gradient-to-br from-gray-300 to-gray-500 text-black',
  fire: 'bg-gradient-to-br from-orange-400 to-red-500 text-white',
  water: 'bg-gradient-to-br from-blue-400 to-blue-600 text-white',
  electric: 'bg-gradient-to-br from-yellow-300 to-yellow-500 text-black',
  grass: 'bg-gradient-to-br from-green-400 to-green-600 text-black',
  ice: 'bg-gradient-to-br from-cyan-300 to-cyan-500 text-black',
  fighting: 'bg-gradient-to-br from-red-600 to-red-800 text-white',
  poison: 'bg-gradient-to-br from-purple-500 to-purple-700 text-white',
  ground: 'bg-gradient-to-br from-yellow-600 to-yellow-800 text-white',
  flying: 'bg-gradient-to-br from-indigo-300 to-indigo-500 text-black',
  psychic: 'bg-gradient-to-br from-pink-400 to-pink-600 text-black',
  bug: 'bg-gradient-to-br from-lime-400 to-lime-600 text-black',
  rock: 'bg-gradient-to-br from-yellow-700 to-yellow-900 text-white',
  ghost: 'bg-gradient-to-br from-purple-700 to-purple-900 text-white',
  dragon: 'bg-gradient-to-br from-indigo-700 to-indigo-900 text-white',
  dark: 'bg-gradient-to-br from-gray-700 to-black text-white',
  steel: 'bg-gradient-to-br from-gray-400 to-gray-600 text-white',
  fairy: 'bg-gradient-to-br from-pink-200 to-pink-400 text-black',
  default: 'bg-gray-400 text-white',
};


export default function PokemonDetail() {
  const { name } = useParams();
  const navigate = useNavigate();
  const [pokemon, setPokemon] = useState(null);
  const [species, setSpecies] = useState(null);
  const [evolutions, setEvolutions] = useState([]);
  const [forms, setForms] = useState([]);
  const [weaknesses, setWeaknesses] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
      const data = await res.json();
      setPokemon(data);

      const speciesRes = await fetch(data.species.url);
      const speciesData = await speciesRes.json();
      setSpecies(speciesData);

      const typePromises = data.types.map(t => fetch(t.type.url).then(res => res.json()));
      const typeData = await Promise.all(typePromises);
      const weaknessesRaw = typeData.flatMap(t => t.damage_relations.double_damage_from.map(x => x.name));
      setWeaknesses([...new Set(weaknessesRaw)]);

      const evoRes = await fetch(speciesData.evolution_chain.url);
      const evoData = await evoRes.json();
      const chain = [];

      let current = evoData.chain;
      while (current) {
        const evoName = current.species.name;
        const pokeRes = await fetch(`https://pokeapi.co/api/v2/pokemon/${evoName}`);
        const pokeData = await pokeRes.json();
        chain.push({ name: evoName, sprite: pokeData.sprites.front_default });
        current = current.evolves_to[0];
      }
      setEvolutions(chain);

      const formVariants = speciesData.varieties.filter(v => !v.is_default);
      const loadedForms = await Promise.all(
        formVariants.map(async v => {
          const formData = await fetch(v.pokemon.url).then(res => res.json());
          return { name: v.pokemon.name, sprite: formData.sprites.front_default };
        })
      );
      setForms(loadedForms);
    }

    fetchData();
  }, [name]);

  if (!pokemon || !species) return <p className="text-white text-center">Loading...</p>;

  const stats = pokemon.stats.map(s => s.base_stat);
  const statNames = pokemon.stats.map(s => s.stat.name);
  const maxStat = 150;

  const getPoint = (i, value, total) => {
    const angle = (Math.PI * 2 * i) / total - Math.PI / 2;
    const radius = 140 * (value / maxStat); 
    return {
      x: 250 + radius * Math.cos(angle), 
      y: 250 + radius * Math.sin(angle),
    };
  };
  

  const points = stats.map((val, i) => {
    const { x, y } = getPoint(i, val, stats.length);
    return `${x},${y}`;
  });

  const flavor = species.flavor_text_entries.find(f => f.language.name === 'en')?.flavor_text
    .replace(/[\f\n\r]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const convertHeight = (dm) => {
    const inches = dm * 3.937;
    const feet = Math.floor(inches / 12);
    const rest = Math.round(inches % 12);
    return `${feet}' ${rest}"`;
  };

  const convertWeight = (hg) => `${(hg * 0.2205).toFixed(1)} lbs`;

  return (
<div className="min-h-screen bg-gradient-to-br from-[#000428] to-[#004e92] text-white p-6">
      <h1 className="text-3xl font-bold capitalize text-center mb-6">{pokemon.name}</h1>

      <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">

        {/* Image + text*/}
        <div className="bg-white/10 backdrop-blur-md p-4 rounded-lg shadow text-center">
          <img src={pokemon.sprites.front_default} alt={pokemon.name} className="w-60 h-60 mx-auto mb-4" />
          <p className="italic text-sm text-gray-300">{flavor}</p>
        </div>

        {/* Stat bar */}
        <div className="bg-white/10 backdrop-blur-md p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4 text-center">Base Stats</h3>
          <div className="space-y-3">
            {pokemon.stats.map((stat, i) => (
              <div key={i}>
                <div className="flex justify-between mb-1 text-sm">
                  <span className="capitalize">{stat.stat.name}</span>
                  <span>{stat.base_stat}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-green-400 to-green-600"
                    style={{ width: `${(stat.base_stat / maxStat) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Details Box */}
        <div className="bg-white/10 backdrop-blur-md p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-3">Details</h3>
          <div className="space-y-2 text-sm">
            <p><strong>Height:</strong> {convertHeight(pokemon.height)}</p>
            <p><strong>Weight:</strong> {convertWeight(pokemon.weight)}</p>
            <p><strong>Types:</strong> {pokemon.types.map(t => t.type.name).join(', ')}</p>
            <p><strong>Abilities:</strong> {pokemon.abilities.map(a => a.ability.name).join(', ')}</p>
            <p><strong>Egg Groups:</strong> {species.egg_groups.map(g => g.name).join(', ')}</p>
          </div>
        </div>

        {/* Weaknesses + Moves */}
        <div className="bg-white/10 backdrop-blur-md p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-3">Weaknesses</h3>
          <div className="flex flex-wrap gap-3 mb-4">
            {weaknesses.map(type => (
             <span key={type} className={`px-3 py-1 rounded-full shadow ${typeGradients[type] || typeGradients.default}`}>
             {type}
           </span>
          
            ))}
          </div>

          <h3 className="text-lg font-semibold mb-3">Moves</h3>
          <div className="flex flex-wrap gap-2 text-sm">
            {pokemon.moves.slice(0, 8).map((m, i) => (
              <span
                key={i}
                className="bg-gradient-to-br from-sky-500 to-indigo-500 px-3 py-1 rounded-full text-white shadow hover:scale-105 transition-all"
              >
                {m.move.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Evolutions + Forms*/}
      <div className="mt-12 flex justify-between gap-6 max-w-6xl mx-auto px-4 flex-wrap">
        {evolutions.length > 1 && (
          <div className="w-full md:w-[48%]">
            <h3 className="text-lg font-semibold mb-3 text-center">Evolution Chain</h3>
            <div className="flex justify-center gap-4 flex-wrap">
              {evolutions.map(evo => (
                <div
                  key={evo.name}
                  onClick={() => navigate(`/pokemon/${evo.name}`)}
                  className="cursor-pointer flex flex-col items-center p-2 bg-white/10 backdrop-blur-md rounded-xl hover:scale-105 transition"
                >
                  <img src={evo.sprite} alt={evo.name} className="w-16 h-16" />
                  <span className="capitalize mt-1">{evo.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        {forms.length > 0 && (
          <div className="w-full md:w-[48%]">
            <h3 className="text-lg font-semibold mb-3 text-center">Alternate Forms</h3>
            <div className="flex justify-center gap-4 flex-wrap">
              {forms.map(form => (
                <div
                  key={form.name}
                  onClick={() => navigate(`/pokemon/${form.name}`)}
                  className="cursor-pointer flex flex-col items-center p-2 bg-white/10 backdrop-blur-md rounded-xl hover:scale-105 transition"
                >
                  <img src={form.sprite} alt={form.name} className="w-16 h-16" />
                  <span className="capitalize mt-1">{form.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
