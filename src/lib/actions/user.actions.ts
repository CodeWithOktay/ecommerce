"use server"

import { z } from "zod"; // Veri doğrulama için
import { getServerSession } from "next-auth";
import bcrypt from "bcrypt";

import { authOptions } from "@/lib/auth/options";
import { prisma } from "@/lib/prisma-client";

const profileSchema = z.object({
    name: z.string().min(3, "Ad en az 3 karakter uzunluğunda olmalıdır."),
    password: z.string().optional().refine((val) => val === "" || !val || val.length >= 8, {
        message: "Parola en az 8 karakter uzunluğunda olmalıdır.",
    }),
})

interface UpdateProfileResponse {
    success: boolean;
    message: string;
}

export async function updateUserProfile(prevState:any, formData:FormData):Promise<UpdateProfileResponse> {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.id) {
        return {
            success: false,
            message: "Yetkisiz işlem."
        };
    }

    const rawData =  {
        name: formData.get("name"),
        password: formData.get("password"),
    }
    const validation = profileSchema.safeParse(rawData);
    
}