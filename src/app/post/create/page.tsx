"use client"
import { useState, ChangeEvent, FormEvent } from "react";

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
          <label htmlFor="pembuat">Pembuat (Optional):</label>
          <input type="text" id="pembuat" name="pembuat" className="form-control" value={formData.pembuat} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label htmlFor="image">Cover Image:</label>
          <input type="file" name="image" id="image" className="form-control-file" required onChange={previewPhoto} />
        </div>
        <div className="form-group">
          {preview && (
            <img src={preview} style={{ width: "460px", maxWidth: "100%", border: "2px solid #ccc", objectFit: "cover", borderRadius: "24px" }} className="img-fluid" alt="Preview" />
          )}
        </div>
        <button type="submit" className="btn btn-info mt-3 rounded-lg">
          <i className="fa fa-paper-plane" aria-hidden="true"></i> Kirim
        </button>
      </form>
    </div>
  );
};

export default NewArticle;