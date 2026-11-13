
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  context: { params: Promise<{ shortCode: string }> }
) {
  try {
    const { shortCode } = await context.params;

    const url = await prisma.url.findUnique({
      where: { shortCode },
    });

    if (!url) {
      return NextResponse.json(
        { message: "Short URL not found." },
        { status: 404 }
      );
    }

    await prisma.$transaction([
      prisma.url.update({
        where: { id: url.id },
        data: { clicks: { increment: 1 } },
      }),
      prisma.clickEvent.create({
        data: {
          urlId: url.id,
          referrer: request.headers.get("referer"),
          userAgent: request.headers.get("user-agent"),
        },
      }),
    ]);

    return NextResponse.redirect(url.originalUrl, 302);
  } catch (error) {
    console.error("URL redirect error:", error);

    return NextResponse.json(
      { message: "Something went wrong while redirecting." },
      { status: 500 }
    );
  }
}
