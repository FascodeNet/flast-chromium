import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { DataGroup, HistoryData } from '../../../../../interfaces/user';

export interface HistoryProps {
    history: Required<HistoryData>[];
    historyGroups: DataGroup<Required<HistoryData>>[];
}

export const HistoryContext = createContext<HistoryProps>({
    history: [],
    historyGroups: []
});

export const useHistoryContext = () => useContext(HistoryContext);

interface HistoryProviderProps {
    children?: ReactNode;
}

export const HistoryProvider = ({ children }: HistoryProviderProps) => {
    const context = useContext(HistoryContext);

    const [userId, setUserId] = useState('');

    const [history, setHistory] = useState<Required<HistoryData>[]>(context.history);
    const [historyGroups, setHistoryGroups] = useState<DataGroup<Required<HistoryData>>[]>(context.historyGroups);

    useEffect(() => {
        window.flast.getUser().then(async (id) => {
            if (!id) return;
            setUserId(id);

            const historyDataList = await window.flast.history.list(id);
            setHistory(historyDataList);

            const historyGroupList = await window.flast.history.listGroups(id);
            setHistoryGroups(historyGroupList);
        });
    }, []);


    const value: HistoryProps = { history, historyGroups };

    return (
        <HistoryContext.Provider value={value}>
            {children}
        </HistoryContext.Provider>
    );
};
