function Hero() {
  return (
    <section className="bg-green-50 min-h-[85vh] flex items-center">
      <div className="max-w-7xl mx-auto px-8 grid md:grid-cols-2 gap-10 items-center">

        <div>
          <h1 className="text-5xl font-bold text-green-700 leading-tight">
            Live Healthy,
            <br />
            Live Better 🌿
          </h1>

          <p className="mt-6 text-lg text-gray-700">
            Discover HerbalLife nutrition products designed to support
            weight management, fitness, and overall wellness.
          </p>

          <div className="mt-8 flex gap-4">
            <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg">
              Shop Now
            </button>

            <button className="border border-green-600 text-green-700 hover:bg-green-100 px-6 py-3 rounded-lg">
              Learn More
            </button>
          </div>
        </div>

        <div className="flex justify-center">
          <img
            src="https://images.unsplash.com/photo-1547592180-85f173990554?w=600"
            alt="Healthy Nutrition"
            className="rounded-xl shadow-lg w-full max-w-md"
          />
        </div>

      </div>
    </section>
  );
}

export default Hero;