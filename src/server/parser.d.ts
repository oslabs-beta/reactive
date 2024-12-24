// src/server/parser.d.ts

declare module '@reactive/parser' {
    export function buildComponentTree(filePath: string, baseDir: string): {
        file: string;
        type: 'functional' | 'class' | null;
        state: string[];
         // eslint-disable-next-line @typescript-eslint/no-explicit-any
        children: any[];
    } | null;
}