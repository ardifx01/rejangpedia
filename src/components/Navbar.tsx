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

  if (pathname === "/" || pathname === "/search") return;

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
        <nav className="navbar sticky-top w-100 py-1" id="khususDekstop">
          <div id={`${pathname.includes("/post/") && "artikel"}`} className={`container-fluid d-flex align-items-center justify-content-between`}>
            {/* Logo */}
            <a className="navbar-brand me-3 ms-0" href="/">
              <img src="/logo-icon.png" width="45" height="45" alt="Logo" />
            </a>

            {/* Form Pencarian */}
            <form className="d-none d-lg-flex flex-grow-1">
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

            {/* Link Tambahan */}
            <div className="d-flex align-items-center ms-3">
              <a className="text-decoration-none mx-2" href="/rules">
                Peraturan
              </a>
              <a className="text-decoration-none mx-2" href="/search">
                Discover
              </a>
            </div>
          </div>
        </nav>
      )}
    </>
  );
};

export default Navbar;
