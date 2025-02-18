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

type userType = {
    id?: string;
    username: string;
    password?: string;
    desc?: string;
    atmin?: boolean;
    accessToken?: {
        accessNow: string;
        timeBefore: string;
    };
};