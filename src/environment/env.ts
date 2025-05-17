import dotenv from 'dotenv'
dotenv.config({path:".env.development"})

interface Config{
    Port: number;
    DB_Name: string;
    DB_User: string;
    DB_Password: string;
    DB_Host: string;
    DB_Dialect: string;
    Secret_Key: string;
    Conn_URL: string;
    Google_API_Client: string;
    Client_Secret: string;
    AWS_Reigon: string;
    AWS_Access_Key_Id: string;
    AWS_Secret_Access_Key: string;
    S3_Bucket_Name: string;
    S3_END_POINT: string;
}

export const Local:Config = {
    Port: Number(process.env.PORT),
    DB_Name: String(process.env.DB_NAME),
    DB_User: String(process.env.DB_USER),
    DB_Password: String(process.env.DB_PASSWORD),
    DB_Host: String(process.env.DB_HOST),
    DB_Dialect: String(process.env.DB_DIALECT),
    Secret_Key: String(process.env.SECRET_KEY),
    Conn_URL: String(process.env.Conn),
    Google_API_Client: String(process.env.GOOGLE_API_CLIENT_ID),
    Client_Secret: String(process.env.CLIENT_SECRET),
    AWS_Reigon: String(process.env.AWS_REGION),
    AWS_Access_Key_Id: String(process.env.AWS_ACCESS_KEY_ID),
    AWS_Secret_Access_Key: String(process.env.AWS_SECRET_ACCESS_KEY),
    S3_Bucket_Name: String(process.env.S3_BUCKET_NAME),
    S3_END_POINT: String(process.env.S3_END_POINT),
}