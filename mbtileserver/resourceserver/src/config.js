import dotenv from 'dotenv';
dotenv.config();

const config = {
    port: process.env.PORT || 8001,
    logLevel: process.env.LOG_LEVEL || 'info',
    baseUrl: process.env.BASE_URL || 'http://127.0.0.1:8001'
}

export default config;