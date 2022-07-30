import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { HistoryData, HistoryGroup } from '../../../../interfaces/user';

export const predicateHistory = (
    historyGroup: HistoryGroup,
    date: Date
) => historyGroup.date.getFullYear() === date.getFullYear() && historyGroup.date.getMonth() === date.getMonth() && historyGroup.date.getDate() === date.getDate();


export interface HistoryProps {
    history: HistoryData[];
    historyGroups: HistoryGroup[];
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

    const [history, setHistory] = useState<HistoryData[]>(context.history);
    const [historyGroups, setHistoryGroups] = useState<HistoryGroup[]>(context.historyGroups);

    useEffect(() => {
        window.api.getUser().then(async (id) => {
            if (!id) return;
            setUserId(id);

            try {
                const historyDataList = await window.api.getHistory(id);
                setHistory(historyDataList);

                const historyGroupList = await window.api.getHistoryGroups(id);
                setHistoryGroups(historyGroupList);
            } catch (e) {
                return;
            }
        });
    }, []);


    const value: HistoryProps = { history, historyGroups };

    return (
        <HistoryContext.Provider value={value}>
            {children}
        </HistoryContext.Provider>
    );
};
