import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { BookmarkData } from '../../../../../interfaces/user';

export interface DownloadsProps {
    downloads: BookmarkData[];
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

    const [downloads, setDownloads] = useState<BookmarkData[]>(context.downloads);

    useEffect(() => {
        window.flast.getUser().then(async (id) => {
            if (!id) return;
            setUserId(id);

            /*
            const downloadDataList = await window.flast.getDownloads(id);
            setDownloads(downloadDataList);
            */
        });
    }, []);


    const value: DownloadsProps = { downloads };

    return (
        <DownloadsContext.Provider value={value}>
            {children}
        </DownloadsContext.Provider>
    );
};
