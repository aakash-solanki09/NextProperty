export default function Footer() {
  return (
    <footer className="bg-blue-900 text-white font-urbanist">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-sm">
        {/* Company Info */}
        <div>
          <h4 className="text-lg font-semibold mb-3">NextProperty</h4>
          <p>Your trusted platform for buying, selling, and exploring properties across the country.</p>
        </div>

        {/* Useful Links */}
        <div>
          <h4 className="text-lg font-semibold mb-3">Quick Links</h4>
          <ul className="space-y-2">
            <li><a href="/" className="hover:underline">Home</a></li>
            <li><a href="/explore-properties" className="hover:underline">Explore Properties</a></li>
            <li><a href="/create-property" className="hover:underline">Create Property</a></li>
            <li><a href="/about" className="hover:underline">About Us</a></li>
            <li><a href="/contact" className="hover:underline">Contact</a></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-lg font-semibold mb-3">Contact</h4>
          <ul className="space-y-2">
            <li>Email: <a href="mailto:support@nextproperty.com" className="hover:underline">support@nextproperty.com</a></li>
            <li>Phone: +91 98765 43210</li>
            <li>Address: 123 Real Estate Lane, Delhi, India</li>
          </ul>
        </div>

        {/* Social */}
        <div>
          <h4 className="text-lg font-semibold mb-3">Follow Us</h4>
          <div className="flex space-x-4 mt-2">
            <a href="#" aria-label="Facebook" className="hover:text-gray-300">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="#" aria-label="Twitter" className="hover:text-gray-300">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="#" aria-label="Instagram" className="hover:text-gray-300">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="#" aria-label="LinkedIn" className="hover:text-gray-300">
              <i className="fab fa-linkedin-in"></i>
            </a>
          </div>
        </div>
      </div>

      <div className="text-center text-xs text-gray-300 border-t border-blue-800 py-4 px-4">
        &copy; {new Date().getFullYear()} NextProperty. All rights reserved.
      </div>
    </footer>
  );
}
