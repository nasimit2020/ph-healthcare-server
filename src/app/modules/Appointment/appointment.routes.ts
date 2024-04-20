import { Router } from "express";
import { AppointmentController } from "./appointment.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";


const router = Router();

router.get(
    '/my-appointment',
    auth(UserRole.PATIENT, UserRole.DOCTOR),
    AppointmentController.getMyAppointment
);
router.post(
    '/',
    auth(UserRole.PATIENT),
    AppointmentController.createAppointment
);




export const AppointmentRoutes = router;