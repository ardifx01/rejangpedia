"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

const Navbar = () => {
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>("");

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
  if (window.location.pathname === "/") return

  function search() {
    window.location.href = "/search/" + searchTerm;
  }
  return (
    <>
      {/* Navbar Dekstop */}
      <nav className="navbar navbar-expand-lg sticky-top w-100" id="khususDekstop">
        <Link className="navbar-brand ps-3" href="/">
          rejangpedia
        </Link>
        <form className="form-inline w-100 pe-3">
          <div>
          <FontAwesomeIcon icon={faSearch} className="position-absolute search-icon-navbar" />
          <input
            autoComplete="off"
            type="text"
            className="form-control search-input custom-input shadow-sm mr-1 rounded-pill p-2 px-4 ps-5"
            id="searchInput"
            onKeyUp={(e) => {
              //@ts-ignore
              setSearchTerm(e.target.value);
              if (e.key === "Enter") {
                search();
                return;
              }
            }}
            placeholder="Search"
          /></div>
        </form>
      </nav>


    </>
  );
};

export default Navbar;
