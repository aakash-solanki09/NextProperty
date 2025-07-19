import house1 from "../assets/house1.jpg";
import house2 from "../assets/house2.jpg";

export default function About() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-64px)] bg-gray-100 text-black px-4 py-20 font-urbanist mt-16">
      <div className="flex-grow">
        <h1 className="text-4xl font-bold text-center mb-8">About NextProperty</h1>
        <p className="text-center max-w-3xl mx-auto text-gray-700 mb-10">
          We help you find the best real estate deals. Trusted by thousands across the country.
        </p>

        <div className="grid sm:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {[house1, house2].map((img, idx) => (
            <div key={idx} className="bg-white rounded-xl shadow p-4">
              <img src={img} className="rounded-xl h-52 w-full object-cover mb-4" />
              <h3 className="text-lg font-bold">Beautiful Property #{idx + 1}</h3>
              <p className="text-sm text-gray-600">Lorem ipsum dolor sit amet, consectetur.</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
