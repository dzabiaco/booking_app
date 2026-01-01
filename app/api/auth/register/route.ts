import {NextRequest, NextResponse} from "next/server";
import bcrypt from 'bcrypt';
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
    return NextResponse.json(
        { message: "AUTH GET" },
        { status: 200 }
    );
}

export async function POST(req: NextRequest) {
    try {
        // Correct way to get JSON body
        const body: {
            email: string;
            password: string;
            role: 'user' | 'admin';
        } = await req.json();

        const { email, password, role='user' } = body;

        // Validate required fields
        if (!email || !password) {
            return NextResponse.json({ message: "All fields are required" }, { status: 400 });
        }

        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json(
                { message: 'User with this email already exists' },
                { status: 409 } // Conflict
            )
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const savedUser = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                role,
            },
        });

        const { password: _, ...safeUser } = savedUser

        return NextResponse.json(safeUser, { status: 201 });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}