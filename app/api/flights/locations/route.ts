import { NextRequest, NextResponse } from "next/server";

let accessToken: string | null = null;
let tokenExpiry: number | null = null;

async function getAccessToken(): Promise<string> {
  // Check if we have a valid token
  if (accessToken && tokenExpiry && Date.now() < tokenExpiry) {
    return accessToken;
  }

  const clientId = process.env.AMADEUS_API_KEY;
  const clientSecret = process.env.AMADEUS_API_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("Amadeus API credentials not configured");
  }

  const response = await fetch(
    "https://test.api.amadeus.com/v1/security/oauth2/token",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: clientId,
        client_secret: clientSecret,
      }),
    },
  );

  if (!response.ok) {
    throw new Error("Failed to authenticate with Amadeus API");
  }

  const data = await response.json();
  accessToken = data.access_token;
  // Set expiry to 5 minutes before actual expiry for safety
  tokenExpiry = Date.now() + (data.expires_in - 300) * 1000;

  return accessToken as string;
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const keyword = searchParams.get("keyword");

    if (!keyword || keyword.length < 2) {
      return NextResponse.json(
        { error: "Keyword must be at least 2 characters" },
        { status: 400 },
      );
    }

    const token = await getAccessToken();

    const response = await fetch(
      `https://test.api.amadeus.com/v1/reference-data/locations?subType=CITY,AIRPORT&keyword=${encodeURIComponent(keyword)}&page%5Blimit%5D=10`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error("Failed to search locations");
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error searching locations:", error);
    return NextResponse.json(
      { error: "Failed to search locations" },
      { status: 500 },
    );
  }
}
