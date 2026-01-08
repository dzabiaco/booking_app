import {NextRequest, NextResponse} from "next/server";
import {getServerSession} from "next-auth";
import {authOptions} from "@/lib/auth";
import prisma from "@/lib/prisma";

const DAYS_OF_WEEK = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
] as const;


export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const employeeId = Number(id);

        if (Number.isNaN(employeeId)) {
            return NextResponse.json(
                { error: "Invalid employeeId" },
                { status: 400 }
            );
        }

        // 1️⃣ Check if schedule already exists
        const scheduleCount = await prisma.scheduleEmployee.count({
            where: { userId: employeeId },
        });

        // 2️⃣ Create default schedule ONLY ONCE
        if (scheduleCount === 0) {
            const daysOfWeek = Array.from({ length: 7 }, (_, i) => i); // 0..6

            await prisma.scheduleEmployee.createMany({
                data: daysOfWeek.map((day) => ({
                    dayOfWeek: day,
                    startTime: "09:00",
                    endTime: "18:00",
                    userId: employeeId,
                })),
                skipDuplicates: true,
            });
        }

        // 3️⃣ Always return schedule
        const schedule = await prisma.scheduleEmployee.findMany({
            where: { userId: employeeId },
            orderBy: { dayOfWeek: "asc" },
        });

        return NextResponse.json(schedule);
    } catch (e) {
        console.error(e);
        return NextResponse.json(
            { message: "Failed to get employee schedule" },
            { status: 500 }
        );
    }
}


export async function PATCH(req: NextRequest) {
    try {
        const body = await req.json();
        const { userId, scheduleId, dayOfWeek, startTime, endTime } = body;

        if (!userId || !scheduleId || dayOfWeek === undefined) {
            return NextResponse.json(
                { message: "Missing required fields" },
                { status: 400 }
            );
        }

        // Check if the schedule exists and belongs to the user
        const schedule = await prisma.scheduleEmployee.findUnique({
            where: { id: scheduleId },
        });

        if (!schedule || schedule.userId !== userId) {
            return NextResponse.json(
                { message: "Schedule not found for this user" },
                { status: 404 }
            );
        }

        // Update the schedule
        const updatedSchedule = await prisma.scheduleEmployee.update({
            where: { id: scheduleId },
            data: {
                dayOfWeek,
                startTime: startTime ?? schedule.startTime,
                endTime: endTime ?? schedule.endTime,
            },
        });

        return NextResponse.json({ schedule: updatedSchedule });
    } catch (error) {
        console.error("Failed to update schedule:", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}

