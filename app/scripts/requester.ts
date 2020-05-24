import axios from 'axios';
import { clientId } from './config';
import { TokenManager } from './token';

export interface Stream {
    id: string,
    user_id: string,
    user_name: string,
    game_id: string,
    type: string,
    title: string,
    viewer_count: number,
    started_at: string,
    language: string,
    thumbnal_url: string,
    tag_ids: string[]
}

export interface Game {
    "id": string,
    "name": string,
    "box_art_url": string,
}

export interface GenericResponse<T> {
    data: T;
    pagination: {}
}

const twitchApiUrl = 'https://api.twitch.tv';

export class Requester {
    private readonly tokenManager: TokenManager;

    constructor(tokenManager: TokenManager) {
        this.tokenManager = tokenManager;
    }

    async queryStreams(userLogins: string[]): Promise<GenericResponse<Stream[]>> {
        const token = await this.tokenManager.getToken();
        const params = new URLSearchParams();
        userLogins.forEach(login => params.append('user_id', login));
        const { data: streams } = await axios.get(`${twitchApiUrl}/helix/streams?${params.toString()}`, {
            headers: {
                'Client-ID': clientId,
                'Authorization': `Bearer ${token.accessToken}`
            }
        });
        return streams;
    }

    async queryGames(gameIds: string[]): Promise<GenericResponse<Game[]>> {
        const token = await this.tokenManager.getToken();
        const params = new URLSearchParams();
        gameIds.forEach(id => params.append('id', id));
        const { data: games } = await axios.get(`${twitchApiUrl}/helix/games?${params.toString()}`, {
            headers: {
                'Client-ID': clientId,
                'Authorization': `Bearer ${token.accessToken}`
            }
        });
        return games;
    }
}
