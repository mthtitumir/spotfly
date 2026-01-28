import { getAccessToken } from "@/utils/getAccessToken";
import { NextRequest, NextResponse } from "next/server";

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
