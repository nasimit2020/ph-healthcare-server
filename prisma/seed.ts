import { UserRole } from "@prisma/client"
import prisma from "../src/shared/prisma"
import bcrypt from 'bcrypt';

const seedSuperAdmin = async () => {
    try {
        const isSuperAdminExist = await prisma.user.findFirst({
            where: {
                role: UserRole.SUPER_ADMIN
            }
        });
        if (isSuperAdminExist) {
            console.log("Super Admin already exists");
            return;
        };

        const hasPassword = await bcrypt.hashSync('superadmin', 13)

        const superAdminData = await prisma.user.create({
            data: {
                email: 'super@admin.com',
                password: hasPassword,
                role: UserRole.SUPER_ADMIN,
                admin: {
                    create: {
                        name: "Super Admin",
                        // email: 'super@admin.com',
                        contactNumber: '01724370837'
                    }
                }
            }
        })

        console.log("Super Admin created successfully", superAdminData);

    } catch (error) {
        console.error(error)
    }
    finally {
        await prisma.$disconnect();
    }
};

seedSuperAdmin();