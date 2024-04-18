import { paginationHelper } from './../../../helpers/paginationHelper';
import { Admin, Doctor, Prisma, UserStatus } from "@prisma/client"
import { TPaginationOptions } from '../../interfaces/pagination';
import { TDoctorFilterRequest } from './doctor.interface';
import { doctorSearchAbleFields } from './doctor.constant';
import prisma from '../../../shared/prisma';

const getAllDoctor = async (filters: TDoctorFilterRequest, options: TPaginationOptions) => {
    const { page, limit, skip } = paginationHelper.calculatePagination(options);
    const { searchTerm, specialties, ...filterData } = filters;

    const andConditions: Prisma.DoctorWhereInput[] = []

    if (filters.searchTerm) {
        andConditions.push(
            {
                OR: doctorSearchAbleFields.map(field => ({
                    [field]: {
                        contains: params.searchTerm,
                        mode: 'insensitive'
                    }
                }))
            }
        )
    };

    if (specialties && specialties.length > 0) {
        andConditions.push({
            doctorSpecialties: {
                some: {
                    specialities: {
                        title: {
                            contains: specialties,
                            mode: 'insensitive'
                        }
                    }
                }
            }
        })
    }

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

    const whereConditions: Prisma.DoctorWhereInput = { AND: andConditions }

    const result = await prisma.doctor.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder ? {
            [options.sortBy]: options.sortOrder
        } : {
            createdAt: 'desc'
        },
        include: {
            doctorSpecialties: {
                include: {
                    specialities: true
                }
            }
        }
    });

    const total = await prisma.doctor.count({
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

const getByIdFromDB = async (id: string): Promise<Admin | null> => {
    const result = await prisma.doctor.findUniqueOrThrow({
        where: {
            id,
            isDeleted: false
        }
    });
    return result;
};

const updateIntoDB = async (id: string, payload: any) => {
    const { specialties, ...doctorData } = payload;

    // console.log({ specialties, doctorData });

    const doctorInfo = await prisma.doctor.findUniqueOrThrow({
        where: {
            id,
            isDeleted: false
        }
    });

    await prisma.$transaction(async (transactionClient) => {
        await transactionClient.doctor.update({
            where: {
                id
            },
            data: doctorData,
        });

        if (specialties && specialties.length > 0) {
            //delete specialties
            const deletedSpecialtiesIds = specialties.filter(specialty => specialty.isDeleted)
            for (const specialty of deletedSpecialtiesIds) {
                await transactionClient.doctorSpecialties.deleteMany({
                    where: {
                        doctorId: doctorInfo.id,
                        specialitiesId: specialty.specialtiesId
                    }
                })
            }

            // create specialties
            const createSpecialtiesIds = specialties.filter(specialty => !specialty.isDeleted)
            console.log(createSpecialtiesIds);

            for (const specialty of createSpecialtiesIds) {
                await transactionClient.doctorSpecialties.create({
                    data: {
                        doctorId: doctorInfo.id,
                        specialitiesId: specialty.specialtiesId
                    }
                })
            }
        }


    })

    const result = await prisma.doctor.findUnique({
        where: {
            id: doctorInfo.id
        },
        include: {
            doctorSpecialties: {
                include: {
                    specialities: true
                }
            }
        }
    })
    return result;
};

const deleteFromDB = async (id: string): Promise<Admin | null> => {
    await prisma.doctor.findUniqueOrThrow({
        where: {
            id
        }
    });

    const result = await prisma.$transaction(async (transactionClient) => {
        const doctorDeletedData = await transactionClient.doctor.delete({
            where: {
                id
            }
        });

        transactionClient.user.delete({
            where: {
                email: doctorDeletedData.email
            }
        });

        return doctorDeletedData;
    });

    return result;
};

const softDeleteFromDB = async (id: string): Promise<Doctor | null> => {
    const result = await prisma.$transaction(async (transactionClient) => {
        const doctorDeletedData = await transactionClient.doctor.update({
            where: {
                id,
                isDeleted: false
            },
            data: {
                isDeleted: true
            }
        });

        await transactionClient.user.update({
            where: {
                email: doctorDeletedData.email
            },
            data: {
                status: UserStatus.DELETED
            }
        });

        return doctorDeletedData;
    });

    return result;
};

export const DoctorService = {
    getAllDoctor,
    getByIdFromDB,
    updateIntoDB,
    deleteFromDB,
    softDeleteFromDB
};


