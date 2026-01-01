import { NextRequest, NextResponse } from 'next/server';
import {getServerSession} from "next-auth";
import {authOptions} from "@/lib/auth";
import prisma from '@/lib/prisma';

type ServiceInput = {
    name: string;
    description: string;
    duration: number;
    timeOffset: number;
};

type EmployeeInput = {
    name: string;
    instagram?: string;
    whatsapp?: string;
    telegram?: string;
    viber?: string;
    phone: string;
    services?: ServiceInput[];
};


export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = Number(session.user.id);

    const user = await prisma.user.findUnique({
        where: { id: userId },
    });

    if (!user?.companyId) {
        return NextResponse.json({ error: "User has no company" }, { status: 400 });
    }

    const employees = await prisma.employee.findMany({
        where: { companyId: user.companyId },
    });

    return NextResponse.json(employees);
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
            select: { companyId: true },
        });

        if (!user?.companyId) {
            return NextResponse.json(
                { error: "User has no company" },
                { status: 400 }
            );
        }

        const body = await req.json();
        const {
            name,
            instagram,
            whatsapp,
            telegram,
            viber,
            phone,
            photo,
            services = [],
        } = body;

        if (!name || !phone) {
            return NextResponse.json(
                { error: "Name and phone are required" },
                { status: 400 }
            );
        }

        const employee = await prisma.employee.create({
            data: {
                name,
                instagram,
                whatsapp,
                telegram,
                viber,
                phone,
                photo,

                company: {
                    connect: { id: user.companyId },
                },

                // 🔑 Nested create
                services: {
                    create: services.map((service: ServiceInput) => ({
                        name: service.name,
                        description: service.description,
                        duration: service.duration,
                        timeOffset: service.timeOffset,
                    })),
                },
            },
            include: {
                services: true,
                company: true,
            },
        });

        return NextResponse.json(employee, { status: 201 });
    }
    catch (error) {
        console.error(error);
        return NextResponse.json({ error }, { status: 500 });
    }
}