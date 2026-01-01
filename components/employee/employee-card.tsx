import {Card, CardHeader, CardTitle} from "@/components/ui/card";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import Link from "next/link";

interface Employee {
    id: number;
    name: string;
    avatarUrl?: string;
}

interface EmployeeCardProps {
    employee: Employee;
}

export default function EmployeeCard({employee}: EmployeeCardProps) {
    return (
        <Link href={`/admin/company-employees/${employee.id}`}>
            <Card className="hover:shadow-lg transition duration-200 cursor-pointer">
                <CardHeader className="flex flex-col items-center space-y-2">
                    <Avatar className="w-20 h-20">
                        {employee.avatarUrl ? (
                            <AvatarImage src={employee.avatarUrl} alt={employee.name}/>
                        ) : (
                            <AvatarFallback>{employee.name[0]}</AvatarFallback>
                        )}
                    </Avatar>
                    <CardTitle className="text-center text-lg">{employee.name}</CardTitle>
                </CardHeader>
            </Card>
        </Link>
    );
}