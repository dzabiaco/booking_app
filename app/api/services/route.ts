import {NextRequest, NextResponse} from "next/server";
import {getServerSession} from "next-auth";
import {authOptions} from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = Number(session.user.id);

    // const services = await prisma.service.findMany({
    //     where: {
    //         company: {
    //             user: {
    //                 id: userId,
    //             },
    //         },
    //     },
    // });
    return NextResponse.json(userId);
}

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json(
                {message: "Unauthorized"},
                {status: 401}
            );
        }

        const userId = Number(session.user.id);

        const body = await req.json();
        const {name, description, duration, timeOffset} = body;

        if (!name || !duration) {
            return NextResponse.json(
                {message: "Missing required fields"},
                {status: 400}
            );
        }

        const company = await prisma.company.findFirst({
            where: {
                user: {
                    id: userId,
                },
            },
            select: {
                id: true,
            },
        });

        if (!company) {
            return NextResponse.json(
                { message: "Company not found" },
                { status: 404 }
            );
        }

        // 2️⃣ create service
        // const service = await prisma.service.create({
        //     data: {
        //         name,
        //         description,
        //         duration,
        //         timeOffset,
        //         companyId: company.id,
        //     },
        // });

        return NextResponse.json(company, { status: 201 });

    }
    catch (error) {
        console.log(error);
    }

}