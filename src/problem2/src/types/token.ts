export interface TokenItem {
    currency: string;
    date: string;
    price: number;
}

export interface TokensData {
    tokens: TokenItem[];
}

export interface TokensResponse {
    status: boolean;
    message: string;
    data: TokensData;
}