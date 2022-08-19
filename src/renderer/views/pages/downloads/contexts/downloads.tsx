import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { DataGroup, DownloadData } from '../../../../../interfaces/user';

export interface DownloadsProps {
    downloads: Required<DownloadData>[];
    downloadGroups: DataGroup<Required<DownloadData>>[];
}

export const DownloadsContext = createContext<DownloadsProps>({
    downloads: [],
    downloadGroups: []
});

export const useDownloadsContext = () => useContext(DownloadsContext);

interface DownloadsProviderProps {
    children?: ReactNode;
}

export const DownloadsProvider = ({ children }: DownloadsProviderProps) => {
    const context = useContext(DownloadsContext);

    const [userId, setUserId] = useState('');

    const [downloads, setDownloads] = useState<Required<DownloadData>[]>(context.downloads);
    const [downloadGroups, setDownloadGroups] = useState<DataGroup<Required<DownloadData>>[]>(context.downloadGroups);

    useEffect(() => {
        window.flast.getUser().then(async (id) => {
            if (!id) return;
            setUserId(id);

            const downloadDataList = await window.flast.downloads.list(id);
            setDownloads(downloadDataList);

            const downloadGroupList = await window.flast.downloads.listGroups(id);
            setDownloadGroups(downloadGroupList);
        });
    }, []);


    const value: DownloadsProps = { downloads, downloadGroups };

    return (
        <DownloadsContext.Provider value={value}>
            {children}
        </DownloadsContext.Provider>
    );
};
