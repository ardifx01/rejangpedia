import { Metadata } from "next";
//@ts-ignore
import ArticlePage from "./ArticlePage"; // Import client component

type PageProps = {
  params: {
    id: string;
  };
};

// Corrected function without `await` on `params`
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = params; // Direct destructuring
  const res = await fetch(`https://rejangpedia.vercel.app/api/post/${id}`, { cache: "no-store" });
  const json = await res.json();
  const data = json.data;

  if (!data) {
    return {
      title: "Artikel Tidak Ditemukan - Rejangpedia",
      description: "Maaf, artikel yang Anda cari tidak ditemukan.",
    };
  }

  return {
    title: data.Title || "Artikel Menarik - Rejangpedia",
    description: data.Content?.[0]?.babContent
      ? data.Content[0].babContent.substring(0, 150) + "..."
      : "Baca artikel menarik tentang budaya dan sejarah di Rejangpedia.",
    openGraph: {
      title: data.Title,
      description: data.Content?.[0]?.babContent.substring(0, 150),
      images: [data.Image || "/default-image.jpg"],
      url: `https://www.rejangpedia.com/post/${params.id}`,
    },
    twitter: {
      card: "summary_large_image",
      title: data.Title,
      description: data.Content?.[0]?.babContent.substring(0, 150),
      images: [data.Image || "/default-image.jpg"],
    },
  };
}

// Correctly typed Page function with `params`
export default function Page({ params }: PageProps) {
  return <ArticlePage id={params.id} />; // Pass `id` correctly
}
