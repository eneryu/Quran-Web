import { NextResponse } from 'next/server';
import axios from 'axios';

const HADITH_API_KEY = '$2y$10$roANFBBvVv7XQFORoMuuBRbAJ23Iio7YnXLStmzBeQJQgdvm8C';
const BASE_URL = 'https://hadithapi.com/api';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const path = searchParams.get('path') || 'hadiths';

    // Clone searchParams to pass them to the external API
    const externalParams = new URLSearchParams(searchParams);
    externalParams.delete('path'); // Don't pass the internal 'path' param
    externalParams.set('apiKey', HADITH_API_KEY);

    try {
        const url = `${BASE_URL}/${path}?${externalParams.toString()}`;
        const response = await axios.get(url);
        return NextResponse.json(response.data);
    } catch (error: any) {
        console.error('Hadith Proxy Error:', error.response?.data || error.message);
        return NextResponse.json({ error: 'Failed to fetch data' }, { status: error.response?.status || 500 });
    }
}
