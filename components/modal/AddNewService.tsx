import {useModal} from "@/context/ModalContext";
import {Input} from "@/components/ui/input";
// import {useSession} from "next-auth/react";
import {useState} from "react";
import {Textarea} from "@/components/ui/textarea";
import {Clock, ClockPlus} from 'lucide-react';
import {Button} from "@/components/ui/button";
import Service from "@/app/types/Service";

interface AddNewServiceProps {
    employeeId: number;
    onServiceAdd: (newService: Service) => void;
}

export default function AddNewService({ employeeId, onServiceAdd }: AddNewServiceProps) {
    const { close } = useModal();
    // const { data: session } = useSession();

    // const userId = session?.user?.id;

    const [formData, setFormData] = useState<{
        name: string;
        description: string;
        duration: string;
        timeOffset: string;
        price: number;
    }>({
        name: "",
        description: "",
        duration: "",
        timeOffset: "",
        price: 0,
    });

    // Unified handler for inputs
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [id]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch(`/api/employees/${employeeId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: formData.name,
                    description: formData.description,
                    duration: Number(formData.duration),
                    timeOffset: Number(formData.timeOffset),
                    price: +formData.price,
                    employeeId
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Error:", errorData);
                return;
            }

            const data = await response.json();
            onServiceAdd(data);
            console.log("Success:", data);

            // Reset form
            setFormData({
                name: "",
                description: "",
                duration: "",
                timeOffset: "",
                price: 0,
            });
            close();
        } catch (error) {
            console.error("Network error:", error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="p-6 space-y-6">
                {/* Service Name */}
                <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium text-slate-700">
                        Service name
                    </label>
                    <Input
                        id="name"
                        type="text"
                        placeholder="Enter service name"
                        value={formData.name}
                        onChange={handleChange}
                        className="h-11 rounded-lg border-slate-300 focus:border-blue-400 focus:ring-blue-400"
                    />
                    <p className="text-xs text-slate-500">
                        This name will be shown to customers
                    </p>
                </div>

                {/* Service Description */}
                <div className="space-y-2">
                    <label htmlFor="description" className="text-sm font-medium text-slate-700">
                        Service description
                    </label>
                    <Textarea
                        id="description"
                        placeholder="Type your service description..."
                        value={formData.description}
                        onChange={handleChange}
                    />
                    <p className="text-xs text-slate-500">
                        This description will be shown to customers
                    </p>
                </div>

                {/* Service Duration */}
                <div className="space-y-2">
                    <label htmlFor="duration" className="text-sm font-medium text-slate-700">
                        Service duration
                    </label>
                    <div className="relative">
                        <Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            id="duration"
                            type="text"
                            placeholder="Service duration in minutes"
                            value={formData.duration}
                            onChange={handleChange}
                            className="pl-10"
                        />
                    </div>
                    <p className="text-xs text-slate-500">
                        This duration will be shown to customers
                    </p>
                </div>

                {/* Service Offset */}
                <div className="space-y-2">
                    <label htmlFor="timeOffset" className="text-sm font-medium text-slate-700">
                        Service offset
                    </label>
                    <div className="relative">
                        <ClockPlus className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            id="timeOffset"
                            type="text"
                            placeholder="Service offset in minutes"
                            value={formData.timeOffset}
                            onChange={handleChange}
                            className="pl-10"
                        />
                    </div>
                    <p className="text-xs text-slate-500">
                        This offset will not be shown to customers
                    </p>
                </div>

                {/* Service Price */}
                <div className="space-y-2">
                    <label htmlFor="price" className="text-sm font-medium text-slate-700">Service price</label>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">MDL</span>
                        <Input
                            id="price"
                            type="number"
                            placeholder="Enter price"
                            value={formData.price}
                            onChange={handleChange}
                            className="pl-16" // increased padding-left for space after "MDL"
                        />
                    </div>
                    <p className="text-xs text-slate-500">This price will be shown to customers</p>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                    <div className="flex justify-between">
                        <Button variant="outline" onClick={close}>
                            Cancel
                        </Button>
                        <Button type="submit" className="cursor-pointer">Save Service</Button>
                    </div>
                </div>
            </div>
        </form>
    );
}