import {NextRequest, NextResponse} from "next/server";
import {getServerSession} from "next-auth";
import {authOptions} from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET (req: NextRequest, { params }: { params: Promise<{ id: string, serviceId: string }> }) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const userId = Number(session.user.id);

        const { id, serviceId } = await params;

        if (Number.isNaN(id) || Number.isNaN(serviceId)) {
            return NextResponse.json(
                { error: "Invalid employeeId or serviceId" },
                { status: 400 }
            );
        }

        const service = await prisma.service.findFirst({
            where: {
                id: +serviceId,
                employeeId: +id
            },
        });

        if (!service) {
            return NextResponse.json(
                {error: "Service not found for this employee"},
                {status: 404}
            );
        }

        return NextResponse.json(service);
    }
    catch (e) {
        console.error(e);
    }
}

export async function DELETE (req: NextRequest, { params }: { params: Promise<{ id: string, serviceId: string }> }) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = Number(session.user.id);

    const { id, serviceId } = await params;

    if (Number.isNaN(id) || Number.isNaN(serviceId)) {
        return NextResponse.json(
            { error: "Invalid employeeId or serviceId" },
            { status: 400 }
        );
    }

    try {
        const service = await prisma.service.findFirst({
            where: {
                id: +serviceId,
                employeeId: +id
            },
        });

        if (!service) {
            return NextResponse.json(
                {error: "Service not found for this employee"},
                {status: 404}
            );
        }

        await prisma.service.delete({
            where: {id: +serviceId},
        });

        return NextResponse.json({success: true});
    }
    catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Failed to delete service" },
            { status: 500 }
        );
    }

}

export async function PATCH (req: NextRequest, { params }: { params: Promise<{ id: string, serviceId: string }> }) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const userId = Number(session.user.id);

        const { id, serviceId } = await params;

        if (Number.isNaN(id) || Number.isNaN(serviceId)) {
            return NextResponse.json(
                { error: "Invalid employeeId or serviceId" },
                { status: 400 }
            );
        }

        const service = await prisma.service.findFirst({
            where: {
                id: +serviceId,
                employeeId: +id
            },
        });

        if (!service) {
            return NextResponse.json(
                {error: "Service not found for this employee"},
                {status: 404}
            );
        }

        const body = await req.json();

        const { name, description, duration, timeOffset, price } = body;

        const updatedService = await prisma.service.update({
            where: { id: +serviceId },
            data: {
                ...(name !== undefined && { name }),
                ...(description !== undefined && { description }),
                ...(duration !== undefined && { duration }),
                ...(timeOffset !== undefined && { timeOffset }),
                ...(price !== undefined && { price }),
            },
        });

        return NextResponse.json(updatedService);
    }
    catch (e) {
        console.log(e);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}