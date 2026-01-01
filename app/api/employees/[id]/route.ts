import {NextRequest, NextResponse} from "next/server";
import {getServerSession} from "next-auth";
import {authOptions} from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = Number(session.user.id);

    const { id } = await params;


    const user = await prisma.user.findUnique({
        where: { id: userId },
    });

    if (!user?.companyId) {
        return NextResponse.json({ error: "User has no company" }, { status: 400 });
    }

    const employees = await prisma.employee.findFirst({
        where: { id: +id },
        include: {
            services: true
        }
    });

    return NextResponse.json(employees);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const employees = await prisma.employee.delete({
        where: { id: +id },
        include: {
            services: true
        }
    });

    return NextResponse.json(employees);
}

export async function PATCH(req: NextRequest,  { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({message: "Unauthorized"}, {status: 401});
        }

        const {id} = await params;

        const body = await req.json();

        const employee = await prisma.employee.update({
            where: {id: +id},
            data: {
                name: body.name,
                instagram: body.instagram,
                whatsapp: body.whatsapp,
                telegram: body.telegram,
                viber: body.viber,
                phone: body.phone,
                photo: body.photo,
            },
        });
        return NextResponse.json(employee);
    }
    catch (error) {
        console.error(error);
        return NextResponse.json(
            { message: "Failed to update employee" },
            { status: 500 }
        );
    }
}

export async function POST (req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const userId = Number(session.user.id);

        const body = await req.json();

        const { name, description, duration, timeOffset, price, employeeId } = body;

        if (!name || !description || !duration || !timeOffset || !price || !employeeId) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        const service = await prisma.service.create({
            data: {
                name,
                description,
                duration,
                timeOffset: timeOffset || 0,
                price: price || 0,
                employeeId,
            },
        });

        return NextResponse.json(service, { status: 201 });
    }
    catch (e) {
        console.log(e);
    }


}