import { BloodGroup, Gender, MaritalStatus } from "@prisma/client";

export type TPatientFilterRequest = {
    name?: string | undefined;
    email?: string | undefined;
    contactNumber?: string | undefined;
    searchTerm?: string | undefined;
    specialties?: string | undefined
}

type TPatientHealthData = {
    gender: Gender,
    dateOfBirth: string,
    bloodGroup: BloodGroup,
    hasAllergies?: boolean,
    hasDiabetes?: boolean,
    height: string,
    weight: string,
    smokingStatus?: boolean,
    dietaryPerferences?: string,
    pregnancyStatus?: boolean,
    mentalHealthHistory?: string,
    immuizationStatus?: string,
    hasPastSurgeries?: boolean,
    recentAnxiety?: boolean,
    recentDepression?: boolean,
    maritalStatus?: MaritalStatus
}

type TMedicalReport = {
    reportName: string
    reportLink: string
}

export type TPatientUpdate = {
    name: string,
    contactNumber: string,
    address: string,
    patientHealthData: TPatientHealthData
    medicalReport: TMedicalReport
}
