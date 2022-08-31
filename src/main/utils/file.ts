import { stat } from 'fs';
import { mkdir, writeFile } from 'fs/promises';
import { loadAsync } from 'jszip';
import { dirname, join } from 'path';

export const existsPath = (path: string) => new Promise((resolve) => stat(path, (error) => resolve(!error)));

export const extractZip = async (zipBuf: Buffer, destination: string) => {
    const zip = await loadAsync(zipBuf);
    const zipFileKeys = Object.keys(zip.files);

    return Promise.all(
        zipFileKeys.map((filename: string) => {
            const isFile = !zip.files[filename].dir;
            const fullPath = join(destination, filename);
            const directory = (isFile && dirname(fullPath)) || fullPath;
            const content = zip.files[filename].async('nodebuffer');

            return mkdir(directory, { recursive: true })
                .then(async () => {
                    return isFile ? await content : false;
                })
                .then(async (data: any) => {
                    return data ? await writeFile(fullPath, data) : true;
                });
        })
    );
};
