import { NextRequest } from "next/server";

  export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    let prompt = searchParams.get("prompt") || "default";
    const apiurl = `https://sandipbaruwal.onrender.com/gemini?prompt=${encodeURIComponent(
  "Jelaskan secara super lengkap dan menggunakan rich text dan highlight 1 kalimat pengertian utamanya dengan warna bg #245292 dan text white . Langsung aja gak usah pake penjelasan 'baiklah bla bla bla' tentang " + prompt
      )}`;
        
    try {
      const response = await fetch(apiurl, {
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
  
      const data = await response.json();
  
      return new Response(JSON.stringify(data), { // Perbaikan: Harus diubah ke JSON.stringify()
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*", // Bypass CORS
          "Access-Control-Allow-Methods": "GET, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    } catch (error) {
      console.error("Error fetching API:", error);
      return new Response(JSON.stringify({ error: "Gagal mengambil data" }), { status: 500 });
    }
  }