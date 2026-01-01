import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {Button} from "@/components/ui/button";
import {useState} from "react";
import {Label} from "@radix-ui/react-menu";
import {useModal} from "@/context/ModalContext";
import {Employee} from "@/app/types/Employee";

interface Service {
    name: string;
    description: string;
    duration: number;
    timeOffset: number;
    price: number;
}

type AddNewEmployeeProps = {
    onCreated: (employee: Employee) => void;
};

export default function AddNewEmployee({ onCreated }: AddNewEmployeeProps) {
    const {close} = useModal();

    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [instagram, setInstagram] = useState("");
    const [whatsapp, setWhatsapp] = useState("");
    const [telegram, setTelegram] = useState("");
    const [viber, setViber] = useState("");
    const [photo, setPhoto] = useState<File | null>(null);
    const [services, setServices] = useState<Service[]>([
        {name: "", description: "", duration: 0, timeOffset: 0, price:0},
    ]);

    const handleServiceChange = <K extends keyof Service>(
        index: number,
        field: K,
        value: Service[K]
    ) => {
        const newServices = [...services];
        newServices[index][field] = value;
        setServices(newServices);
    };

    const addService = () => {
        setServices([...services, {name: "", description: "", duration: 0, timeOffset: 0, price:0}]);
    };

    const removeService = (index: number) => {
        const newServices = [...services];
        newServices.splice(index, 1);
        setServices(newServices);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const payload = {name, phone, instagram,whatsapp, telegram, viber, photo, services};
        console.log(payload);

        // Example POST request
        const res = await fetch("/api/employees", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(payload),
        });

        if (!res.ok) return;

        const createdEmployee: Employee = await res.json();
        onCreated(createdEmployee);
        close();
    };
    return (
        <>
            <form
                className="max-w-3xl mx-auto bg-white space-y-6"
                onSubmit={handleSubmit}
            >
                <h2 className="text-2xl font-bold text-gray-800">Add New Employee</h2>

                <div className="space-y-6">

                    {/* Avatar */}
                    <div className="flex items-center gap-4">
                        <div className="h-20 w-20 rounded-full bg-gray-100 flex items-center justify-center border">
                            <span className="text-gray-400 text-sm">Photo</span>
                        </div>

                        <div>
                            <Label className="text-sm text-gray-600 mb-1 block">
                                Profile photo
                            </Label>
                            <Input type="file" accept="image/*"
                                   onChange={(e) => setPhoto(e.target.files?.[0] ?? null)}
                                   className="max-w-xs"/>
                        </div>
                    </div>

                    {/* Name */}
                    <div>
                        <Label className="text-sm text-gray-600 mb-1 block">
                            Full name
                        </Label>
                        <Input
                            placeholder="John Doe"
                            className="h-11"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    {/* Phone */}
                    <div>
                        <Label className="text-sm text-gray-600 mb-1 block">
                            Phone number
                        </Label>
                        <Input
                            type="tel"
                            placeholder="+373 60 000 000"
                            className="h-11"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                    </div>

                    {/* Messengers */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label className="text-sm text-gray-600 mb-1 block">
                                WhatsApp
                            </Label>
                            <Input
                                placeholder="+373 60 000 000"
                                className="h-11"
                                value={whatsapp}
                                onChange={(e) => setWhatsapp(e.target.value)}
                            />
                        </div>

                        <div>
                            <Label className="text-sm text-gray-600 mb-1 block">
                                Telegram
                            </Label>
                            <Input
                                placeholder="@username"
                                className="h-11"
                                value={telegram}
                                onChange={(e) => setTelegram(e.target.value)}
                            />
                        </div>

                        <div>
                            <Label className="text-sm text-gray-600 mb-1 block">
                                Viber
                            </Label>
                            <Input
                                placeholder="+373 60 000 000"
                                className="h-11"
                                value={viber}
                                onChange={(e) => setViber(e.target.value)}
                            />
                        </div>

                        <div>
                            <Label className="text-sm text-gray-600 mb-1 block">
                                Instagram
                            </Label>
                            <Input
                                placeholder="@instagram"
                                className="h-11"
                                value={instagram}
                                onChange={(e) => setInstagram(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-800">
                                Services
                            </h3>

                            <Button
                                type="button"
                                size="sm"
                                onClick={addService}
                                className="flex items-center gap-2"
                            >
                                + Add service
                            </Button>
                        </div>

                        {services.map((service, index) => (
                            <div
                                key={index}
                                className="relative rounded-xl border border-gray-200 bg-white p-5 shadow-sm space-y-5"
                            >
                                {/* Header */}
                                <div className="flex items-center justify-between">
    <span className="text-sm font-medium text-gray-700">
      Service #{index + 1}
    </span>

                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="text-red-500 hover:text-red-600"
                                        onClick={() => removeService(index)}
                                    >
                                        Remove
                                    </Button>
                                </div>

                                {/* Name */}
                                <div>
                                    <Label className="text-sm text-gray-600 mb-1 block">
                                        Service name
                                    </Label>
                                    <Input
                                        value={service.name}
                                        onChange={(e) =>
                                            handleServiceChange(index, "name", e.target.value)
                                        }
                                        placeholder="Haircut"
                                    />
                                </div>

                                {/* Description */}
                                <div>
                                    <Label className="text-sm text-gray-600 mb-1 block">
                                        Description
                                    </Label>
                                    <Textarea
                                        rows={2}
                                        value={service.description}
                                        onChange={(e) =>
                                            handleServiceChange(index, "description", e.target.value)
                                        }
                                        placeholder="Short description of the service"
                                    />
                                </div>

                                {/* Duration / Offset / Price */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {/* Duration */}
                                    <div className="relative">
                                        <Label className="text-sm text-gray-600 mb-1 block">
                                            Duration
                                        </Label>
                                        <Input
                                            type="number"
                                            min={0}
                                            value={service.duration}
                                            onChange={(e) =>
                                                handleServiceChange(index, "duration", Number(e.target.value))
                                            }
                                            className="pr-12"
                                            placeholder="30"
                                        />
                                        <span className="absolute right-3 top-9 text-xs text-gray-400">
        min
      </span>
                                    </div>

                                    {/* Time offset */}
                                    <div className="relative">
                                        <Label className="text-sm text-gray-600 mb-1 block">
                                            Time offset
                                        </Label>
                                        <Input
                                            type="number"
                                            min={0}
                                            value={service.timeOffset}
                                            onChange={(e) =>
                                                handleServiceChange(index, "timeOffset", Number(e.target.value))
                                            }
                                            className="pr-12"
                                            placeholder="0"
                                        />
                                        <span className="absolute right-3 top-9 text-xs text-gray-400">
        min
      </span>
                                    </div>

                                    {/* Price */}
                                    <div className="relative">
                                        <Label className="text-sm text-gray-600 mb-1 block">
                                            Price
                                        </Label>
                                        <Input
                                            type="number"
                                            min={0}
                                            step="0.01"
                                            value={service.price}
                                            onChange={(e) =>
                                                handleServiceChange(index, "price", Number(e.target.value))
                                            }
                                            className="pr-12"
                                            placeholder="50"
                                        />
                                        <span className="absolute right-3 top-9 text-xs text-gray-400">
        MDL
      </span>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {services.length === 0 && (
                            <div className="text-sm text-gray-500 text-center py-6 border rounded-lg">
                                No services added yet
                            </div>
                        )}
                    </div>

                </div>

                <Button type="submit" className="w-full md:w-auto mt-6">
                    Submit
                </Button>
            </form>

        </>
    );
}