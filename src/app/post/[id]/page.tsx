"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Head from "next/head";  // Import untuk meta tag
import styles from './page.module.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil, faShare } from "@fortawesome/free-solid-svg-icons";
import LoadingSpinner from "@/components/Loading";

const ArticlePage = () => {
  const { id } = useParams();
  const [data, setData] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/post/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setData(data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <LoadingSpinner />;
  }

  const pageTitle = data.Title || "Artikel Menarik"; // Default title
  const pageDescription = data.Content?.[0]?.babContent
    ? data.Content[0].babContent.substring(0, 150) + "..."
    : "Baca artikel lengkap di sini.";
  const pageImage = data.Image || "/default-image.jpg"; // Default image jika tidak ada
  const pageUrl = `https://www.yourwebsite.com/article/${id}`; // Ganti sesuai dengan domain Anda

  return (
    <>
      {/* Meta Tags */}
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content="Rejangpedia, Artikel, Budaya, Bahasa Rejang" />
        <meta name="author" content={data.Pembuat || "Admin"} />

        {/* Open Graph Meta Tags (untuk Facebook, Twitter, dll.) */}
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content={pageImage} />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:type" content="article" />

        {/* Twitter Card Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={pageImage} />
      </Head>

      <div className={`container d-flex justify-content-center`}>
        <div className={styles.container}>
          <div className="w-100 d-flex flex-column">
            <h3 className="my-0" style={{ color: "var(--primary)", fontWeight: "bolder" }}>
              {data.Edit && data.Edit !== "tidak ada waktu" ? `${data.Edit}` : "07 Maret 2023"}
            </h3>
            <h1 id="title">{data.Title}</h1>

            <p
              className="dibuat mr-auto"
              style={{ fontSize: "15px", maxWidth: "100%", paddingLeft: "10px", borderLeft: "3px solid #424347" }}
            >
              <span style={{ color: "var(--primary)" }}>Ditulis oleh</span> {data.Pembuat}{" "}
              {data.Waktu ? ` pada ${data.Waktu}` : " pada 07-Maret-2023"}
              {data.Diedit && (
                <>
                  <br />
                  <span style={{ color: "var(--secondary)" }}>Diedit oleh</span> {data.Diedit}
                </>
              )}
            </p>

            <div className="d-flex flex-column flex-md-row gap-3">
              {data.Image && (
                <img
                  className="mr-2 cover"
                  style={{
                    height: "250px",
                    objectFit: "contain",
                    background: "rgba(0, 0, 0, 0)",
                    borderRadius: "12px",
                  }}
                  src={data.Image}
                  alt={data.Title}
                />
              )}

              {data.Link && (
                <article>
                  <iframe
                    style={{
                      width: "460px",
                      maxWidth: "100%",
                      height: "250px",
                      objectFit: "cover",
                      borderRadius: "12px",
                    }}
                    className="img-fluid"
                    src={data.Link}
                    title={data.Title}
                  ></iframe>
                </article>
              )}
            </div>

            <div className="d-flex mt-3 gap-2">
              <button
                className="btn btn-primary rounded-pill mr-1 px-3"
                onClick={() => alert("Share functionality here!")}
              >
                <FontAwesomeIcon icon={faShare} />
              </button>
              <a className="btn btn-secondary rounded-pill px-3" href={`/edit/${data.id}`}>
                <FontAwesomeIcon icon={faPencil} /> Edit Article
              </a>
            </div>

            <div className="text-justify w-100">
              {data.Content.map((bab: any, index: any) => (
                <div className="my-4" key={index}>
                  <h3>{bab.babTitle}</h3>
                  <p id={bab.babTitle} className="text-justify" dangerouslySetInnerHTML={{ __html: bab.babContent }}></p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ArticlePage;
