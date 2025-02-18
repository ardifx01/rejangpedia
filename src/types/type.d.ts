type Data = {
    id: string;
    Title: string;
    Image: string;
    Pembuat: string;
    Diedit: string;
    Link: string;
    Waktu: string;
    Edit: string;
    Content: {
        babTitle: string;
        babContent: string;
    }[];
}

type Users = {
    id: string;
    username: string;
    password: string;
    desc: string;
    atmin: boolean;
};