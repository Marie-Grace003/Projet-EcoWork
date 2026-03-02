// Déclarations temporaires pour les types Node.js
// En production, installer: npm install -D @types/node

declare namespace NodeJS {
    interface Process {
        exit(code?: number): never;
        stdin: any;
        stdout: any;
    }
}

declare var process: NodeJS.Process;

declare var console: {
    log(...args: any[]): void;
    error(...args: any[]): void;
    warn(...args: any[]): void;
    info(...args: any[]): void;
};

declare module "readline" {
    export interface Interface {
        question(query: string, callback: (answer: string) => void): void;
        close(): void;
    }

    export function createInterface(options: {
        input: any;
        output: any;
    }): Interface;
}

declare module "fs" {
    export function existsSync(path: string): boolean;
    export function readFileSync(path: string, encoding: string): string;
    export function writeFileSync(
        path: string,
        data: string,
        encoding: string,
    ): void;
    export function mkdirSync(path: string, options?: { recursive?: boolean }): void;
}

declare module "path" {
    export function join(...paths: string[]): string;
    export function dirname(path: string): string;
}

declare var __dirname: string;
