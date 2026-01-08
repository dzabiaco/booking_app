import Service from "@/app/types/Service";
import Schedule from "@/app/types/Schedule";

export interface Employee {
    id: number;
    name: string;
    instagram?: string;
    whatsapp?: string;
    telegram?: string;
    viber?: string;
    phone?: string;
    photo?: string; // optional avatar image
    services: Service[];
    schedules: Schedule[];
}