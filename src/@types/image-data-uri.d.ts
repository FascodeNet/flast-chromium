declare module 'image-data-uri' {
    export function encode(data: any, mediaType: string): string;

    export function decode(dataUri: string): ImageData;

    export function encodeFromFile(path: string): Promise<string>;

    export function encodeFromURL(url: string, options: { timeout: number } = { timeout: 6000 }): Promise<string>;

    export interface ImageData {
        imageType: string,
        dataBase64: string,
        dataBuffer: Buffer
    }
}
