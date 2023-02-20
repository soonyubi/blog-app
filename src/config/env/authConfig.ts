import { registerAs } from "@nestjs/config";

export default registerAs('auth',()=>({
    jwt_access_secret : process.env.JWT_ACCESS_SECRET,
    jwt_refresh_secret : process.env.JWT_REFRESH_SECRET
}));