import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";

export const getAdminSession = () => getServerSession(authOptions);
export const getCustomerSession = () => getServerSession(authOptions);
