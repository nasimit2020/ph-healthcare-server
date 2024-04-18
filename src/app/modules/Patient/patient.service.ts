import { patientSearchAbleFields } from './patient.constant';
import { Patient, Prisma } from "@prisma/client";
import { paginationHelper } from "../../../helpers/paginationHelper";
import { TPaginationOptions } from "../../interfaces/pagination";
import { TPatientFilterRequest } from "./patient.interface";
import prisma from '../../../shared/prisma';

const getAllFromDB = async (filters: TPatientFilterRequest, options: TPaginationOptions) => {
    const { page, limit, skip } = paginationHelper.calculatePagination(options);
    const { searchTerm, specialties, ...filterData } = filters;

    const andConditions: Prisma.PatientWhereInput[] = []

    if (searchTerm) {
        andConditions.push(
            {
                OR: patientSearchAbleFields.map(field => ({
                    [field]: {
                        contains: filters.searchTerm,
                        mode: 'insensitive'
                    }
                }))
            }
        )
    };


    if (Object.keys(filterData).length > 0) {
        andConditions.push({
            AND: Object.keys(filterData).map(key => ({
                [key]: {
                    equals: (filterData as any)[key]
                }
            }))
        })
    };

    andConditions.push({
        isDeleted: false
    });

    const whereConditions: Prisma.PatientWhereInput = { AND: andConditions }

    const result = await prisma.patient.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder ? {
            [options.sortBy]: options.sortOrder
        } : {
            createdAt: 'desc'
        },
        include: {
            medicalReport: true,
            patientHealthData: true
        }
    });

    const total = await prisma.patient.count({
        where: whereConditions
    })
    return {
        meta: {
            page,
            limit,
            total
        },
        data: result
    };
};

const getByIdFromDB = async (id: string): Promise<Patient | null> => {
    const result = await prisma.patient.findUniqueOrThrow({
        where: {
            id,
            isDeleted: false
        },
        include: {
            medicalReport: true,
            patientHealthData: true
        }
    });
    return result;
};

const updateIntoDB = async (id: string, payload: any) => {
    console.log({ id, payload });

    const { patientHealthData, medicalReport, ...patientData } = payload;

    console.log(patientHealthData, medicalReport);

    const patientInfo = await prisma.patient.findUniqueOrThrow({
        where: {
            id
        }
    });

    const result = await prisma.$transaction(async (transactionClient) => {

        //update patient data
        const updatedPatient = await transactionClient.patient.update({
            where: {
                id
            },
            data: payload,
            include: {
                patientHealthData: true,
                medicalReport: true
            }
        })
    })




    // return result;

}


export const PatientService = {
    getAllFromDB,
    getByIdFromDB,
    updateIntoDB,

}