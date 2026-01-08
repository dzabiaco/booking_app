import {useState, useEffect} from 'react';
import  { Employee } from "@/app/types/Employee";
import  ScheduleType  from "@/app/types/Schedule";

interface ScheduleProps {
    employee: Employee;
    onScheduleEdit: (updatedSchedule: ScheduleType) => void;
}

export default function Schedule({employee, onScheduleEdit}: ScheduleProps) {
    const DAYS: Record<number, string> = {
        0: 'Sunday',
        1: 'Monday',
        2: 'Tuesday',
        3: 'Wednesday',
        4: 'Thursday',
        5: 'Friday',
        6: 'Saturday',
    } as const;

    useEffect(() => {
        const fetchSchedules = async () => {
            try {
                const res = await fetch(`/api/employees/${employee.id}/schedule`);

                if (!res.ok) {
                    throw new Error("Failed to fetch schedules");
                }

                const data: ScheduleType[] = await res.json();
            } catch (error) {
                console.error("Error fetching schedules:", error);
            }
        };

        fetchSchedules();
    }, []);
    const schedules = employee.schedules;

    const [editingId, setEditingId] = useState<number | null>(null);
    const [editedSchedule, setEditedSchedule] = useState<ScheduleType | null>(null);

    const handleEditClick = (item: ScheduleType) => {
        setEditingId(item.id);
        setEditedSchedule({ ...item }); // clone to avoid mutating original
    };

    const handleTimeChange = (
        field: "startTime" | "endTime",
        value: string
    ) => {
        setEditedSchedule((prev) =>
            prev ? { ...prev, [field]: value } : prev
        );
    };

    const handleSave = async (id: number) => {
        if (!editedSchedule) return;

        try {
            const res = await fetch(`/api/employees/${employee.id}/schedule`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId: employee.id,
                    scheduleId: id,
                    dayOfWeek: editedSchedule.dayOfWeek,
                    startTime: editedSchedule.startTime,
                    endTime: editedSchedule.endTime,
                }),
            });

            if (!res.ok) {
                throw new Error("Failed to update schedule");
            }

            const updated = await res.json();

            // Update the local state immediately
            onScheduleEdit(updated.schedule);

            // Close editing
            setEditingId(null);
            setEditedSchedule(null);
        } catch (error) {
            console.error("Error updating schedule:", error);
        }
    };

    return (
        <>
            <h2 className="mb-4 text-lg font-semibold">Schedule</h2>
            <div className="max-w-md space-y-3">
                {schedules.length > 0 ? (
                    schedules
                        .sort((a, b) => Number(a.dayOfWeek) - Number(b.dayOfWeek))
                        .map((item) => (
                            <div
                                key={item.id}
                                className={`flex flex-col rounded-xl border px-4 py-3 cursor-pointer transition-shadow hover:shadow-md ${
                                    editingId === item.id ? 'bg-blue-50 border-blue-300' : ''
                                }`}
                                onClick={() => handleEditClick(item)}
                            >
                                {/* Day name */}
                                <span className="font-medium">{DAYS[item.dayOfWeek]}</span>

                                {/* Editable row */}
                                {editingId === item.id ? (
                                    <div className="flex flex-col mt-2 gap-2">
                                        {/* Time inputs */}
                                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                                            {editedSchedule && ( <input
                                                type="text"
                                                value={editedSchedule.startTime}
                                                onChange={(e) =>
                                                    setEditedSchedule(prev =>
                                                        prev ? { ...prev, startTime: e.target.value } : prev
                                                    )
                                                }
                                                className="border rounded px-2 py-1 text-sm w-20 sm:w-24 focus:ring-2 focus:ring-blue-400"
                                            /> )}
                                            <span className="mx-1 text-sm">–</span>
                                            {editedSchedule && (<input
                                                type="text"
                                                value={editedSchedule.endTime}
                                                onChange={(e) =>
                                                    setEditedSchedule(prev =>
                                                        prev ? { ...prev, endTime: e.target.value } : prev
                                                    )
                                                }
                                                className="border rounded px-2 py-1 text-sm w-20 sm:w-24 focus:ring-2 focus:ring-blue-400"
                                            />)}
                                        </div>

                                        {/* Buttons on a new line */}
                                        <div className="flex gap-2 mt-2 flex-wrap">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleSave(item.id);
                                                }}
                                                className="bg-blue-500 text-white text-sm px-3 py-1.5 rounded hover:bg-blue-600 transition w-[70px]"
                                            >
                                                Save
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setEditingId(null);
                                                }}
                                                className="bg-gray-200 text-gray-700 text-sm px-3 py-1.5 rounded hover:bg-gray-300 transition w-[70px]"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <span className="text-sm text-gray-600 mt-1">
                {item.startTime} – {item.endTime}
              </span>
                                )}
                            </div>
                        ))
                ) : (
                    <p className="text-sm text-gray-500">
                        Schedule configuration will appear here.
                    </p>
                )}
            </div>
        </>
    );
}