import UpdateCompany from "@/components/company/update-company";
import {getServerSession} from "next-auth";
import {authOptions} from "@/lib/auth";
import {redirect} from "next/navigation";
import CreateCompany from "@/components/company/create-company";
import prisma from "@/lib/prisma";

export default async function CompanyInfo() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return redirect("/login");
    }

    console.log("session", session);

    const company = await prisma.company.findFirst({
        where: {
            user: {
                id: Number(session.user.id),
            },
        },
        include: {
            user: true,
        },
    });

    if (!company) {
        return <CreateCompany />;
    }

    return (
        <UpdateCompany/>
    );
}