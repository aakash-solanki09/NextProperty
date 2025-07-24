import { useEffect, useState } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export default function AllContacts() {
  const [contacts, setContacts] = useState([]);
  const [sort, setSort] = useState("desc"); // default: newest
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(null); // Track copied email state
  const [expanded, setExpanded] = useState(null); // Track expanded message state

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}?sort=${sort}&search=${search}`
      );
      const data = await res.json();
      if (data.success) {
        setContacts(data.contacts);
      }
    } catch (error) {
      console.error("Error fetching contacts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const debounce = setTimeout(() => {
      fetchContacts();
    }, 300); // Debounce search to avoid excessive API calls
    return () => clearTimeout(debounce);
  }, [sort, search]);

  const handleCopyEmail = (email, id) => {
    navigator.clipboard.writeText(email);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000); // Reset after 2 seconds
  };

  const handleToggleMessage = (id) => {
    setExpanded(expanded === id ? null : id); // Toggle expanded state
  };

  return (
    <div className="min-h-screen bg-white from-gray-50 to-gray-200 font-sans px-4 py-6 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center mb-6 sm:mb-8 animate-in fade-in zoom-in-50 duration-500">
          All Contacts
        </h1>

        {/* 🔍 Search & Sort */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-8">
          <div className="relative w-full sm:w-1/2">
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full p-2 pl-9 border border-gray-200 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white/80 backdrop-blur-sm transition duration-300 ease-in-out hover:shadow-md"
            />
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 transition-transform duration-300 hover:scale-110"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="w-full sm:w-auto p-2 border border-gray-200 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white/80 backdrop-blur-sm transition duration-300 ease-in-out hover:shadow-md"
          >
            <option value="desc">Newest First</option>
            <option value="asc">Oldest First</option>
          </select>
        </div>

        {/* 📨 Contact Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {loading ? (
            <div className="col-span-full flex justify-center items-center py-10">
              <div className="animate-spin rounded-full h-8 w-8 border-t-3 border-blue-500"></div>
            </div>
          ) : contacts.length === 0 ? (
            <p className="col-span-full text-center text-gray-600 text-base font-medium animate-in fade-in duration-500">
              No contacts found.
            </p>
          ) : (
            contacts.map((contact, index) => (
              <div
                key={contact._id}
                className="bg-white p-4 rounded-lg shadow-md border border-gray-100 hover:shadow-xl hover:border-blue-300 transform hover:-translate-y-0.5 transition-all duration-300 ease-out animate-in fade-in slide-in-from-bottom-10 bg-gradient-to-br from-white to-gray-50"
                style={{ animationDelay: `${index * 80}ms` }}
              >
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-base font-semibold text-gray-800 truncate">
                    {contact.name}
                  </h2>
                  <span className="text-xs text-gray-500 whitespace-nowrap">
                    {dayjs(contact.createdAt).fromNow()}
                  </span>
                </div>
                <div className="flex items-center mb-2">
                  <p className="text-xs text-gray-600 truncate">
                    <strong>Email:</strong>{" "}
                    <a
                      href={`mailto:${contact.email}`}
                      className="text-blue-500 hover:underline transition-colors duration-200"
                    >
                      {contact.email}
                    </a>
                  </p>
                  <div className="relative group">
                    <button
                      onClick={() => handleCopyEmail(contact.email, contact._id)}
                      className="ml-2 text-gray-400 hover:text-blue-500 transition-transform duration-200 hover:scale-110"
                      title="Copy email"
                    >
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                    </button>
                    <span className="absolute hidden group-hover:block -top-8 left-1/2 -translate-x-1/2 bg-gray-700 text-white text-xs rounded py-1 px-2">
                      Copy Email
                    </span>
                  </div>
                  {copied === contact._id && (
                    <span className="ml-2 text-xs text-green-500 animate-pulse">
                      Copied!
                    </span>
                  )}
                </div>
                <div
                  className={`text-gray-700 text-xs ${
                    expanded === contact._id ? "max-h-24 overflow-y-auto" : "h-5 overflow-hidden"
                  } pr-2 scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-gray-100 scrollbar-thumb-rounded-full transition-all duration-300 ease-in-out cursor-pointer`}
                  onClick={() => handleToggleMessage(contact._id)}
                >
                  {expanded === contact._id
                    ? contact.message
                    : contact.message.length > 50
                    ? `${contact.message.slice(0, 50)}...`
                    : contact.message}
                </div>
                <button
                  onClick={() => handleToggleMessage(contact._id)}
                  className="text-xs text-blue-500 hover:text-blue-700 mt-1 transition-colors duration-200"
                >
                  {expanded === contact._id ? "Show Less" : "Show More"}
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}