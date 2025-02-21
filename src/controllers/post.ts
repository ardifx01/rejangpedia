import { goingModel, mainModel } from "@/models/post";
import { Model } from "mongoose";
import axios from "axios";
import dbConnect from "@/utils/mongoose";
import { v4 as uuidv4 } from 'uuid';

await dbConnect();

export default class rejangpedia {
    static instance: rejangpedia;

    //ini model datanya
    data: Model<Data>;
    ongoingData: Model<Data>;

    constructor() {
        this.data = mainModel;
        this.ongoingData = goingModel;
    }

    static getInstance(): rejangpedia {
        if (!rejangpedia.instance) rejangpedia.instance = new rejangpedia(); //bikin instance baru
        return rejangpedia.instance;
    }

    async getRecomendation() {
        const recommendation = await this.data.aggregate([
            {
                $match: {
                    $or: [
                        { Title: { $regex: 'rejang', $options: 'i' } },
                        { Title: { $regex: 'bengkulu', $options: 'i' } }
                    ]
                }
            },
            {
                $project: {
                    Content: 0 // Mengecualikan Content
                }
            },
            {
                $sample: { size: 5 } // Mengambil 5 dokumen secara acak
            }
        ]);

        return recommendation;
    }

    async getDetails(id: string | string[], onGoing: boolean) {
        let mahiru;

        if (onGoing) {
            mahiru = await this.ongoingData.findOne({ id: id }).exec();
        }
        else {
            mahiru = await this.data.findOne({ id: id }).exec();
        }

        //cek dulu data nya null or tidak
        if (!mahiru) return { data: "Data Not Found" };

        return { data: mahiru };
    }

    async search(searchTerm: string, page: number = 1, limit: number = 5) {
        let combinedResults = []; // Inisialisasi atau reset nilai ke array kosong setiap kali metode dipanggil

        // 1. Mencari di data lokal (menggunakan skip dan limit untuk pagination)
        const skip = (page - 1) * limit;
        const localDataResults = await this.data
            .find({ Title: { $regex: searchTerm, $options: 'i' } })
            .skip(skip) // Skip untuk pagination
            .limit(limit) // Batas hasil berdasarkan limit
            .slice('Content', 1) // Mengambil hanya bab pertama dari array Content
            .exec();

        combinedResults = [...localDataResults];
        if (page === 1) {
            // 2. Mencari di Wikipedia
            const wikipediaResults = await this.searchWikipedia(searchTerm);

            // 3. Menggabungkan hasil dari kedua sumber tanpa duplikasi
            if (wikipediaResults) {
                wikipediaResults.forEach((wikipediaItem: Data) => {
                    const isDuplicate = localDataResults.some((localItem) => localItem.id === wikipediaItem.id);

                    //@ts-ignore
                    if (!isDuplicate) combinedResults.push(wikipediaItem);
                });
            }
        }

        return combinedResults;
    }

    async searchWikipedia(searchTerm: string) {
        // Mengecek apakah data sudah ada berdasarkan judul
        let existingData: any = [];
        // Perbaiki dengan query yang sesuai:
        existingData = await this.data.find({ Title: searchTerm }).exec();
        if (existingData) {
            return; // Mengembalikan data yang sudah ada dalam bentuk array jika ditemukan
        }

        const apiUrl = `https://id.wikipedia.org/w/api.php?action=query&format=json&titles=${searchTerm}&prop=extracts|pageimages&exintro=true&pithumbsize=300`;

        const response = await axios.get(apiUrl);
        const pageId = Object.keys(response.data.query.pages)[0];
        const title = response.data.query.pages[pageId].title;
        const content = response.data.query.pages[pageId].extract;

        // Ambil informasi gambar jika tersedia
        let imageUrl = "";
        if (response.data.query.pages[pageId].original) {
            imageUrl = response.data.query.pages[pageId].original.source;
        } else if (response.data.query.pages[pageId].thumbnail) {
            imageUrl = response.data.query.pages[pageId].thumbnail.source;
        }

        // Menambahkan data baru ke this.data
        const newData: Data = {
            id: title,
            Title: title,
            Image: imageUrl,
            Pembuat: "",
            Diedit: "",
            Link: "",
            Waktu: "",
            Edit: "",
            Content: [
                {
                    babTitle: "", // You might want to set babTitle appropriately or fetch it from the API
                    babContent: content,
                },
            ],
        };
        if (newData && newData.Content[0].babContent) {
            const isDataExists = await this.data.findOne({ id: newData.id });

            if (!isDataExists) {
                await this.data.create(newData);
                return [newData]; // Mengembalikan data baru dalam bentuk array
            }
        }
    }

    delete(id: string, ongoing: boolean) {
        if (ongoing) {
            this.ongoingData.deleteOne({ id: id })
        } else {
            this.data.deleteOne({ id: id })
        }
    }

    async edit(id: string, pembuat: string, data: any) {
        // Find the document in the "mainModel" collection based on the id
        const acceptedData = await this.data.findOne({ id: id });

        if (!acceptedData) {
            return { data: "Data Not Found" }; // Handle case where the data doesn't exist
        }

        const tanggalSekarang = new Date();
        const namaBulan = [
            "Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli",
            "Agustus", "September", "Oktober", "November", "Desember"
        ];
        const tanggal = tanggalSekarang.getDate();
        const bulan = namaBulan[tanggalSekarang.getMonth()];
        const tahun = tanggalSekarang.getFullYear();
        const formatWaktu = `${tanggal}-${bulan}-${tahun}`;

        // Prepare the updated data
        const updatedData = {
            id: id,
            Title: data.title,
            Pembuat: pembuat,
            Image: `${process.env.urlEndpoint}RejangPedia/image-${id}.jpg`,
            Diedit: data.pembuat,
            Link: data.link.replace("/watch?v=", "/embed/"),
            Waktu: acceptedData.Waktu || "Tidak Diketahui", // Use existing Waktu if available
            Edit: formatWaktu,
            Content: JSON.parse(data.content) // Ensure the content is correctly formatted
        };

        // Using `updateOne` to either update the document or insert it
        await this.ongoingData.updateOne(
            { id: id }, // Find by ID
            { $set: updatedData }, // Update fields
            { upsert: true } // Create a new document if it doesn't exist
        );

        // Return a success message
        return { data: "Data successfully updated" };
    }
    async create(body: Data, image: string = "") {
        const uniqueFileName = uuidv4();
        const tanggalSekarang = new Date();

        const namaBulan = [ //Buat nama bulannya biar... keren hehehehee
            "Januari",
            "Februari",
            "Maret",
            "April",
            "Mei",
            "Juni",
            "Juli",
            "Agustus",
            "September",
            "Oktober",
            "November",
            "Desember",
        ];
        const tanggal = tanggalSekarang.getDate();
        const bulan = namaBulan[tanggalSekarang.getMonth()];
        const tahun = tanggalSekarang.getFullYear();

        // Upload the data to MongoDB using the 'goingModel'
        await this.ongoingData.create({
            id: uniqueFileName,
            Title: body.Title,
            Image: image,
            Pembuat: body.Pembuat,
            Link: body.Link.replace("/watch?v=", "/embed/"),
            Edit: `${tanggal}-${bulan}-${tahun}`,
            Waktu: `${tanggal}-${bulan}-${tahun}`,
            Content: body.Content,
        });
    }
}
