function About() {
    return (
        <div className="max-w-6xl mx-auto p-10">

            <h1 className="text-5xl font-bold text-green-700">
                About HerbalLife
            </h1>

            <p className="mt-8 text-lg leading-8">
                HerbalLife is dedicated to helping people achieve a
                healthier lifestyle through scientifically developed
                nutrition products. Every product we offer is crafted
                from carefully sourced natural ingredients, tested for
                quality, and designed to fit real, everyday routines.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">

                <div className="shadow-lg rounded-xl p-6">
                    <h2 className="text-2xl font-semibold text-green-700 mb-3">
                        Our Mission
                    </h2>
                    <p className="text-gray-600">
                        To make plant-based, science-backed nutrition
                        accessible to everyone — without compromise on
                        quality or transparency.
                    </p>
                </div>

                <div className="shadow-lg rounded-xl p-6">
                    <h2 className="text-2xl font-semibold text-green-700 mb-3">
                        Our Promise
                    </h2>
                    <p className="text-gray-600">
                        Every batch is quality-checked, every ingredient
                        is disclosed, and every product is backed by
                        real customer reviews you can read before you buy.
                    </p>
                </div>

                <div className="shadow-lg rounded-xl p-6">
                    <h2 className="text-2xl font-semibold text-green-700 mb-3">
                        Why HerbalLife
                    </h2>
                    <p className="text-gray-600">
                        From protein blends to daily wellness essentials,
                        we build products around your goals — not the
                        other way around.
                    </p>
                </div>

            </div>

            <div className="mt-14 shadow-lg rounded-xl p-8">

                <h2 className="text-3xl font-bold text-green-700 mb-4">
                    Get In Touch
                </h2>

                <p className="text-gray-700">
                    Have a question about an order, a product, or just
                    want to say hello? Reach out to our support team at{" "}
                    <span className="font-semibold">support@herballife.com</span>{" "}
                    and we'll get back to you as soon as we can.
                </p>

            </div>

        </div>
    )
}

export default About;
