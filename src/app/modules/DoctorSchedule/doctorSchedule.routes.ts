import { Router } from "express";
import { DoctorScheduleController } from "./doctorSchedule.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = Router();

router.get(
    '/my-schedule',
    auth(UserRole.DOCTOR),
    DoctorScheduleController.getMySchedule
)

router.get(
    '/',
    auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.PATIENT, UserRole.DOCTOR),
    DoctorScheduleController.getAllFromDB
)

router.post(
    '/',
    auth(UserRole.DOCTOR),
    DoctorScheduleController.insertIntoDB
);

router.delete(
    '/:id',
    auth(UserRole.DOCTOR),
    DoctorScheduleController.deleteFromDB
);


export const DoctorScheduleRoutes = router;