import { Metadata } from "next";
import ArticlePage from "./Article"; // Import the client component

// 1. Define the async metadata function that fetches article data dynamically based on `params.id`
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const { id } = params; // Retrieve the `id` from the URL

  // 2. Fetch the data from the API using the `id`
  const res = await fetch(`https://rejangpedia.vercel.app/api/post/${id}`, { cache: "no-store" });
  const json = await res.json();
  const data = json.data;

  // Handle the case if no data is found for the given `id`
  if (!data) {
    return {
      title: "Artikel Tidak Ditemukan - Rejangpedia",
      description: "Maaf, artikel yang Anda cari tidak ditemukan.",
    };
  }

  // 3. Generate dynamic metadata, including the `title`, `description`, and `twitter` image
  return {
    title: data.Title || "Artikel Menarik - Rejangpedia",
    description: data.Content?.[0]?.babContent
      ? data.Content[0].babContent.substring(0, 150) + "..."
      : "Baca artikel menarik tentang budaya dan sejarah di Rejangpedia.",
    openGraph: {
      title: data.Title,
      description: data.Content?.[0]?.babContent.substring(0, 150),
      images: [data.Image || "/logo.png"],
      url: `https://www.rejangpedia.com/post/${params.id}`,
    },
    twitter: {
      card: "summary_large_image",
      title: data.Title,
      description: data.Content?.[0]?.babContent.substring(0, 150),
      images: [data.Image || "/logo.png"], // Twitter image
    },
  };
}

// 4. Export the main Page component
export default function Page({ params }: { params: { id: string } }) {
  return <ArticlePage id={params.id} />; // Render the `ArticlePage` client component with `id`
}
