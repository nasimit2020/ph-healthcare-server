import { TAuthUser } from './../../interfaces/common';
import { PaymentStatus, UserRole } from "@prisma/client";
import prisma from "../../../shared/prisma";

const fetchDashboardMetaData = async (user: TAuthUser) => {
    let metaData;
    switch (user?.role) {
        case UserRole.SUPER_ADMIN:
            metaData = getSuperAdminMetaData();
            break;
        case UserRole.ADMIN:
            metaData = getAdminMetaData();
            break;
        case UserRole.DOCTOR:
            metaData = getDoctorMetaData(user);
            break;
        case UserRole.PATIENT:
            metaData = getPatientMetaData(user);
            break;
        default:
            throw new Error("Invalid user role");
    }

    return metaData;
};

const getSuperAdminMetaData = async () => {
    const appointmentCount = await prisma.appointment.count();
    const adminCount = await prisma.admin.count();
    const patientCount = await prisma.patient.count();
    const doctorCount = await prisma.doctor.count();
    const paymentCount = await prisma.payment.count();

    const totalRevenue = await prisma.payment.aggregate({
        _sum: {
            amount: true
        },
        where: {
            status: PaymentStatus.PAID
        }
    })

    return { appointmentCount, adminCount, patientCount, doctorCount, paymentCount };

}
const getAdminMetaData = async () => {
    const appointmentCount = await prisma.appointment.count();
    const patientCount = await prisma.patient.count();
    const doctorCount = await prisma.doctor.count();
    const paymentCount = await prisma.payment.count();

    const totalRevenue = await prisma.payment.aggregate({
        _sum: {
            amount: true
        },
        where: {
            status: PaymentStatus.PAID
        }
    })

    return { appointmentCount, patientCount, doctorCount, paymentCount };

}
const getDoctorMetaData = async (user: TAuthUser) => {
    const doctorData = await prisma.doctor.findUniqueOrThrow({
        where: {
            email: user?.email
        }
    })

    const appointmentCount = await prisma.appointment.count({
        where: {
            doctorId: doctorData.id
        }
    });

    const patientCount = await prisma.appointment.groupBy({
        by: ['patientId'],
        _count: {
            id: true
        }
    });

    const reviewCount = await prisma.review.count({
        where: {
            doctorId: doctorData.id
        }
    });

    const totalRevenue = await prisma.payment.aggregate({
        _sum: {
            amount: true
        },
        where: {
            appointment: {
                doctorId: doctorData.id
            },
            status: PaymentStatus.PAID
        }
    });

    const appointmentStatusDistribution = await prisma.appointment.groupBy({
        by: ['status'],
        _count: { id: true },
        where: {
            doctorId: doctorData.id
        }
    });

    const formattedAppointmentStatusDistribution = appointmentStatusDistribution.map(({ status, _count }) => ({
        status,
        count: Number(_count.id)
    }))

    return {
        appointmentCount,
        patientCount: patientCount.length,
        reviewCount,
        totalRevenue,
        formattedAppointmentStatusDistribution
    }

};


const getPatientMetaData = async (user: TAuthUser) => {
    const patientData = await prisma.patient.findUniqueOrThrow({
        where: {
            email: user?.email
        }
    })

    const appointmentCount = await prisma.appointment.count({
        where: {
            patientId: patientData.id
        }
    });

    const prescriptionCount = await prisma.prescription.count({
        where: {
            patientId: patientData.id
        }
    });

    const reviewCount = await prisma.review.count({
        where: {
            patientId: patientData.id
        }
    });

    const appointmentStatusDistribution = await prisma.appointment.groupBy({
        by: ['status'],
        _count: { id: true },
        where: {
            patientId: patientData.id
        }
    });

    const formattedAppointmentStatusDistribution = appointmentStatusDistribution.map(({ status, _count }) => ({
        status,
        count: Number(_count.id)
    }))

    return {
        appointmentCount,
        prescriptionCount,
        reviewCount,
        formattedAppointmentStatusDistribution
    }

}

export const MetaService = {
    fetchDashboardMetaData
}