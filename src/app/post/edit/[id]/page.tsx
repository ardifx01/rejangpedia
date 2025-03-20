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

type ContentType = { babTitle: string; babContent: string }[] | string;

const EditArticle = () => {
    const [preview, setPreview] = useState<string | null>(null);
    const [formData, setFormData] = useState<FormDataState>({
        title: "",
        link: "",
        pembuat: "",
        image: null,
    });

    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [content, setContent] = useState<ContentType>("");

    useEffect(() => {
        fetch(`/api/post/${id}`)
            .then((response) => response.json())
            .then((data) => {
                if (data.data) {
                    setFormData({
                        title: data.data.Title,
                        link: data.data.Link || "",
                        pembuat: data.data.Pembuat || "",
                        image: null,
                    });

                    if (data.data.Image) {
                        setPreview(data.data.Image);
                    }

                    if (Array.isArray(data.data.Content)) {
                        setContent(data.data.Content);
                    } else {
                        setContent(data.data.Content || "");
                    }
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

    const handleContentChange = (value: string, index?: number, isTitle?: boolean) => {
        if (Array.isArray(content) && index !== undefined) {
            const newContent = [...content];
            if (isTitle) {
                newContent[index].babTitle = value;
            } else {
                newContent[index].babContent = value;
            }
            setContent(newContent);
        } else {
            setContent(value);
        }
    };

    const addNewBab = () => {
        if (Array.isArray(content)) {
            setContent([...content, { babTitle: "", babContent: "" }]);
        }
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
        data.append("content", JSON.stringify(content));

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
                    <input
                        type="text"
                        id="title"
                        name="title"
                        className="form-control"
                        value={formData.title}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="link">Link Video (Optional):</label>
                    <input
                        type="text"
                        id="link"
                        name="link"
                        className="form-control"
                        value={formData.link}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="image">Cover Image:</label>
                    <input
                        type="file"
                        name="image"
                        id="image"
                        className="form-control-file"
                        onChange={previewPhoto}
                    />
                </div>
                <div className="form-group">
                    {preview && (
                        <img
                            src={preview}
                            style={{
                                width: "460px",
                                maxWidth: "100%",
                                border: "2px solid #ccc",
                                objectFit: "cover",
                                borderRadius: "24px",
                            }}
                            className="img-fluid"
                            alt="Preview"
                        />
                    )}
                </div>

                {/* Bagian Content */}
                <div className="form-group">
                    <label htmlFor="content">Isi Artikel:</label>
                    {Array.isArray(content) ? (
                        <>
                            {content.map((bab, index) => (
                                <div key={index} className="mb-3">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Judul Bab"
                                        value={bab.babTitle}
                                        onChange={(e) => handleContentChange(e.target.value, index, true)}
                                    />
                                    <ReactQuill
                                        value={bab.babContent}
                                        onChange={(value) => handleContentChange(value, index, false)}
                                    />
                                </div>
                            ))}
                            <button type="button" className="btn btn-secondary mt-2" onClick={addNewBab}>
                                Tambah Bab Baru
                            </button>
                        </>
                    ) : (
                        <ReactQuill value={content} onChange={(value) => setContent(value)} />
                    )}
                </div>

                <button type="submit" className="btn btn-info mt-3 rounded-lg">
                    <i className="fa fa-paper-plane" aria-hidden="true"></i> Kirim
                </button>
            </form>
        </div>
    );
};

export default EditArticle;
