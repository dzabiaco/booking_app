
export default interface Service {
    "id": number,
    "name": string,
    "description": string,
    "duration": number,
    "timeOffset": number,
    "price": number,
    "employeeId"?: number,
    "createdAt"?: string,
    "updatedAt"?: string
}