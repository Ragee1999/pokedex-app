export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#000428] to-[#004e92] text-white flex items-center justify-center">
      <div className="max-w-xl text-center p-6">
        <h2 className="text-3xl font-bold mb-4">About this project</h2>
        <p className="mb-2">
          In this WEB2 assignment I built a Pokédex using React + Vite + PokéAPI + TailwindCSS.
        </p>
        <p className="text-sm text-gray-300">
          I currently retrieve a limit of 1025 Pokémon, since that's the Pokédex official number.
        </p>
      </div>
    </div>
  );
}
