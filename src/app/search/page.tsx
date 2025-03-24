"use client";
import { useEffect, useState, useCallback } from "react";

const PostList = () => {
    const [data, setData] = useState<any[]>([]);
    const [page, setPage] = useState(1); // Current page for infinite scroll
    const [isLoading, setIsLoading] = useState(false); // Loading state

    // Infinite Scroll: Fetch more posts on scroll
    const fetchPosts = async (pageNum: number) => {
        setIsLoading(true);

        try {
            const res = await fetch(`/api/post/admin?page=${pageNum}`, {
                method: "GET",
            });
            const result = await res.json();
            setData((prevData) => [...prevData, ...result.posts]); // Append new posts
            console.log(data)
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
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll); // Clean up
    }, [handleScroll]);

    useEffect(() => {
        if (page > 1) fetchPosts(page); // Fetch posts on page change
        else fetchPosts(1); // Initial fetch
    }, [page]);

    return (
        <div className="container">
            <ul className="list-group pl-2 pr-2">
                <h1>
                    <i className="fa fa-spinner" aria-hidden="true"></i> Discover
                </h1>

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
                    </li>
                ))}
                {isLoading && <p>Loading more posts...</p>}
            </ul>
        </div>
    );
};

export default PostList;
