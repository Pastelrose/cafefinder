import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const address = searchParams.get("address");

    if (!address) {
        return NextResponse.json({ error: "Address is required" }, { status: 400 });
    }

    const apiKey = process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY;

    if (!apiKey) {
        return NextResponse.json({ error: "Kakao API Key is missing" }, { status: 500 });
    }

    try {
        const response = await fetch(
            `https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURIComponent(address)}`,
            {
                headers: {
                    Authorization: `KakaoAK ${apiKey}`,
                },
            }
        );

        if (!response.ok) {
            throw new Error(`Kakao API Error: ${response.statusText}`);
        }

        const data = await response.json();

        if (data.documents && data.documents.length > 0) {
            const { x, y } = data.documents[0];
            return NextResponse.json({ lat: parseFloat(y), lng: parseFloat(x) });
        } else {
            return NextResponse.json({ error: "No result found" }, { status: 404 });
        }
    } catch (error) {
        console.error("Geocoding error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
