export default function Contact() {
  return (
    <div className="min-h-screen bg-white px-4 py-20 font-urbanist mt-20">
      <h1 className="text-4xl font-bold text-center mb-10">Contact Us</h1>
      <form className="max-w-xl mx-auto space-y-6">
        <input type="text" placeholder="Name" className="w-full p-3 border rounded" />
        <input type="email" placeholder="Email" className="w-full p-3 border rounded" />
        <textarea placeholder="Your Message" rows={5} className="w-full p-3 border rounded"></textarea>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded">Send</button>
      </form>
    </div>
  );
}
