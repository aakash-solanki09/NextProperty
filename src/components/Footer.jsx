export default function Footer() {
  return (
    <footer className="bg-blue-900 text-white text-center py-10 font-urbanist mt">
      <p className="text-sm sm:text-base">
        &copy; {new Date().getFullYear()} NextProperty. All rights reserved.
      </p>
    </footer>
  );
}
