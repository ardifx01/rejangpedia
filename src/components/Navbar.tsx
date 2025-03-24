"use client";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation"; // Untuk menangkap pathname

const Navbar = () => {
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const pathname = usePathname(); // Menangkap full URL path (contoh: "/search/javascript")

  useEffect(() => {
    // Ambil [term] dari dynamic route "/search/[term]"
    const extractedTerm = pathname.split("/search/")[1] || "";
    setSearchTerm(decodeURIComponent(extractedTerm)); // Mengisi input dengan [term]
  }, [pathname]);

  useEffect(() => {
    require("bootstrap/dist/js/bootstrap.js");
  }, []);

  if (pathname === "/" || pathname === "/search") return

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;
      setIsVisible(prevScrollPos > currentScrollPos);
      setPrevScrollPos(currentScrollPos);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [prevScrollPos]);

  function search() {
    window.location.href = `/search/${searchTerm}`;
  }

  return (
    <>
      {/* Navbar Desktop & Mobile */}
      {!pathname.includes("user") && (

        <nav className="navbar navbar-expand-lg sticky-top w-100" id="khususDekstop">
          <div className="container-fluid d-flex align-items-center">
            {/* Logo */}
            <a className="navbar-brand" href="/">
              <img src="/logo.png" width="100" height="45" alt="Logo" />
            </a>

            {/* Form Pencarian yang tetap di samping logo */}
            <form className="d-none d-md-flex flex-grow-1">
              <div className="input-group">
                <input
                  autoComplete="off"
                  type="text"
                  className="form-control py-2 px-3 rounded-pill shadow-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyUp={(e) => {
                    if (e.key === "Enter") {
                      search();
                    }
                  }}
                  placeholder="Cari apa di rejangpedia?"
                />
              </div>
            </form>
          </div>
        </nav>
      )}

    </>
  );
};

export default Navbar;
