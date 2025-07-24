import { useState } from "react";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false); // reset on resubmit

    const formData = { name, email, message };
    try {
      const res = await fetch(import.meta.env.VITE_API_BASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        setName("");
        setEmail("");
        setMessage("");
      } else {
        alert("Something went wrong.");
      }
    } catch (err) {
      console.error(err);
      alert("Error sending message.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white px-4 py-16 font-urbanist">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-5xl font-extrabold text-gray-900 mb-4">Contact Us</h1>
        <p className="text-gray-600 text-lg mb-10">
          We'd love to hear from you! Fill out the form below and we'll get back to you soon.
        </p>
      </div>

      {success && (
        <div className="max-w-xl mx-auto mb-6 p-4 bg-green-50 border border-green-400 text-green-700 rounded-lg shadow-md text-center font-medium animate-fade-in">
          ✅ Your message has been sent successfully!
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="max-w-xl mx-auto space-y-6 bg-white p-8 rounded-xl shadow-lg border border-gray-100 transition-transform hover:shadow-xl"
        noValidate
      >
        <input
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />

        <input
          type="email"
          placeholder="Your Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />

        <textarea
          placeholder="Your Message"
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        ></textarea>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold px-6 py-3 rounded-lg transition duration-300 disabled:opacity-50 shadow-md"
        >
          {loading ? "Sending…" : "Send Message"}
        </button>
      </form>
    </div>
  );
}
