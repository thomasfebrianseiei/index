import * as dotenv from 'dotenv';

import { IDatabaseConfig } from './interfaces/dbConfig.interface';

dotenv.config();

export const databaseConfig: IDatabaseConfig = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME_DEVELOPMENT,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT,
    logging: false,
    synchronize: true,
    sync: {
      force: false,
      alter: { drop: true },
    },
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS_PROD,
    database: process.env.DB_NAME_PRODUCTION,
    host: process.env.DB_HOST_PROD,
    dialect: process.env.DB_DIALECT,
    logging: false,
    synchronize: true,
    sync: {
      force: false,
      alter: { drop: true },
    },
  },
};
