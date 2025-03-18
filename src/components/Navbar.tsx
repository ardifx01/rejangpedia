"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const closeDropdown = () => {
    setDropdownOpen(false);
  };

  useEffect(() => {
    require("bootstrap/dist/js/bootstrap.js")
  }, [])
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;
      setIsVisible(prevScrollPos > currentScrollPos);
      setPrevScrollPos(currentScrollPos);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [prevScrollPos]);

  const openApp = () => {
    const appUrl = `rejang://pedia${window.location.href.replace("https://rejangpedia.glitch.me", "")}`;
    window.location.href = appUrl;
  };

  return (
    <>
      {/* Navbar Dekstop */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-light sticky-top" id="khususDekstop">
        <Link className="navbar-brand ps-3" href="/">
          rejangpedia
        </Link>
        <button className="navbar-toggler border-0" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <i className="fa fa-bars"></i>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav justify-content-center">
            <li className="nav-item">
              <Link className="nav-link" href="https://kamusrejang.glitch.me">
                <i className="fa fa-book"></i> Kamus Rejang
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" href="/post/create">
                <i className="fa fa-plus"></i> Tambah Artikel
              </Link>
            </li>
            <li className="nav-item dropdown">
          <button
            className="nav-link dropdown-toggle btn btn-dark"
            id="navbarDropdown"
            onClick={toggleDropdown}
          >
            <i className="fa fa-bars"></i> Daftar
          </button>
          {dropdownOpen && (
            <div className="dropdown-menu bg-dark show" aria-labelledby="navbarDropdown">
              <Link className="dropdown-item" href="/tentang" onClick={closeDropdown}>
                <i className="fa fa-question"></i> Tentang
              </Link>
              <div className="dropdown-divider"></div>
              <Link className="dropdown-item" href="https://mfathinhalim.github.io" onClick={closeDropdown}>
                <i className="fa fa-question-circle"></i> Tentang Fathin
              </Link>
              <button className="dropdown-item" onClick={() => { openApp(); closeDropdown(); }}>
                Buka di Aplikasi
              </button>
            </div>
          )}
        </li>
          </ul>
        </div>
      </nav>

      {/* Navbar HP Atas */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-light sticky-top d-lg-none" id="khususHp">
        <div className="container">
          <div className="row w-100">
            <div>
              <Link className="navbar-brand px-2" href="/">
                rejangpedia
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Navbar HP Bawah */}
      <nav className={`navbar fixed-bottom navbar-expand navbar-light bg-light ${isVisible ? "" : "d-none"}`} id="khususHpBawah">
        <ul className="navbar-nav nav-justified w-100">
          <li className="nav-item">
            <Link className="nav-link" href="/">
              <i className="fa fa-home"></i>
              <span className="d-block">Home</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" href="/post/create">
              <i className="fa fa-plus"></i>
              <span className="d-block">Tambah</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" href="https://kamusrejang.glitch.me">
              <i className="fa fa-book"></i>
              <span className="d-block">Kamus</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" href="/dropdown">
              <i className="fa fa-bars"></i>
              <span className="d-block">Menu</span>
            </Link>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default Navbar;
