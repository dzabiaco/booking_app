"use client";
import {useSession} from "next-auth/react";
import {redirect} from "next/navigation";

export default function AdminPage() {
    const { data: session, status } = useSession();

    console.log("session", session);

    if (status === "loading") return <p>Loading...</p>;

    return (
        <h1>Admin Page</h1>
    );
}