"use client";
import React, { useEffect, useState } from "react";
import styles from './page.module.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil, faShare } from "@fortawesome/free-solid-svg-icons";
import LoadingSpinner from "@/components/Loading";

interface ArticlePageProps {
  id: any; // Receive `id` as props from the parent
}

const ArticlePage: React.FC<ArticlePageProps> = ({ id }) => {
  const [data, setData] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/post/${id}`) // Fetch the article based on the provided `id`
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
  async function copyLink() {
    const currentUrl = `${window.location.href}`
    if (navigator.share) {
        try {
            await navigator.share({
                title: data.Title + " rejangpedia",
                text: "Artikel di rejangpedia, menarik nih",
                url: currentUrl,
            });
        } catch (error) {
            console.error("Error sharing", error);
        }
    } else if (navigator.clipboard) {
        try {
            await navigator.clipboard.writeText(currentUrl);
            alert("Link copied to clipboard. Share it with your friends!");
        } catch (error) {
            console.error("Clipboard write error", error);
            alert("Failed to copy link.");
        }
    }
  }
  return (
    <div className={`container d-flex justify-content-center`}>
      <div className={styles.container}>
        <div className="w-100 d-flex flex-column">
          <h3 className="my-0" style={{ color: "var(--primary)", fontWeight: "bolder" }}>
            {data.Edit && data.Edit !== "tidak ada waktu" ? `${data.Edit}` : "07 Maret 2023"}
          </h3>
          <h1 id="title">{data.Title}</h1>

          <p
            className="dibuat mr-auto"
            style={{
              fontSize: "15px",
              maxWidth: "100%",
              paddingLeft: "10px",
              borderLeft: "3px solid #424347",
            }}
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
                style={{ height: "250px", objectFit: "contain", background: "rgba(0, 0, 0, 0)", borderRadius: "12px" }}
                src={data.Image}
                alt={data.Title}
              />
            )}

            {data.Link && (
              <article>
                <iframe
                  style={{ width: "460px", maxWidth: "100%", height: "250px", objectFit: "cover", borderRadius: "12px" }}
                  className="img-fluid"
                  src={data.Link}
                  title={data.Title}
                ></iframe>
              </article>
            )}
          </div>

          <div className="d-flex mt-3 gap-2">
            <button className="btn btn-primary rounded-pill mr-1 px-3" onClick={copyLink}>
              <FontAwesomeIcon icon={faShare} />
            </button>
            <a className="btn btn-secondary rounded-pill px-3" href={`/post/edit/${data.id}`}>
              <FontAwesomeIcon icon={faPencil} /> Edit Article
            </a>
          </div>

          <div className="text-justify w-100">
            {data.Content &&
              data.Content.map((bab: any, index: any) => (
                <div className="my-4" key={index}>
                  <h3>{bab.babTitle}</h3>
                  <p id={bab.babTitle} className="text-justify" dangerouslySetInnerHTML={{ __html: bab.babContent }}></p>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticlePage;
