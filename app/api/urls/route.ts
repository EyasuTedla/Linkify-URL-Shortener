
import { NextResponse } from "next/server";
import { randomBytes } from "crypto";

import { auth } from "../../../auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    // 1. Check authentication
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "You must be logged in to shorten URLs." },
        { status: 401 }
      );
    }

    // 2. Read the request body
    const body = await request.json();
    const { originalUrl } = body;

    if (
      typeof originalUrl !== "string" ||
      !originalUrl.trim()
    ) {
      return NextResponse.json(
        { message: "Please provide a URL." },
        { status: 400 }
      );
    }

    // 3. Validate the URL
    let parsedUrl: URL;

    try {
      parsedUrl = new URL(originalUrl.trim());
    } catch {
      return NextResponse.json(
        { message: "Please provide a valid URL." },
        { status: 400 }
      );
    }

    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
      return NextResponse.json(
        { message: "Only HTTP and HTTPS URLs are supported." },
        { status: 400 }
      );
    }

    // 4. Generate a unique short code
    let shortCode = "";
    let isUnique = false;

    while (!isUnique) {
      shortCode = randomBytes(6).toString("base64url");

      const existingUrl = await prisma.url.findUnique({
        where: { shortCode },
      });

      if (!existingUrl) {
        isUnique = true;
      }
    }

    // 5. Save the URL in the database
    const url = await prisma.url.create({
      data: {
        originalUrl: parsedUrl.toString(),
        shortCode,
        userId: session.user.id,
      },
    });

    // 6. Return the result
    return NextResponse.json(
      {
        message: "URL shortened successfully.",
        url: {
          id: url.id,
          originalUrl: url.originalUrl,
          shortCode: url.shortCode,
          shortUrl: `${new URL(request.url).origin}/${url.shortCode}`,
          clicks: url.clicks,
          createdAt: url.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("URL creation error:", error);

    return NextResponse.json(
      { message: "Something went wrong while shortening the URL." },
      { status: 500 }
    );
  }
}
