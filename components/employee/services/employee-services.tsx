import {Card, CardContent} from "@/components/ui/card";
import ServiceCard from "@/components/employee/services/service-card";
import {Employee} from "@/app/types/Employee";
import {Button} from "@/components/ui/button";
import {useModal} from "@/context/ModalContext";
import AddNewService from "@/components/modal/AddNewService";
import Service from "@/app/types/Service";

interface EmployeeServicesProps {
    employee: Employee
    onServiceDelete: (id: number) => void;
    onServiceAdd: (service: Service) => void;
    onServiceEdit: (service: Service) => void;
}

export default function EmployeeServices({ employee, onServiceDelete, onServiceAdd, onServiceEdit }: EmployeeServicesProps) {
    const employeeId = employee.id;
    const { open } = useModal();

    if(!employee.services) {
        return <h1>No Services provided</h1>
    }

    return (
        <Card>
            <CardContent className="pt-6">
                <div className="flex justify-between">
                    <h2 className="mb-4 text-lg font-semibold">Services</h2>
                    <Button className="cursor-pointer" onClick={() =>
                        open(
                            <AddNewService employeeId={employeeId} onServiceAdd={onServiceAdd}/>
                        )}>Assign services</Button>
                </div>

                {(!employee.services || employee.services.length === 0) ? (
                    <h1 className="text-center text-lg font-bold">No services available</h1>
                ) : (
                    <div className="grid gap-3 sm:grid-cols-2">
                        {employee.services.map(service => (
                            <ServiceCard
                                key={service.id}
                                name={service.name}
                                id={service.id}
                                duration={service.duration}
                                price={service.price}
                                onEdit={onServiceEdit}
                                onDelete={onServiceDelete}
                                employee={employee}
                            />
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}