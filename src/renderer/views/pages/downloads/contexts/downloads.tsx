import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { NativeDownloadData } from '../../../../../interfaces/user';

export interface DownloadsProps {
    downloads: NativeDownloadData[];
}

export const DownloadsContext = createContext<DownloadsProps>({
    downloads: []
});

export const useDownloadsContext = () => useContext(DownloadsContext);

interface DownloadsProviderProps {
    children?: ReactNode;
}

export const DownloadsProvider = ({ children }: DownloadsProviderProps) => {
    const context = useContext(DownloadsContext);

    const [userId, setUserId] = useState('');

    const [downloads, setDownloads] = useState<NativeDownloadData[]>(context.downloads);

    useEffect(() => {
        window.flast.getUser().then(async (id) => {
            if (!id) return;
            setUserId(id);

            const downloadDataList = await window.flast.getDownloadsWithFileIcon(id);
            setDownloads(downloadDataList);
        });
    }, []);


    const value: DownloadsProps = { downloads };

    return (
        <DownloadsContext.Provider value={value}>
            {children}
        </DownloadsContext.Provider>
    );
};
