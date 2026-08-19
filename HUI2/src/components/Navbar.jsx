import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {

  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const isLoggedIn = localStorage.getItem("isLoggedIn");

  const handleLogout = () => {

    // Remove login information
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("email");
    localStorage.removeItem("role");
    localStorage.removeItem("name");

    alert("Logged Out Successfully");

    navigate("/");

    window.location.reload();

};

  const links = [
    { to: "/", label: "Home" },
    { to: "/products", label: "Products" },
    { to: "/cart", label: "Cart" },
    { to: "/orders", label: "My Orders" },
    { to: "/wishlist", label: "Wishlist" },
    { to: "/profile", label: "My Profile" },
    { to: "/about", label: "About" },
    { to: "/reviews", label: "Reviews" }
  ];

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">

      <div className="max-w-7xl mx-auto flex justify-between items-center h-20 px-6 md:px-8">

        {/* Logo */}
        <Link
          to="/"
          className="text-2xl md:text-3xl font-bold text-green-700"
          onClick={() => setMenuOpen(false)}
        >
          🌿 HerbalLife
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">

          {links.map(link => (

              <Link key={link.to} className="hover:text-green-700" to={link.to}>
                {link.label}
              </Link>

          ))}

          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700"
            >
              Login
            </Link>
          )}

        </div>

        {/* Mobile Hamburger Button */}
        <button
          className="md:hidden text-3xl text-green-700"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? "✕" : "☰"}
        </button>

      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (

        <div className="md:hidden bg-white border-t shadow-lg px-6 py-4 flex flex-col gap-4">

          {links.map(link => (

              <Link
                key={link.to}
                className="hover:text-green-700"
                to={link.to}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>

          ))}

          {isLoggedIn ? (
            <button
              onClick={() => { setMenuOpen(false); handleLogout(); }}
              className="bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700 text-left"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              onClick={() => setMenuOpen(false)}
              className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 text-center"
            >
              Login
            </Link>
          )}

        </div>

      )}

    </nav>
  );
}

export default Navbar;
