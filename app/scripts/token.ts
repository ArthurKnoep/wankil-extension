import axios from 'axios';

interface TokenFromAPI {
    access_token: string
    expires_in: number
    token_type: string
}

interface Token {
    accessToken: string
    expiresAt: Date
    tokenType: string
}

function newToken(obj: any): Token {
    return {
        accessToken: obj.accessToken,
        expiresAt: new Date(obj.expiresAt),
        tokenType: obj.tokenType,
    }
}

const STORAGE_TOKEN_KEY = 'wankil_ext_token';
const tokenUrl = 'https://wankil-ext-token.knoepflin.eu/token';

export class TokenManager {
    private token?: Token;

    constructor() {
        const value = window.localStorage.getItem(STORAGE_TOKEN_KEY);
        if (value) {
            try {
                this.token = newToken(JSON.parse(value));
            } catch (e) {
                window.localStorage.removeItem(STORAGE_TOKEN_KEY);
            }
        }
    }

    private async queryToken(): Promise<Token> {
        const {data: token} = await axios.get(tokenUrl);
        return {
            accessToken: (token as TokenFromAPI).access_token,
            expiresAt: new Date(new Date().getTime() + (token as TokenFromAPI).expires_in * 1000),
            tokenType: (token as TokenFromAPI).token_type
        }
    }

    public async getToken(): Promise<Token> {
        if (this.token && this.token.expiresAt > new Date()) {
            return this.token;
        }
        this.token = await this.queryToken();
        window.localStorage.setItem(STORAGE_TOKEN_KEY, JSON.stringify(this.token));
        return this.token;
    }
}
