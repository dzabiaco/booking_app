"use client";

import {useEffect, useState} from "react";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import EmployeeCard from "@/components/employee/employee-card";
import {Search} from "lucide-react";
import {useModal} from "@/context/ModalContext";
import AddNewEmployee from "@/components/modal/AddNewEmployee";
import {Employee} from "@/app/types/Employee";


export default function CompanyEmployees() {
    const [search, setSearch] = useState("");

    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(true);

    const { open } = useModal();

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const res = await fetch("/api/employees");

                if (!res.ok) {
                    console.warn("Failed to fetch employees");
                    setEmployees([]); // fallback
                    return;
                }

                const data = await res.json();
                setEmployees(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchEmployees();
    }, []);

    // Filter employees based on search
    const filteredEmployees = employees.filter((e) =>
        e.name.toLowerCase().includes(search.toLowerCase())
    );

    const handleEmployeeCreated = (newEmployee: Employee) => {
        setEmployees(prev => [...prev, newEmployee]);
    };

    return (
        <div className="p-4">
            {/* First Row: Search + Add Button */}
            <div className="flex justify-between items-center mb-4 gap-4">
                <div className="relative w-full max-w-sm group">
                    {/* Animated ring */}
                    <span
                        className="
        pointer-events-none
        absolute inset-0 rounded-md
        ring-1 ring-transparent
        transition-all duration-300
        group-focus-within:ring-2
        group-focus-within:ring-blue-500/60
      "
                    />

                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10"/>

                    <Input
                        placeholder="Search employees..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="
        pl-9
        focus-visible:ring-0
        focus-visible:ring-offset-0
      "
                    />
                </div>

                <Button className="cursor-pointer" onClick={() =>
                    open(
                        <AddNewEmployee onCreated={handleEmployeeCreated}/>
                    )}>
                    Add Employee
                </Button>
            </div>

            {/* Grid of Employee Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
                {loading ? (
                    <p className="col-span-full text-center text-muted-foreground">
                        Loading employees...
                    </p>
                ) : filteredEmployees.length === 0 ? (
                    <p className="col-span-full text-center text-muted-foreground">
                        No employees found
                    </p>
                ) : (
                    filteredEmployees.map((employee) => (
                        <EmployeeCard key={employee.id} employee={employee} />
                    ))
                )}
            </div>
        </div>
    );
}