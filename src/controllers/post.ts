import { goingModel, mainModel } from "@/models/post";
import { Model } from "mongoose";
import axios from "axios";

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
        if (!rejangpedia.instance) rejangpedia.instance = new rejangpedia();
        return rejangpedia.instance;
    }

    async getRecomendation() {
        const recomendation = await this.data.find().limit(5).exec();

        const filteredRecommendation = recomendation.filter((item) => item.Title.toLowerCase().includes("rejang") || item.Title.toLowerCase().includes("bengkulu"));

        return filteredRecommendation;
    }

    async getDetails(id: string, onGoing: boolean) {
        let mahiru: Data[];

        if (onGoing) mahiru = await this.ongoingData.find((obj: Data) => obj.id === id);
        else mahiru = await this.data.find((obj: Data) => obj.id === id);

        //cek dulu data nya null or tidak
        if (!mahiru) return { data: "Data Not Found" };

        return { data: mahiru };
    }

    async search(searchTerm: string) {
        let combinedResults = []; // Inisialisasi atau reset nilai ke array kosong setiap kali metode dipanggil
        // 1. Mencari di data lokal
        const localDataResults = await this.data.find((item: Data) => item.Title.toLowerCase().includes(searchTerm.toLowerCase()));

        // 2. Mencari di Wikipedia
        const wikipediaResults = await this.searchWikipedia(searchTerm);

        // 3. Menggabungkan hasil dari kedua sumber tanpa duplikasi
        combinedResults = [...localDataResults];
        if (wikipediaResults) {
            wikipediaResults.forEach((wikipediaItem: Data) => {
                const isDuplicate = localDataResults.some((localItem) => localItem.id === wikipediaItem.id);

                //@ts-ignore
                if (!isDuplicate) combinedResults.push(wikipediaItem);
            });
        }

        return combinedResults;
    }

    async searchWikipedia(searchTerm: string) {
        // Mengecek apakah data sudah ada berdasarkan judul
        let existingData: any = [];
        existingData = await this.data.find((item: Data) => item.Title === searchTerm);
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

    userAction() {
        return {
            //TODO bikin function delete, newArticle, editArticle!!!!!
        }
    }
}
