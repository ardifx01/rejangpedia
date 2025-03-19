"use client"
import { useParams } from "next/navigation";
import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

interface FormDataState {
    title: string;
    link: string;
    pembuat: string;
    image: File | null;
}

const NewArticle = () => {
    const [preview, setPreview] = useState<string | null>(null);
    const [formData, setFormData] = useState<FormDataState>({
        title: "",
        link: "",
        pembuat: "",
        image: null,
    });

    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [content, setContent] = useState("");

    useEffect(() => {
        fetch(`/api/post/${id}`)
            .then((response) => response.json())
            .then((data) => {
                if (data.data) {
                    setFormData({
                        title: data.data.Title,
                        link: data.data.Link || "",
                        pembuat: data.data.Pembuat || "",
                        image: null, // Tidak bisa langsung set File, harus konversi dulu
                    });

                    // Jika ada gambar, set preview dari URL
                    if (data.data.Image) {
                        setPreview(data.data.Image);
                    }
                    setContent(data.data.content)
                }
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
                setLoading(false);
            });
    }, [id]);

    const previewPhoto = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setFormData((prev) => ({ ...prev, image: file }));
            const fileReader = new FileReader();
            fileReader.onload = (e) => {
                setPreview(e.target?.result as string);
            };
            fileReader.readAsDataURL(file);
        }
    };

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    };

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        const data = new FormData();
        data.append("title", formData.title);
        data.append("link", formData.link);
        data.append("pembuat", formData.pembuat);
        if (formData.image) {
            data.append("image", formData.image);
        }

        try {
            const response = await fetch("/api/post", {
                method: "POST",
                body: data,
            });

            if (response.ok) {
                alert("Artikel berhasil dikirim!");
            } else {
                alert("Gagal mengirim artikel.");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Terjadi kesalahan.");
        }
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div className="container mt-5">
            <h1 className="display-4">Artikel Baru</h1>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <div className="form-group">
                    <label htmlFor="title">Title:</label>
                    <input type="text" id="title" name="title" className="form-control" value={formData.title} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label htmlFor="link">Link Video (Optional):</label>
                    <input type="text" id="link" name="link" className="form-control" value={formData.link} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label htmlFor="image">Cover Image:</label>
                    <input type="file" name="image" id="image" className="form-control-file" onChange={previewPhoto} />
                </div>
                <div className="form-group">
                    {preview && (
                        <img src={preview} style={{ width: "460px", maxWidth: "100%", border: "2px solid #ccc", objectFit: "cover", borderRadius: "24px" }} className="img-fluid" alt="Preview" />
                    )}
                </div>
                <div className="form-group">
                    <ReactQuill id="content" value={content} onChange={setContent}  />
                </div>
                <button type="submit" className="btn btn-info mt-3 rounded-lg">
                    <i className="fa fa-paper-plane" aria-hidden="true"></i> Kirim
                </button>
            </form>
        </div>
    );
};

export default NewArticle;
