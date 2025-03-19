"use client"
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";

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
    return <p>Loading...</p>;
  }



  return (
    <div className="container">
      <div className="col-lg-10 col-md-9">
        <div className="main-content">
          <h1 id="title">{data.Title}</h1>
          <p
            className="dibuat mr-auto"
            style={{
              fontSize: "15px",
              maxWidth: "100%",
              paddingLeft: "10px",
              borderLeft: "3px solid #138496",
            }}
          >
            <strong style={{ color: "#138496" }}>Ditulis oleh</strong> {data.Pembuat}
            {data.Waktu ? ` • ${data.Waktu}` : " • 07-Maret-2023"}
            {data.Diedit && (
              <>
                <br /><br id="x" />
                <strong style={{ color: "#138496" }}>Diedit oleh</strong> {data.Diedit}
                {data.Edit ? ` • ${data.Edit}` : " • 07-Maret-2023"}
              </>
            )}
          </p>

          <div className="d-flex flex-column flex-md-row">
            {data.Image && (
              <img
                className="listing-image mr-2"
                style={{
                  height: "250px",
                  border: "1px solid #ccc",
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
                    border: "1px solid #ccc",
                  }}
                  className="img-fluid"
                  src={data.Link}
                  title={data.Title}
                ></iframe>
              </article>
            )}
          </div>

          <div className="d-flex mt-3">
            <button className="btn btn-info rounded-pill mr-1 text-white" onClick={() => alert("Share functionality here!")}> 
              <i className="fa fa-share text-white" aria-hidden="true"></i> Bagikan
            </button>
            <a className="btn btn-secondary rounded-pill" href={`/edit/${data.id}`}>
              <i className="fa fa-pencil" aria-hidden="true"></i> Edit Artikel
            </a>
          </div>

          <div style={{ borderRadius: "24px" }}>
            {data.Content.map((bab: any, index: any) => (
              <div className="my-4" key={index}>
                <h3>{bab.babTitle}</h3>
                <p id={bab.babTitle} dangerouslySetInnerHTML={{ __html: bab.babContent }}></p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticlePage;
