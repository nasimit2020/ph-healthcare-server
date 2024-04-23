import { Router } from "express";
import { PrescriptionController } from "./prescription.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";


const router = Router();

router.post(
    '/my-prescription',
    auth(UserRole.PATIENT),
    PrescriptionController.patientPrescription
)

router.post(
    '/',
    auth(UserRole.DOCTOR),
    PrescriptionController.insertIntoDB
)

export const PrescriptionRoutes = router;