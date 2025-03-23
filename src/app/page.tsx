"use client";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'

export default function Home() {
  const [data, setData] = useState<Data[] | []>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<userType | any>(null);

  const refreshAccessToken = async () => {
    try {
      if (sessionStorage.getItem("token")) {
        return sessionStorage.getItem("token");
      }

      const response = await fetch("/api/user/refreshToken", {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        return;
      }

      const data = await response.json();
      if (!data.token) sessionStorage.setItem("token", data.token);
      return data.token;
    } catch (error) {
      console.error("Error refreshing access token:", error);
      return null;
    }
  };

  useEffect(() => {
    async function fetchUserData() {
      try {
        const tokenTemp = await refreshAccessToken();
        if (!tokenTemp) {
          console.warn("No token available");
          return;
        }

        const response = await fetch(`/api/user/session/token/check`, {
          method: "POST",
          headers: { Authorization: `Bearer ${tokenTemp}` },
        });

        // Cek jika respons kosong sebelum parsing JSON
        if (!response.ok) {
          console.error(`Fetch error: ${response.status}`);
          return;
        }

        const text = await response.text(); // Dapatkan teks dari respons
        if (text) {
          const check = JSON.parse(text); // Parse hanya jika teks ada
          setUser(check); // Simpan data user jika ada
        } else {
          console.warn("Empty response");
          setUser(null); // Set user ke null jika respons kosong
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setUser(null); // Handle error dengan fallback user null
      }
    }

    if (user === null) {
      fetchUserData();
    }
  }, [user]);

  useEffect(() => {
    fetch("/api/post")
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);

  function search() {
    window.location.href = "/search/" + searchTerm;
  }

  return (
    <>
      <div className="d-flex mt-3 mx-4 gap-3 flex-row-reverse">
        {user ? (
          <a href="/post/create" className={`py-2 bd-highlight`}>Tulis Artikel</a>
        ) : (
          <a href="/user/login" className="px-4 rounded-pill bd-highlight border btn btn-light">Login</a>
        )}
        <a href="https://kamusrejangkito.glitch.me" className="py-2 bd-highlight">Kamus Bahasa Rejang</a>
      </div>

      <div className="container">
        <div className="h-100 d-flex justify-content-center flex-column">
          <div
            className="header text-dark text-center rounded-bottom"
          >
            <img id="logo" draggable="false" className="border-0" src="/logo.png" />
          </div>

          <div className="mt-4 mb-4 d-flex justify-content-center position-relative">
            <FontAwesomeIcon icon={faSearch} className="position-absolute search-icon" />
            <input
              autoComplete="off"
              type="text"
              className="form-control search-input custom-input shadow-sm mr-1 rounded-pill p-3 px-4 ps-5"
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
            />
          </div>

          <div className="d-flex justify-content-center gap-3">
            <button className="btn btn-primary px-4 btn-lg" onClick={search}>Cari Apo</button>
            <a className={`btn btn-secondary px-3 ${!user ? "disabled" : ""} btn-lg`} href="/post/create">
              Tulis Artikel
            </a>
          </div>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div>
            <h4 className="mt-3">Artikel Pilihan</h4>

            <div className="row">
              {data.map((entry) => (
                <div className="col mt-2" key={entry.id}>
                  <a
                    className="card"
                    href={`/post/${entry.id}`}
                    style={{
                      background: "rgba(0, 0, 0, 0)",
                      border: "none",
                      backgroundRepeat: "no-repeat",
                      backgroundSize: "cover",
                    }}
                  >
                    <h6
                      className="card-title mb-2"
                      style={{
                        margin: 0,
                        maxHeight: "1.2em",
                        overflow: "hidden",
                        fontFamily: "Arial, Helvetica, sans-serif",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {entry.Title}
                    </h6>
                    <img
                      className="listing-image rounded"
                      src={
                        entry.Image ||
                        "https://e1.pxfuel.com/desktop-wallpaper/908/281/desktop-wallpaper-non-copyrighted-no-copyright.jpg"
                      }
                      alt={entry.Title}
                    />
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
