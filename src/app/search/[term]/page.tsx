"use client";
import PostShortcut from "@/components/PostShortcut";
import { useEffect, useState } from "react";
import { useParams } from 'next/navigation';
import { useInView } from "react-intersection-observer";

export default function Homepage() {
    const [posts, setPosts] = useState<Data[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const { ref, inView } = useInView();
    const params = useParams();
    const searchTerm = params.term;

    async function fetchPosts(page: number) {
        if (loading || !hasMore) return; // Mencegah fetch berulang
        setLoading(true); // Tandai sedang loading

        try {
            console.log(`Fetching page ${page} for searchTerm: ${searchTerm}`);
            const response = await fetch(`/api/post/search/${searchTerm}?page=${page}`);

            if (!response.ok) throw new Error("Error fetching posts");

            const data = await response.json();

            if (data.data.length > 0) {
                setPosts((prev) => (page === 1 ? data.data : [...prev, ...data.data]));
                setCurrentPage(page); // Update currentPage setelah sukses fetch
            } else {
                console.log("No more posts available");
                setHasMore(false);
            }
        } catch (error) {
            console.error("Error fetching posts:", error);
        } finally {
            setLoading(false);
        }
    }

    // Fetch pertama saat komponen dipasang
    useEffect(() => {
        setPosts([]); // Reset posts saat searchTerm berubah
        setCurrentPage(1);
        setHasMore(true);
        fetchPosts(1);
    }, [searchTerm]);

    // Infinite scroll trigger
    useEffect(() => {
        if (inView && hasMore && !loading) {
            fetchPosts(currentPage + 1);
        }
    }, [inView]); // Memastikan efek ini dijalankan saat `inView` berubah

    return (
        <div>
            <div className='px-3 py-3'>
                {posts.length > 0 ? (
                    <div className="row">
                        {posts.map((post, index) => (
                            <div key={post._id || index} className="col-md-3 col-sm-6">
                                <PostShortcut post={post} />
                            </div>
                        ))}
                    </div>
                ) : (
                    !loading && <p>No posts to display.</p>
                )}
            </div>
            {hasMore && <div ref={ref} style={{ height: "10px", background: "transparent" }} />} 
        </div>
    );
}
