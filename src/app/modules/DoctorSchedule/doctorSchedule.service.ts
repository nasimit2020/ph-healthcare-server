import { Prisma } from "@prisma/client";
import { paginationHelper } from "../../../helpers/paginationHelper";
import prisma from "../../../shared/prisma"
import { TAuthUser } from "../../interfaces/common";
import { TPaginationOptions } from "../../interfaces/pagination";
import { scheduler } from "timers/promises";
import ApiError from "../../errors/ApiError";
import httpStatus from "http-status";


const getAllFromDB = async () => {
    const result = await prisma.doctorSchedule.findMany();
    return result;
}


const insertIntoDB = async (user: any, payload: { scheduleIds: string[] }) => {
    const doctorData = await prisma.doctor.findUniqueOrThrow({
        where: {
            email: user.email
        }
    });

    const doctorScheduleData = payload.scheduleIds.map(scheduleId => (
        {
            doctorId: doctorData.id,
            scheduleId
        }
    ));

    const result = await prisma.doctorSchedule.createMany({
        data: doctorScheduleData
    });

    return result;
};



const getMySchedule = async (
    filters: any,
    options: TPaginationOptions,
    user: TAuthUser
) => {
    const { page, limit, skip } = paginationHelper.calculatePagination(options);
    const { startDate, endDate, ...filterData } = filters;

    const andConditions = []

    if (startDate && endDate) {
        andConditions.push({
            AND: [
                {
                    schedule: {
                        startDateTime: {
                            gte: startDate
                        }
                    }
                },
                {
                    schedule: {
                        endDateTime: {
                            lte: endDate
                        }
                    }
                }
            ]
        })
    }


    if (Object.keys(filterData).length > 0) {
        if (typeof filterData.isBooked === 'string' && filterData.isBooked === 'true') {
            filterData.isBooked = true
        }
        else if (typeof filterData.isBooked === 'string' && filterData.isBooked === 'false') {
            filterData.isBooked = false
        }
        andConditions.push({
            AND: Object.keys(filterData).map(key => ({
                [key]: {
                    equals: (filterData as any)[key]
                }
            }))
        })
    };

    const whereConditions: Prisma.DoctorScheduleWhereInput = andConditions.length > 0 ? { AND: andConditions } : {}

    const result = await prisma.doctorSchedule.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder ? {
            [options.sortBy]: options.sortOrder
        } : {},
    });

    const total = await prisma.doctorSchedule.count({
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


const deleteFromDB = async (user: TAuthUser, scheduleId: string) => {
    const doctorData = await prisma.doctor.findUniqueOrThrow({
        where: {
            email: user?.email
        }
    });

    const isBookedSchedule = await prisma.doctorSchedule.findUnique({
        where: {
            doctorId_scheduleId: {
                doctorId: doctorData.id,
                scheduleId: scheduleId
            },
            isBooked: true
        }
    });

    if (isBookedSchedule) {
        throw new ApiError(httpStatus.BAD_REQUEST, "You can not delete the schedule because of the schedule is already is booked");

    }

    const result = await prisma.doctorSchedule.delete({
        where: {
            doctorId_scheduleId: {
                doctorId: doctorData.id,
                scheduleId: scheduleId
            }
        }
    });

    return result;

}

export const DoctorScheduleService = {
    getAllFromDB,
    insertIntoDB,
    getMySchedule,
    deleteFromDB
}