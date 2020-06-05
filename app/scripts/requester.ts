import axios from 'axios';

export interface Stream {
    id: string,
    user_id: string,
    user_name: string,
    game_id: string,
    game_name: string,
    game_box_art_url: string,
    type: string,
    title: string,
    viewer_count: number,
    started_at: string,
    language: string,
    thumbnal_url: string,
    tag_ids: string[]
}

const apiUrl = 'https://wankil-ext.knoepflin.eu';

export class Requester {
    async queryStreams(userLogins: string[]): Promise<Stream[]> {
        const params = new URLSearchParams();
        userLogins.forEach(login => params.append('user_id', login));
        const { data: streams } = await axios.get(`${apiUrl}/streams?${params.toString()}`);
        return streams.streams;
    }
}
