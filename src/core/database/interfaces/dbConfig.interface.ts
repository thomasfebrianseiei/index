export interface IDatabaseConfigAttributes {
    username?: string;
    password?: string;
    database?: string;
    host?: string;
    port?: number | string;
    dialect?: string;
    urlDatabase?: string;
    logging?: boolean;
    synchronize?: boolean,
    sync?: {
      force: boolean
      alter: { drop: boolean }
    }
}

export interface IDatabaseConfig {
    development: IDatabaseConfigAttributes;
    production: IDatabaseConfigAttributes;
}