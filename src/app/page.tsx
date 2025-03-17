"use client";
import { useEffect, useState } from "react";
import styles from "./page.module.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'

export default function Home() {
  const [data, setData] = useState<Data[] | []>([]);
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [loading, setLoading] = useState(true);

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
    window.location.href = "/search/" + searchTerm
  }

  return (
    <div className="container">
      <div
        className="header text-dark text-center mt-2 rounded-bottom"
        style={{ fontFamily: '"Montserrat" !important' }}
      >
        <img
          id="logo"
          draggable="false"
          className="border-0"
          src="https://cdn.glitch.global/2f9a2460-083a-49a5-a55f-2abb8ce71e54/logo.png?v=1699767799122"
        />
        <p>
          <i className="fa fa-globe" /> Punyo Kito Galo
        </p>
      </div>
      <div className="search-box d-flex justify-content-center">
        <input
          autoComplete="off"
          type="text"
          style={{ borderRadius: "6px 4px 4px 6px" }}
          className="form-control search-input custom-input mr-1"
          id="searchInput"
          onKeyUp={(e) => {
            //@ts-ignore
            setSearchTerm(e.target.value);  
            if (e.key === "Enter") {
              search()
              return;
            }

          }}
          placeholder="Mau Cari Apa Sanak..."
        />
        <button
          type="submit"
          className="btn btn-primary border-0 mx-2 rounded-0"
          style={{ borderRadius: "4px 6px 6px 4px !important" }}
          id="searchButton"
          onClick={search}
        >
          <FontAwesomeIcon icon={faSearch} />
        </button>
      </div>
      <h4>Apo Bae Yang Disiko?</h4>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div
            className="parent row flex-nowrap overflow-auto"
            style={{ width: "100%", overflowX: "auto" }}
          >
            <div className="col">
              <h6 className="card-title ml-2">Tengok Galo Artikel</h6>
              <a
                className="card m-1 card-img-top"
                style={{
                  backgroundImage: `url(${data.length > 0 ? data[0].Image || 'https://images.pexels.com/photos/1563356/pexels-photo-1563356.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500' : 'https://images.pexels.com/photos/1563356/pexels-photo-1563356.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500'})`,
                  backgroundRepeat: "no-repeat",
                  borderRadius: 24,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  height: 220
                }}
                href="/data"
              >
                <div
                  className="dark-overlay"
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    borderRadius: 24,
                    background: "rgba(0, 0, 0, 0.2)"
                  }}
                />
              </a>
              <a
                href={`/post/${data[0].id}`}
                className="btn btn-primary m-1 border-0"
                style={{
                  backgroundColor: "#0d7502ff !important",
                  color: "white !important",
                  width: "fit-content",
                  borderRadius: 24,
                }}
              >
                <i
                  className="fa fa-chevron-right"
                  aria-hidden="true"
                  style={{ color: "white !important" }}
                />
                Baco {data[0].Title.substring(0, 10)}...
              </a>
            </div>
            <div className="col">
              <h6 className="card-title ml-2">Kamus Bahasa Rejang</h6>
              <a
                className="card m-1 card-img-top"
                href="https://kamusrejang.glitch.me"
                style={{
                  background:
                    'url("https://cdn.glitch.global/2f9a2460-083a-49a5-a55f-2abb8ce71e54/thumbnails%2Fkamus.jpg?1702886881063")',
                  color: "white",
                  borderRadius: 24,
                  backgroundPosition: "center",
                  height: 220
                }}
              >
                <div
                  className="dark-overlay"
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    borderRadius: 24,
                    background: "rgba(0, 0, 0, 0.2)"
                  }}
                />
              </a>
              <a
                href="https://kamusrejang.glitch.me/database"
                className="btn btn-primary m-1 border-0"
                style={{
                  backgroundColor: "#dac26aff !important",
                  borderRadius: 24,
                  width: "fit-content",
                  color: "black !important",
                }}
              >
                <i
                  className="fa fa-plus"
                  aria-hidden="true"
                  style={{ color: "white !important" }}
                />
                Tambahkan Kata
              </a>
            </div>
            <div className="col">
              <h6 className="card-title ml-2">Media Sosial!</h6>
              <a
                className="card m-1 card-img-top"
                href="/chat"
                style={{
                  background:
                    'url("https://img.freepik.com/free-vector/person-addicted-social-media-illustration-concept_52683-32210.jpg")',
                  color: "white",
                  borderRadius: 24,
                  backgroundPosition: "center",
                  height: 220
                }}
              >
                <div
                  className="dark-overlay"
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    borderRadius: 24,
                    background: "rgba(0, 0, 0, 0.2)"
                  }}
                />
              </a>
            </div>
          </div>
          <h4 className="mt-3">Artikel Pilihan</h4>

          <div className="row">
            {data.map((entry) => (
              <div className="col" key={entry.id}>
                <a
                  className="card"
                  href={`/post/${entry.id}`}
                  style={{
                    background: "rgba(0, 0, 0, 0)",
                    border: "none",
                    width: "100%",
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
                    className="card-img-top rounded"
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
        </>
      )}
    </div>
  );
}