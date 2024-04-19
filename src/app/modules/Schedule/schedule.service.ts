import { addHours, addMinutes, format } from 'date-fns';
import prisma from '../../../shared/prisma';
import { Prisma, Schedule } from '@prisma/client';
import { IScheduleFilterRequest, TSchedule } from './schedule.interface';
import { TPaginationOptions } from '../../interfaces/pagination';
import { paginationHelper } from '../../../helpers/paginationHelper';
import { TAuthUser } from '../../interfaces/common';

const insertIntoDB = async (payload: TSchedule): Promise<Schedule[]> => {
    const { startDate, endDate, startTime, endTime } = payload;

    const intervalTime = 30;

    const schedule = [];

    const currentDate = new Date(startDate)
    const lastDate = new Date(endDate)

    while (currentDate <= lastDate) {
        const startDateTime = new Date(
            addMinutes(
                addHours(
                    `${format(currentDate, 'yyyy-MM-dd')}`,
                    Number(startTime.split(':')[0])
                ),
                Number(startTime.split(':')[1])
            )
        );

        const endDateTime = new Date(
            addMinutes(
                addHours(
                    `${format(currentDate, 'yyyy-MM-dd')}`,
                    Number(endTime.split(':')[0])
                ),
                Number(endTime.split(':')[1])
            )
        );

        while (startDateTime < endDateTime) {
            const scheduleData = {
                startDateTime: startDateTime,
                endDateTime: addMinutes(startDateTime, intervalTime)
            }

            const existingSchedule = await prisma.schedule.findFirst({
                where: {
                    startDateTime: scheduleData.startDateTime,
                    endDateTime: scheduleData.endDateTime
                }
            })

            if (!existingSchedule) {
                const result = await prisma.schedule.create({
                    data: scheduleData
                })
                schedule.push(result)
            }


            startDateTime.setMinutes(startDateTime.getMinutes() + intervalTime);
        };

        currentDate.setDate(currentDate.getDate() + 1);
    };

    return schedule;

};

const getAllFromDB = async (filters: IScheduleFilterRequest, options: TPaginationOptions, user: TAuthUser) => {
    const { page, limit, skip } = paginationHelper.calculatePagination(options);
    const { startDate, endDate, ...filterData } = filters;

    const andConditions = []

    if (startDate && endDate) {
        andConditions.push({
            AND: [
                {
                    startDateTime: {
                        gte: startDate
                    }
                },
                {
                    endDateTime: {
                        lte: endDate
                    }
                }
            ]
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

    const whereConditions: Prisma.ScheduleWhereInput = andConditions.length > 0 ? { AND: andConditions } : {}

    const doctorSchedules = await prisma.doctorSchedule.findMany({
        where: {
            doctor: {
                email: user?.email
            }
        }
    });

    const doctorScheduleId = doctorSchedules.map(schedule => schedule.scheduleId)

    const result = await prisma.schedule.findMany({
        where: {
            ...whereConditions,
            id: {
                notIn: doctorScheduleId
            }
        },
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder ? {
            [options.sortBy]: options.sortOrder
        } : {
            createdAt: 'desc'
        },
    });

    const total = await prisma.schedule.count({
        where: {
            ...whereConditions,
            id: {
                notIn: doctorScheduleId
            }
        }
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



const getByIdFromDB = async (id: string) => {
    const result = await prisma.schedule.findUniqueOrThrow({
        where: {
            id,
        }
    });
    return result;
};

const deleteFromDB = async (id: string) => {
    const result = await prisma.schedule.delete({
        where: {
            id,
        }
    });
    return result;
};


export const ScheduleService = {
    insertIntoDB,
    getAllFromDB,
    getByIdFromDB,
    deleteFromDB

}