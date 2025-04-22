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
}

export const Local:Config = {
    Port: Number(process.env.PORT),
    DB_Name: String(process.env.DB_NAME),
    DB_User: String(process.env.DB_USER),
    DB_Password: String(process.env.DB_PASSWORD),
    DB_Host: String(process.env.DB_HOST),
    DB_Dialect: String(process.env.DB_DIALECT),
    Secret_Key: String(process.env.SECRET_KEY),
    Conn_URL: String(process.env.Conn)
}