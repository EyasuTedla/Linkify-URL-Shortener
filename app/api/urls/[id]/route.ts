
import { NextResponse } from "next/server";

import { auth } from "../../../../auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "You must be logged in to delete URLs." },
        { status: 401 }
      );
    }

    const { id } = await context.params;

    const result = await prisma.url.deleteMany({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (result.count === 0) {
      return NextResponse.json(
        { message: "URL not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "URL deleted successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("URL deletion error:", error);

    return NextResponse.json(
      { message: "Something went wrong while deleting the URL." },
      { status: 500 }
    );
  }
}
