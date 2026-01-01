"use client";
import {Card} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {useSession} from "next-auth/react";
import {useRouter} from "next/navigation";
import {useEffect, useState} from "react";
import {Button} from "@/components/ui/button";

export default function CreateCompany() {

    const {data: session, status} = useSession();

    const userId = session?.user?.id;

    const router = useRouter();

    const [formData, setFormData] = useState<{
        companyName: string;
        companyLocation: string;
        companyPhone: string;
        companyInstagram: string;
        startTime: string;
        endTime: string;
        companyLogo: File | null;
    }>({
        companyName: "",
        companyLocation: "",
        companyPhone: "",
        companyInstagram: "",
        startTime: "",
        endTime: "",
        companyLogo: null,
    });

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login"); // or wherever
        }
    }, [status, router, session]);

    if (status === "loading") {
        return <p>Loading...</p>;
    }

    if (!session) {
        return null; // prevents flash before redirect
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value, files, type } = e.target;
        setFormData((prev) => ({
            ...prev,
            [id]: type === "file" ? files?.[0] ?? null : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log({...formData,userId});

        try {
            const res = await fetch("/api/company", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    ...formData,
                    userId,
                }),
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.message || "Failed to create company");
            }

            const data = await res.json();
            console.log("Company created:", data);
        } catch (error) {
            console.error("Submit error:", error);
        }
    };


    return (
        <div className="w-full flex justify-center px-4">
            <Card className="w-full max-w-md mt-6 rounded-2xl border border-slate-200 shadow-sm">
                <form onSubmit={handleSubmit}>
                    <div className="p-6 space-y-6">
                        {/* Company Name */}
                        <div className="space-y-2">
                            <label
                                htmlFor="companyName"
                                className="text-sm font-medium text-slate-700"
                            >
                                Company name
                            </label>

                            <Input
                                id="companyName"
                                type="text"
                                placeholder="Enter your company name"
                                value={formData.companyName}
                                onChange={handleChange}
                                className="h-11 rounded-lg border-slate-300
                 focus:border-blue-400 focus:ring-blue-400"
                            />

                            <p className="text-xs text-slate-500">
                                This name will be shown to customers
                            </p>
                        </div>

                        {/* Company Location */}
                        <div className="space-y-2">
                            <label
                                htmlFor="companyLocation"
                                className="text-sm font-medium text-slate-700"
                            >
                                Company location
                            </label>

                            <Input
                                id="companyLocation"
                                type="text"
                                placeholder="City, street or area"
                                value={formData.companyLocation}
                                onChange={handleChange}
                                className="h-11 rounded-lg border-slate-300
                 focus:border-blue-400 focus:ring-blue-400"
                            />

                            <p className="text-xs text-slate-500">
                                Helps customers find you easily
                            </p>
                        </div>

                        <div className="space-y-2">
                            <label
                                htmlFor="companyPhone"
                                className="text-sm font-medium text-slate-700"
                            >
                                Company Phone
                            </label>

                            <Input
                                id="companyPhone"
                                type="tel"
                                placeholder="+1 (555) 123-4567"
                                value={formData.companyPhone}
                                onChange={handleChange}
                                className="h-11 w-full rounded-lg border border-slate-300
               px-3 focus:border-blue-400 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                            />

                            <p className="text-xs text-slate-500">
                                Customers will use this number to contact you
                            </p>
                        </div>

                        <div className="space-y-2">
                            <label
                                htmlFor="companyInstagram"
                                className="text-sm font-medium text-slate-700"
                            >
                                Instagram
                            </label>

                            <Input
                                id="companyInstagram"
                                type="text"
                                placeholder="@yourcompany"
                                value={formData.companyInstagram}
                                onChange={handleChange}
                                className="h-11 w-full rounded-lg border border-slate-300
               px-3 focus:border-blue-400 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                            />

                            <p className="text-xs text-slate-500">
                                Share your Instagram handle for customers to follow you
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Start Time */}
                            <div className="space-y-2">
                                <label
                                    htmlFor="startTime"
                                    className="text-sm font-medium text-slate-700"
                                >
                                    Start Time
                                </label>

                                <Input
                                    id="startTime"
                                    type="time"
                                    value={formData.startTime}
                                    onChange={handleChange}
                                    className="h-11 w-full rounded-lg border border-slate-300
                 px-3 focus:border-blue-400 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                />
                            </div>

                            {/* End Time */}
                            <div className="space-y-2">
                                <label
                                    htmlFor="endTime"
                                    className="text-sm font-medium text-slate-700"
                                >
                                    End Time
                                </label>

                                <Input
                                    id="endTime"
                                    type="time"
                                    value={formData.endTime}
                                    onChange={handleChange}
                                    className="h-11 w-full rounded-lg border border-slate-300
                 px-3 focus:border-blue-400 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label
                                htmlFor="companyInstagram"
                                className="text-sm font-medium text-slate-700"
                            >
                                Company Logo
                            </label>

                            <Input id="picture" type="file" onChange={handleChange}/>

                            <p className="text-xs text-slate-500">
                                Upload your company logo (PNG, JPG, or SVG). This will appear on your booking page
                            </p>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-center">
                                <Button className="cursor-pointer" onClick={handleSubmit}>
                                    Create Company
                                </Button>
                            </div>
                        </div>
                    </div>
                </form>
            </Card>
        </div>
    );
}