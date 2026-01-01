import { X, Pencil } from "lucide-react"
import Service from "@/app/types/Service";
import AddNewService from "@/components/modal/AddNewService";
import {useModal} from "@/context/ModalContext";
import EditService from "@/components/modal/EditService";
import {Employee} from "@/app/types/Employee";

type ServiceCardProps = {
    id: number
    name: string
    description?: string | null
    duration: number
    timeOffset?: number | null
    price: number
    onEdit: (service: Service) => void
    onDelete: (id: number) => void
    employee: Employee
}


export default function ServiceCard({
                                        id,
                                        name,
                                        description,
                                        duration,
                                        timeOffset,
                                        price,
                                        onEdit,
                                        onDelete,
                                        employee
                                    }: ServiceCardProps) {

    const { open } = useModal();

    return (
        <div className="group relative rounded-2xl border bg-card p-5 transition hover:shadow-md">
            {/* Hover actions */}
            <div className="absolute right-3 top-3 flex gap-1 opacity-0 transition group-hover:opacity-100">
                <button
                    onClick={() =>
                        open(
                            <EditService employee={employee} serviceId={id} onEditServiceClick={onEdit}/>
                        )}
                    className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
                    aria-label="Edit service"
                >
                    <Pencil className="h-4 w-4" />
                </button>

                <button
                    onClick={() => onDelete(id)}
                    className="rounded-lg p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                    aria-label="Delete service"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>

            {/* Content */}
            <div className="space-y-4">
                {/* Title */}
                <div>
                    <h3 className="text-base font-semibold leading-tight">{name}</h3>
                    {description && (
                        <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                            {description}
                        </p>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span className="rounded-md bg-muted px-2 py-1">
              {duration} min
            </span>

                        {timeOffset != null && (
                            <span>+{timeOffset} min prep</span>
                        )}
                    </div>

                    <div className="text-base font-semibold">
                        {price === 0 ? "Free" : `${price} MDL`}
                    </div>
                </div>
            </div>
        </div>
    );
}