import { UserRole } from "@prisma/client"
import bcrypt from 'bcrypt';
import prisma from "../../../shared/prisma";
import { fileUploader } from "../../../helpers/fileUploader";
import { TFile } from "../../interfaces/file";

const createAdmin = async (req: any) => {
    // console.log('file', req.file);
    // console.log('data', req.body);

    const file: TFile = req.file;

    if (file) {
        const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
        req.body.admin.profilePhoto = uploadToCloudinary?.secure_url;


    }


    const hashedPassword: string = await bcrypt.hashSync(req.body.password, 13);

    const userData = {
        email: req.body.admin.email,
        password: hashedPassword,
        role: UserRole.ADMIN
    }

    const result = await prisma.$transaction(async (transactionClient) => {
        await transactionClient.user.create({
            data: userData
        });

        const createdAdminData = await transactionClient.admin.create({
            data: req.body.admin
        })

        return createdAdminData;
    });

    return result;
}



const createDoctor = async (req: any) => {
    // console.log('file', req.file);
    // console.log('data', req.body);

    const file: TFile = req.file;

    if (file) {
        const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
        req.body.doctor.profilePhoto = uploadToCloudinary?.secure_url;
    }


    const hashedPassword: string = await bcrypt.hashSync(req.body.password, 13);

    const userData = {
        email: req.body.doctor.email,
        password: hashedPassword,
        role: UserRole.DOCTOR
    }

    const result = await prisma.$transaction(async (transactionClient) => {
        await transactionClient.user.create({
            data: userData
        });

        const createdDoctorData = await transactionClient.doctor.create({
            data: req.body.doctor
        })

        return createdDoctorData;
    });

    return result;
}

const createPatient = async (req: any) => {
    // console.log('file', req.file);
    // console.log('data', req.body);

    const file: TFile = req.file;

    if (file) {
        const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
        req.body.patient.profilePhoto = uploadToCloudinary?.secure_url;
    }


    const hashedPassword: string = await bcrypt.hashSync(req.body.password, 13);

    const userData = {
        email: req.body.patient.email,
        password: hashedPassword,
        role: UserRole.PATIENT
    }

    const result = await prisma.$transaction(async (transactionClient) => {
        await transactionClient.user.create({
            data: userData
        });

        const createdPatientData = await transactionClient.patient.create({
            data: req.body.patient
        })

        return createdPatientData;
    });

    return result;
}

export const userService = {
    createAdmin,
    createDoctor,
    createPatient
}