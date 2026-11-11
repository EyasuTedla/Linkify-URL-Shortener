
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "../../../src/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { name, email, password } = body;

    // 1. Validate required fields
    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string" ||
      !name.trim() ||
      !email.trim() ||
      !password
    ) {
      return NextResponse.json(
        { message: "Name, email, and password are required." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    // 2. Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(normalizedEmail)) {
      return NextResponse.json(
        { message: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    // 3. Validate password length
    const passwordBytes = new TextEncoder().encode(password).length;

    if (passwordBytes < 8 || passwordBytes > 72) {
      return NextResponse.json(
        { message: "Password must be between 8 and 72 bytes." },
        { status: 400 }
      );
    }

    // 4. Check whether the user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "An account with this email already exists." },
        { status: 409 }
      );
    }

    // 5. Hash the password
    const passwordHash = await bcrypt.hash(password, 12);

    // 6. Create the user
    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: normalizedEmail,
        passwordHash,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    // 7. Return successful response
    return NextResponse.json(
      {
        message: "Account created successfully.",
        user,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);

    return NextResponse.json(
      { message: "Something went wrong during registration." },
      { status: 500 }
    );
  }
}
