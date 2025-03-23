"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
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

  return (
    <div className={`container d-flex justify-content-center`}>
      <div className={styles.container}>
        <div className="w-100 d-flex flex-column">
          <h3 className="my-0" style={{ color: "var(--primary)", fontWeight: "bolder" }}>
            {data.Edit && data.Edit !== "tidak ada waktu" ? `${data.Edit}` : "07 Maret 2023"}
          </h3>
          <h1 id="title">{data.Title}</h1>

          <p className="dibuat mr-auto" style={{ fontSize: "15px", paddingLeft: "10px", borderLeft: "3px solid #424347" }}>
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
                style={{ height: "250px", objectFit: "contain", borderRadius: "12px" }}
                src={data.Image}
                alt={data.Title}
              />
            )}

            {data.Link && (
              <iframe
                style={{ width: "460px", height: "250px", borderRadius: "12px" }}
                src={data.Link}
                title={data.Title}
              ></iframe>
            )}
          </div>

          <div className="d-flex mt-3 gap-2">
            <button className="btn btn-primary rounded-pill" onClick={() => alert("Share functionality here!")}>
              <FontAwesomeIcon icon={faShare} />
            </button>
            <a className="btn btn-secondary rounded-pill" href={`/edit/${data.id}`}>
              <FontAwesomeIcon icon={faPencil} /> Edit Article
            </a>
          </div>

          <div className="text-justify w-100">
            {data.Content.map((bab: any, index: number) => (
              <div className="my-4" key={index}>
                <h3>{bab.babTitle}</h3>
                <p dangerouslySetInnerHTML={{ __html: bab.babContent }}></p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticlePage;
