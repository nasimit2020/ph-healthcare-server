import { Router } from "express";
import { userRoutes } from "../modules/User/user.routes";
import { adminRoutes } from "../modules/Admin/admin.routes";
import { authRouter } from "../modules/Auth/auth.routes";
import { SpecialtiesRoutes } from "../modules/Specialties/specialties.route";
import { DoctorRoutes } from "../modules/Doctor/doctor.routes";
import { PatientRoutes } from "../modules/Patient/patient.routes";

const router = Router();

const moduleRoutes = [
    {
        path: '/user',
        route: userRoutes
    },
    {
        path: '/admin',
        route: adminRoutes
    },
    {
        path: '/auth',
        route: authRouter
    },
    {
        path: '/specialties',
        route: SpecialtiesRoutes
    },
    {
        path: '/doctor',
        route: DoctorRoutes
    },
    {
        path: '/patient',
        route: PatientRoutes
    },
];

moduleRoutes.forEach(route => router.use(route.path, route.route));

export default router;