import jwt, { JwtPayload, Secret } from 'jsonwebtoken';
import { jwtHelper } from './../../../helpers/jwtHelper';
import prisma from "../../../shared/prisma";
import bcrypt from 'bcrypt';
import { UserRole, UserStatus } from '@prisma/client';
import config from '../../config';
import emailSender from './emailSender';
import ApiError from '../../errors/ApiError';
import httpStatus from 'http-status';



const loginUser = async (payload: { email: string, password: string }) => {
    const userData = await prisma.user.findUniqueOrThrow({
        where: {
            email: payload.email,
            status: UserStatus.ACTIVE
        }
    });

    const isCorrectPassword: boolean = await bcrypt.compare(payload.password, userData.password);

    if (!isCorrectPassword) {
        throw new Error("Your password is wrong")
    }

    const jwtSign = {
        email: userData.email,
        role: userData.role
    };

    const accessToken = jwtHelper.tokenGenerator(jwtSign, config.jwt.jwt_secret as Secret, config.jwt.expires_in as string);

    const refreshToken = jwtHelper.tokenGenerator(jwtSign, config.jwt.refresh_token_secret as Secret, config.jwt.refresh_token_expires_in as string);

    return {
        accessToken,
        refreshToken,
        needPasswordChange: userData.needPasswordChange
    };
};

const refreshToken = async (token: string) => {
    let decodedData;
    try {
        decodedData = jwtHelper.verifyToken(token, config.jwt.refresh_token_secret as Secret)
    } catch (error) {
        throw new Error("Your are not authorized!")
    };

    const userData = await prisma.user.findUniqueOrThrow({
        where: {
            email: decodedData?.email,
            status: UserStatus.ACTIVE
        }
    });

    const jwtSign = {
        email: userData.email,
        role: userData.role
    };

    const accessToken = jwtHelper.tokenGenerator(jwtSign, config.jwt.jwt_secret as Secret, config.jwt.expires_in as string);

    return {
        accessToken,
        needPasswordChange: userData.needPasswordChange
    };

};

const changePassword = async (user: any, payload: any) => {
    const userData = await prisma.user.findUniqueOrThrow({
        where: {
            email: user.email,
            status: UserStatus.ACTIVE
        }
    });

    const isCorrectPassword: boolean = await bcrypt.compare(payload.oldPassword, userData.password);

    if (!isCorrectPassword) {
        throw new Error("Your password is wrong")
    }

    const hashedPassword: string = await bcrypt.hashSync(payload.newPassword, 13);

    await prisma.user.update({
        where: {
            email: userData.email
        },
        data: {
            password: hashedPassword,
            needPasswordChange: false
        }
    })

    return {
        message: "Password change successfully"
    }
};

const forgotPassword = async (payload: { email: string }) => {
    const userData = await prisma.user.findUniqueOrThrow({
        where: {
            email: payload.email,
            status: UserStatus.ACTIVE
        }
    });

    const resetPassToken = jwtHelper.tokenGenerator(
        { email: userData.email, role: userData.role },
        config.jwt.reset_pass_secret as Secret,
        config.jwt.reset_pass_token_expires_in as string
    );

    const resetPassLink = config.reset_pass_link + `?userId=${userData.id}&token=${resetPassToken}`;

    await emailSender(
        userData.email,
        `
        <div>
            <p>Dear User,</p>
            <p>Your password reset link
                <a href=${resetPassLink}>
                    <button>
                        Reset Password
                    </button>
                </a>
            </p>
        </div>
        
        `
    )

};

const resetPassword = async (token: string, payload: { id: string, password: string }) => {
    //console.log({ token, payload });

    const userData = await prisma.user.findUniqueOrThrow({
        where: {
            id: payload.id,
            status: UserStatus.ACTIVE
        }
    })

    const isValidToken = jwtHelper.verifyToken(token, config.jwt.reset_pass_secret as Secret);

    if (!isValidToken) {
        throw new ApiError(httpStatus.FORBIDDEN, "Forbidden")
    }

    const hashedPassword: string = await bcrypt.hashSync(payload.password, 13);

    const result = await prisma.user.update({
        where: {
            id: payload.id
        },
        data: {
            password: hashedPassword
        }
    })


    return result;

}

export const AuthService = {
    loginUser,
    refreshToken,
    changePassword,
    forgotPassword,
    resetPassword
}