import Service from "@/app/types/Service";
import {Employee} from "@/app/types/Employee";
import {useModal} from "@/context/ModalContext";
import {useEffect, useState} from "react";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {Clock, ClockPlus} from "lucide-react";
import {Button} from "@/components/ui/button";

interface EditServiceProps {
    employee: Employee
    onEditServiceClick: (service: Service) => void;
    serviceId: number;
}

export default function EditService({employee, serviceId, onEditServiceClick}:EditServiceProps) {
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

    useEffect(() => {
        const fetchService = async () => {
            try {
                const res = await fetch(`/api/employees/${employee.id}/services/${serviceId}`);
                if (!res.ok) throw new Error("Failed to fetch service");
                const data = await res.json();

                setFormData({
                    name: data.name || "",
                    description: data.description || "",
                    duration: String(data.duration || ""),
                    timeOffset: String(data.timeOffset || ""),
                    price: data.price || 0,
                });
            } catch (err) {
                console.error(err);
            }
        };

        void fetchService();
    }, [employee.id, serviceId]);

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
            const res = await fetch(`/api/employees/${employee.id}/services/${serviceId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: formData.name,
                    description: formData.description,
                    duration: Number(formData.duration),   // convert to number
                    timeOffset: Number(formData.timeOffset), // convert to number
                    price: Number(formData.price),
                }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || "Failed to update service");
            }

            const updatedService = await res.json();

            // Call parent callback to update state
            onEditServiceClick(updatedService);

            // Close the modal
            close();
        } catch (err: any) {
            console.error("Error updating service:", err);
            // Optionally, show an error toast or message here
        }
    }

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
                        <Button type="submit" className="cursor-pointer">Update Service</Button>
                    </div>
                </div>
            </div>
        </form>
    );
}