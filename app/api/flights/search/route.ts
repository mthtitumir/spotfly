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

    const originLocationCode = searchParams.get("originLocationCode");
    const destinationLocationCode = searchParams.get("destinationLocationCode");
    const departureDate = searchParams.get("departureDate");
    const returnDate = searchParams.get("returnDate");
    const adults = searchParams.get("adults") || "1";
    const children = searchParams.get("children") || "0";
    const travelClass = searchParams.get("travelClass");
    const nonStop = searchParams.get("nonStop");
    const maxPrice = searchParams.get("maxPrice");
    const max = searchParams.get("max") || "50";

    if (!originLocationCode || !destinationLocationCode || !departureDate) {
      return NextResponse.json(
        {
          error:
            "Missing required parameters: originLocationCode, destinationLocationCode, departureDate",
        },
        { status: 400 },
      );
    }

    const token = await getAccessToken();

    const queryParams = new URLSearchParams({
      originLocationCode,
      destinationLocationCode,
      departureDate,
      adults,
      max,
    });

    if (returnDate) queryParams.append("returnDate", returnDate);
    if (children && children !== "0") queryParams.append("children", children);
    if (travelClass) queryParams.append("travelClass", travelClass);
    if (nonStop) queryParams.append("nonStop", nonStop);
    if (maxPrice) queryParams.append("maxPrice", maxPrice);

    const response = await fetch(
      `https://test.api.amadeus.com/v2/shopping/flight-offers?${queryParams.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Amadeus API error:", errorData);
      throw new Error("Failed to search flights");
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error searching flights:", error);
    return NextResponse.json(
      { error: "Failed to search flights" },
      { status: 500 },
    );
  }
}
