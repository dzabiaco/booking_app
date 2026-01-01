'use client'

import {Button} from '@/components/ui/button'
import {Card, CardContent} from '@/components/ui/card'
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar'
import {useEffect, useState} from 'react'
import {useParams, useRouter} from "next/navigation";
import {Employee} from "@/app/types/Employee";
import {Check, SquarePen, X} from "lucide-react";
import { Input } from "@/components/ui/input";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import EmployeeServices from "@/components/employee/services/employee-services";
import Service from "@/app/types/Service";


interface InfoRowProps {
    label: string;
    value?: string;
    userId: string;
    onUpdate: (field: string, value: string) => void;
}

function InfoRow({ label, value, userId, onUpdate }: InfoRowProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [draft, setDraft] = useState(value ?? "");

    const startEdit = () => {
        setDraft(value ?? "");
        setIsEditing(true);
    };

    if (!value && !isEditing) return null;

    const onCancel = () => {
        setDraft(value ?? "");
        setIsEditing(false);
    };

    const onSave = async () => {
        const res = await fetch(`/api/employees/${userId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                [label.toLowerCase()]: draft,
            }),
        });

        if (res.ok) {
            onUpdate(label.toLowerCase(), draft);
            setIsEditing(false);
        }
    };

    return (
        <div className="flex items-center justify-between gap-3">
            <div className="flex flex-col flex-1">
                <span className="text-xs text-muted-foreground">{label}</span>

                {!isEditing ? (
                    <span className="text-sm font-medium">{value}</span>
                ) : (
                    <Input
                        value={draft}
                        onChange={(e) => setDraft(e.target.value)}
                        className="h-8 text-sm"
                        autoFocus
                    />
                )}
            </div>

            {!isEditing ? (
                <SquarePen
                    className="h-4 w-4 cursor-pointer text-muted-foreground hover:text-foreground"
                    onClick={startEdit}
                />
            ) : (
                <div className="flex items-center gap-2">
                    <Check
                        className="h-4 w-4 cursor-pointer text-green-600"
                        onClick={onSave}
                    />
                    <X
                        className="h-4 w-4 cursor-pointer text-muted-foreground hover:text-foreground"
                        onClick={onCancel}
                    />
                </div>
            )}
        </div>
    );
}

export default function CompanyEmployees() {
    const [photo, setPhoto] = useState<string | null>(null);
    const [selectedUser, setSelectedUser] = useState<Employee | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const {id: userId} = useParams<{ id: string }>();
    const router = useRouter();

    useEffect(() => {
        if (!userId) return;

        const controller = new AbortController();

        const fetchEmployee = async () => {
            setIsLoading(true);

            try {
                const res = await fetch(`/api/employees/${userId}`, {
                    signal: controller.signal,
                });

                if (!res.ok) {
                    console.error("Failed to fetch employee");
                    return;
                }

                const data: Employee = await res.json();
                setSelectedUser(data);
            } catch (error) {
                if ((error as Error).name !== "AbortError") {
                    console.error("Request error:", error);
                }
            } finally {
                setIsLoading(false);
            }
        };

        void fetchEmployee();
        return () => controller.abort();

    }, [userId]);

    const deleteEmployee = async () => {
        const res = await fetch(`/api/employees/${userId}`, {
            method: "DELETE",
        });

        if (!res.ok) {
            return;
        }

        router.push("/admin/company-employees");
    }

    const handleServiceDelete = async (serviceId: number) => {
        // 1. call API
        await fetch(`/api/employees/${selectedUser?.id}/services/${serviceId}`, {
            method: "DELETE",
        });

        // 2. update parent state
        setSelectedUser((prev) =>
            prev
                ? {
                    ...prev,
                    services: prev.services.filter(s => s.id !== serviceId),
                }
                : prev
        );
    };

    const handleServiceAdd = (newService: Service) => {
        if (!selectedUser) return;
        setSelectedUser({
            ...selectedUser,
            services: [...selectedUser.services, newService],
        });
    };

    const handleServiceEdit = (updatedService: Service) => {
        if (!selectedUser) return;

        setSelectedUser({
            ...selectedUser,
            services: selectedUser.services.map(service =>
                service.id === updatedService.id ? updatedService : service
            ),
        });
    };

    return (
        <div className="mx-auto max-w-5xl pb-10">

            {/* Profile header */}
            <div className=" flex flex-col items-start gap-4 px-6 md:flex-row md:items-end md:justify-between">
                <div className="flex justify-center items-center gap-4">
                    <Avatar className="h-32 w-32 border-4 border-background">
                        <AvatarImage src="/avatar.png"/>
                        <AvatarFallback>EM</AvatarFallback>
                    </Avatar>

                    <div>
                        <h1 className="text-2xl font-semibold">{selectedUser?.name}</h1>
                        <p className="text-sm text-muted-foreground">
                            Employee at <span className="font-medium">Your Company</span>
                        </p>

                    </div>
                </div>

                <div className="flex gap-2">
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive" className="cursor-pointer">
                                Delete Employee
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete profile
                                    and remove data from our servers.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel className="cursor-pointer">Cancel</AlertDialogCancel>
                                <AlertDialogAction asChild
                                                   className="bg-red-600 text-white hover:bg-red-700 cursor-pointer">
                                    <Button variant="destructive"
                                            className="cursor-pointer"
                                            onClick={deleteEmployee}
                                    >
                                        Delete Employee
                                    </Button>
                                </AlertDialogAction>

                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </div>

            {/* Content */}
            <div className="mt-8 grid gap-6 px-6 md:grid-cols-3">
                {/* Left column */}
                <div className="space-y-6 md:col-span-1">
                    <Card>
                        <CardContent className="space-y-4 pt-6">
                            <InfoRow label="Phone" userId={userId}
                                     value={selectedUser?.phone}
                                     onUpdate={(field, value) => {
                                         if (selectedUser) {
                                             setSelectedUser({ ...selectedUser, [field]: value });
                                         }
                                     }}
                            />

                            <InfoRow label="Instagram" userId={userId}
                                     value={selectedUser?.instagram}
                                     onUpdate={(field, value) => {
                                         if (selectedUser) {
                                             setSelectedUser({ ...selectedUser, [field]: value });
                                         }
                                     }}
                            />

                            <InfoRow label="Telegram" userId={userId}
                                     value={selectedUser?.telegram}
                                     onUpdate={(field, value) => {
                                         if (selectedUser) {
                                             setSelectedUser({ ...selectedUser, [field]: value });
                                         }
                                     }}
                            />

                            <InfoRow label="WhatsApp" userId={userId}
                                     value={selectedUser?.whatsapp }
                                     onUpdate={(field, value) => {
                                         if (selectedUser) {
                                             setSelectedUser({ ...selectedUser, [field]: value });
                                         }
                                     }}
                            />
                            <InfoRow label="Viber" userId={userId}
                                     value={selectedUser?.viber }
                                     onUpdate={(field, value) => {
                                         if (selectedUser) {
                                             setSelectedUser({ ...selectedUser, [field]: value });
                                         }
                                     }}
                            />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6">
                            <h2 className="mb-4 text-lg font-semibold">Schedule</h2>
                            <p className="text-sm text-muted-foreground">
                                Schedule configuration will appear here.
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Right column */}
                <div className="space-y-6 md:col-span-2">
                    {selectedUser && <EmployeeServices employee={selectedUser}
                                                       onServiceDelete={handleServiceDelete}
                                                       onServiceAdd={handleServiceAdd}
                                                       onServiceEdit={handleServiceEdit}
                    />}
                </div>
            </div>
        </div>
    );
}