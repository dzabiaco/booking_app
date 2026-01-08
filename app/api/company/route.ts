import { NextRequest, NextResponse } from 'next/server';
import {getServerSession} from "next-auth";
import {authOptions} from "@/lib/auth";
import prisma from '@/lib/prisma';


export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = Number(session.user.id);

    const company = await prisma.company.findFirst({
        where: {
            users: {
                some: {
                    id: userId,
                },
            },
        },
    });
    return NextResponse.json(company);
}

export async function POST(req: NextRequest) {
    try {

        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const userId = Number(session.user.id);

        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { company: true },
        });

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        if (user.company) {
            return NextResponse.json(
                { message: "User already has a company" },
                { status: 400 }
            );
        }

        // Correct way to get JSON body
        const body: {
            companyName: string;
            companyLocation: string;
            logo?: string;
            companyInstagram: string;
            companyPhone: string;
            companyTiktok: string;
            companyFacebook: string;
            companyTelegram: string;
            companyWhatsapp: string;
            companyViber: string;
        } = await req.json();

        const { companyName, companyLocation, companyInstagram, companyPhone, companyTiktok, companyFacebook, companyTelegram,companyWhatsapp, companyViber} = body;

        console.log("BODY", body);

        // Validate required fields
        if (!companyName || !companyLocation || !companyInstagram || !companyPhone) {
            return NextResponse.json({ message: "All fields are required" }, { status: 400 });
        }

        const newCompany = await prisma.company.create({
            data: {
                name: companyName,
                location: companyLocation,
                instagram: companyInstagram,
                phone: companyPhone,
                logo: "https://test.com/logo.png",
                tiktok: companyTiktok,
                facebook: companyFacebook,
                telegram: companyTelegram,
                whatsapp: companyWhatsapp,
                viber: companyViber,
                users: {
                    connect: { id: userId },
                },
            },
        });

        return NextResponse.json(newCompany, { status: 201 });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const userId = Number(session.user.id);

        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { company: true },
        });

        if (!user || !user.company) {
            return NextResponse.json(
                { message: "Company not found" },
                { status: 404 }
            );
        }

        const body: Partial<{
            companyName: string;
            companyLocation: string;
            logo: string;
            companyInstagram: string;
            companyPhone: string;
            companyTiktok: string;
            companyFacebook: string;
            companyTelegram: string;
            companyWhatsapp: string;
            companyViber: string;
        }> = await req.json();

        if (Object.keys(body).length === 0) {
            return NextResponse.json(
                { message: "No fields provided for update" },
                { status: 400 }
            );
        }

        const updatedCompany = await prisma.company.update({
            where: {
                id: user.company.id,
            },
            data: {
                name: body.companyName,
                location: body.companyLocation,
                instagram: body.companyInstagram,
                phone: body.companyPhone,
                logo: body.logo,
                tiktok: body.companyTiktok,
                facebook: body.companyFacebook,
                telegram: body.companyTelegram,
                whatsapp: body.companyWhatsapp,
                viber: body.companyViber,
            },
        });

        return NextResponse.json(updatedCompany, { status: 200 });
    }
    catch (e) {
        console.error(e);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}