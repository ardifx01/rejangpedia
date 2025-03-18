"use client"
import { useEffect, useState } from "react";

const AdminPostList = () => {
    const [data, setData] = useState([]);
    const [user, setUser] = useState<userType | any>(null);

    const refreshAccessToken = async () => {
        try {
            if (sessionStorage.getItem("token")) {
                return sessionStorage.getItem("token");
            }

            const response = await fetch("/api/user/refreshToken", {
                method: "POST",
                credentials: "include", // Ensure cookies are sent
            });

            if (!response.ok) {
                return (window.location.href = "/");
            }

            const data = await response.json();
            if (!data.token) return window.location.href = "/";
            sessionStorage.setItem("token", data.token);
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

                if (!response.ok) {
                    window.location.href = "/";
                }

                const check = await response.json();
                setUser(check);
                if(!check.atmin) window.location.href = "/"
                fetch("/api/post/admin", {
                    method: "GET",
                    headers: { Authorization: `Bearer ${tokenTemp}` },
                })
                    .then((res) => res.json())
                    .then((result) => {
                        setData(result.posts);
                    })
                    .catch((error) => console.error("Error fetching data:", error));
            } catch (error) {
                console.error("Error fetching user data:", error);
                setUser(null);
            }
        }

        // Only fetch data if user is null
        if (user === null) {
            fetchUserData();
        }
    }, [user]);

    return (
        <>
        <div className="container">
            <ul className="list-group pl-2 pr-2 text-black" style={{ borderRadius: "24px", listStyleType: "none" }}>
                <h3 className="mt-3">
                    <i className="fa fa-spinner" aria-hidden="true"></i> Data OnGoing
                </h3>
                {data.map((entry: any) => (
                    <li key={entry.id} className="m-2" style={{ borderRadius: "24px" }}>
                        <div className="mb-4">
                            <div className="row g-0">
                                <div className="col-md-4">
                                    <img
                                        src={entry.Image}
                                        style={{ width: "100%", height: "300px", objectFit: "cover" }}
                                        alt={entry.Title}
                                        className="img-fluid rounded-start"
                                    />
                                </div>
                                <div className="col-md-8">
                                    <div className="card-body">
                                        <h5 className="card-title">{entry.Title}</h5>
                                        <p className="card-text">{entry.Content[0].babContent.replace(/<[^>]+>/g, "").substring(0, 200)}...</p>
                                        <div className="d-flex">
                                            <a href={`/details/ongoing/${entry.id}`} className="btn btn-primary rounded-pill mr-2">
                                                <i className="fa fa-chevron-right" aria-hidden="true"></i> Baca
                                            </a>
                                            <div className="btn-group">
                                                <button
                                                    className="btn btn-danger rounded-pill mr-2"
                                                >
                                                    <i className="fa fa-trash" aria-hidden="true"></i> Delete
                                                </button>
                                                <a href={`/accept/${entry.id}`} className="btn btn-secondary rounded-pill">
                                                    <i className="fa fa-check" aria-hidden="true"></i> Terima
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
        </>
    );
};

export default AdminPostList;
