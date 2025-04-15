import { useNavigate } from 'react-router-dom';

export default function PokemonCard({ p }) {
  const navigate = useNavigate();

  const typeGradients = {
    grass: 'bg-gradient-to-br from-green-200 to-green-400',
    fire: 'bg-gradient-to-br from-orange-200 to-red-400',
    water: 'bg-gradient-to-br from-blue-200 to-blue-500',
    bug: 'bg-gradient-to-br from-lime-200 to-lime-400',
    poison: 'bg-gradient-to-br from-purple-200 to-purple-400',
    flying: 'bg-gradient-to-br from-indigo-200 to-indigo-400',
    normal: 'bg-gradient-to-br from-gray-300 to-gray-400',
    electric: 'bg-gradient-to-br from-yellow-200 to-yellow-400',
    ground: 'bg-gradient-to-br from-yellow-300 to-yellow-500',
    fairy: 'bg-gradient-to-br from-pink-200 to-pink-400',
    psychic: 'bg-gradient-to-br from-pink-300 to-pink-500',
    rock: 'bg-gradient-to-br from-yellow-400 to-yellow-600',
    ghost: 'bg-gradient-to-br from-indigo-400 to-indigo-600',
    dark: 'bg-gradient-to-br from-gray-600 to-gray-800',
    steel: 'bg-gradient-to-br from-gray-400 to-gray-500',
    ice: 'bg-gradient-to-br from-cyan-200 to-cyan-400',
    dragon: 'bg-gradient-to-br from-purple-400 to-indigo-600',
    fighting: 'bg-gradient-to-br from-red-300 to-red-500',
    default: 'bg-gradient-to-br from-gray-100 to-gray-300',
  };

  const primaryType = p.types?.[0]?.type?.name || 'default';
  const bgColor = typeGradients[primaryType] || typeGradients.default;

  return (
    <div
      className={`rounded-2xl p-4 ${bgColor} shadow-md hover:shadow-lg hover:shadow-white/30 hover:scale-105 transition-all duration-200 cursor-pointer`}
      onClick={() => navigate(`/pokemon/${p.name}`)}
    >
      <div className="flex flex-col items-center justify-center text-center">
        <span className="text-xs font-bold text-gray-600">#{p.id}</span>
        <img src={p.sprites.front_default} alt={p.name} className="w-20 h-20 my-2" />
        <h3 className="text-md font-semibold capitalize text-gray-900">{p.name}</h3>
        <div className="flex gap-2 mt-2 flex-wrap justify-center">
          {p.types.map(t => (
            <span
              key={t.slot}
              className="bg-white/70 text-gray-800 px-2 py-1 text-xs rounded-full font-medium"
            >
              {t.type.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
