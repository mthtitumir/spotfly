import { getAccessToken } from "@/utils/getAccessToken";
import { NextRequest, NextResponse } from "next/server";

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
