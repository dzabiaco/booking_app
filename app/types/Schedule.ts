
export default interface ScheduleType {
    id: number;
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    userId: number;
    createdAt?: string;
    updatedAt?: string;
}