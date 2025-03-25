"use client";
import { useEffect, useState, useCallback } from "react";

const AdminPostList = () => {
    const [data, setData] = useState<any[]>([]);
    const [user, setUser] = useState<userType | any>(null);
    const [page, setPage] = useState(1); // Current page for infinite scroll
    const [isLoading, setIsLoading] = useState(false); // Loading state
    
    const refreshAccessToken = async () => {
        try {
            if (sessionStorage.getItem("token")) return sessionStorage.getItem("token");

            const response = await fetch("/api/user/session/token/refresh", {
                method: "POST",
                credentials: "include", // Ensure cookies are sent
            });

            if (!response.ok) return (window.location.href = "/");

            const data = await response.json();
            if (data.token) return (window.location.href = "/");
            sessionStorage.setItem("token", data.token);
            return data.token;
        } catch (error) {
            console.error("Error refreshing access token:", error);
            return null;
        }
    };

    // Handle Accept Button (POST to /api/post/accept/[id])
    const handleAccept = async (id: string) => {
        const tokenTemp = await refreshAccessToken();
        if (!tokenTemp) return console.error("No token available");

        try {
            const response = await fetch(`/api/post/accept/${id}`, {
                method: "PUT",
                headers: { Authorization: `Bearer ${tokenTemp}` },
            });

            if (response.ok) {
                console.log(`Post ${id} accepted.`);
                setData((prevData) => prevData.filter((post) => post.id !== id)); // Remove accepted post
            } else {
                console.error(`Failed to accept post ${id}`);
            }
        } catch (error) {
            console.error("Error accepting post:", error);
        }
    };

        // Handle Accept Button (POST to /api/post/accept/[id])
        const handleDelete = async (id: string) => {
            const tokenTemp = await refreshAccessToken();
            if (!tokenTemp) return console.error("No token available");
    
            try {
                const response = await fetch(`/api/post/delete/ongoing/${id}`, {
                    method: "DELETE",
                    headers: { Authorization: `Bearer ${tokenTemp}` },
                });
    
                if (response.ok) {
                    setData((prevData) => prevData.filter((post) => post.id !== id)); // Remove accepted post
                } else {
                    console.error(`Failed to accept post ${id}`);
                }
            } catch (error) {
                console.error("Error accepting post:", error);
            }
        };
    

    // Infinite Scroll: Fetch more posts on scroll
    const fetchPosts = async (pageNum: number) => {
        setIsLoading(true);
        const tokenTemp = await refreshAccessToken();
        if (!tokenTemp) return;

        try {
            const res = await fetch(`/api/post/admin/ongoing?page=${pageNum}`, {
                method: "GET",
                headers: { Authorization: `Bearer ${tokenTemp}` },
            });
            const result = await res.json();
            setData((prevData) => [...prevData, ...result.posts]); // Append new posts
        } catch (error) {
            console.error("Error fetching more posts:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleScroll = useCallback(() => {
        if (
            window.innerHeight + window.scrollY >= document.body.scrollHeight - 100 &&
            !isLoading
        ) {
            setPage((prevPage) => prevPage + 1); // Load next page
        }
    }, [isLoading]);

    useEffect(() => {
        async function fetchUserData() {
            const tokenTemp = await refreshAccessToken();
            if (!tokenTemp) return;

            const res = await fetch(`/api/user/session/token/check`, {
                method: "POST",
                headers: { Authorization: `Bearer ${tokenTemp}` },
            });

            const check = await res.json();
            setUser(check);
            if (!check.atmin) window.location.href = "/";
            fetchPosts(1); // Initial fetch
        }

        if (user === null) fetchUserData();
    }, [user]);

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll); // Clean up
    }, [handleScroll]);

    useEffect(() => {
        if (page > 1) fetchPosts(page); // Fetch posts on page change
    }, [page]);

    return (
        <div className="container" id="container">
            <ul className="list-group pl-2 pr-2">
                <h3 className="mt-3">
                    <i className="fa fa-spinner" aria-hidden="true"></i> Data OnGoing
                </h3>

                {data.map((entry: any) => (
                    <li key={entry.id} className="mb-4 list-unstyled">
                        <div className="d-flex flex-column flex-md-row gap-3">
                            {entry.Image && (
                                <img
                                    className="me-3"
                                    style={{
                                        width: "90px",
                                        height: "90px",
                                        objectFit: "cover",
                                        borderRadius: "12px",
                                    }}
                                    src={entry.Image}
                                    alt={entry.Title}
                                />
                            )}
                            <div className={!entry.Image ? "" : "ml-md-3"}>
                                <h5 className="mb-0">{entry.Title}</h5>
                                <p className="text-mute m-0">
                                    {Array.isArray(entry.Content) && entry.Content[0]
                                        ? entry.Content[0].babContent.replace(/<[^>]+>/g, "").substring(0, 100)
                                        : entry.Content.toString().replace(/<[^>]+>/g, "").substring(0, 100)}
                                    ...
                                </p>
                                <p className="mb-1">- By {entry.Pembuat}</p>
                            </div>
                        </div>
                        <div className="d-flex mt-2 gap-2">
                            <a
                                href={`/post/ongoing/${entry.id}`}
                                className="btn btn-primary rounded-pill"
                            >
                                <i className="fa fa-chevron-right" aria-hidden="true"></i> Baca
                            </a>
                            <button
                                className="btn btn-danger rounded-pill"
                                onClick={() => handleDelete(entry.id)}
                            >
                                <i className="fa fa-trash" aria-hidden="true"></i> Delete
                            </button>
                            <button
                                className="btn btn-secondary rounded-pill"
                                onClick={() => handleAccept(entry.id)}
                            >
                                <i className="fa fa-check" aria-hidden="true"></i> Terima
                            </button>
                        </div>
                    </li>
                ))}
                {isLoading && <p>Loading more posts...</p>}
            </ul>
        </div>
    );
};

export default AdminPostList;
