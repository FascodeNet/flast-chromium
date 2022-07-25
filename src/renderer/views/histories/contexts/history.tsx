import { format } from 'date-fns';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { IHistory } from '../../../../interfaces/user';

export interface CategorizedHistory {
    date: Date;
    format: string;
    histories: IHistory[];
}

export const predicateHistory = (
    history: CategorizedHistory,
    date: Date
) => history.date.getFullYear() === date.getFullYear() && history.date.getMonth() === date.getMonth() && history.date.getDate() === date.getDate();


export interface HistoryProps {
    histories: IHistory[];
    categorizedHistories: CategorizedHistory[];
}

export const HistoryContext = createContext<HistoryProps>({
    histories: [],
    categorizedHistories: []
});

export const useHistoryContext = () => useContext(HistoryContext);

interface HistoryProviderProps {
    children?: ReactNode;
}

export const HistoryProvider = ({ children }: HistoryProviderProps) => {
    const context = useContext(HistoryContext);

    const [userId, setUserId] = useState('');

    const [histories, setHistories] = useState<IHistory[]>(context.histories);
    const [categorizedHistories, setCategorizedHistories] = useState<CategorizedHistory[]>(context.categorizedHistories);

    useEffect(() => {
        window.api.getUser().then(async (id) => {
            if (!id) return;
            setUserId(id);

            const historyData = await window.api.getHistories(id);
            setHistories(historyData);

            const categorizedHistoryData: CategorizedHistory[] = [];
            historyData
                .sort((a, b) => (a.updatedAt!! < b.updatedAt!! ? 1 : -1))
                .forEach((history, i) => {
                    const date = new Date(history.updatedAt!!);
                    const object = new Date(date.getFullYear(), date.getMonth(), date.getDate());

                    const categorizedHistory = categorizedHistoryData.find((data) => predicateHistory(data, object));
                    const categorizedHistoryIndex = categorizedHistoryData.findIndex((data) => predicateHistory(data, object));

                    if (categorizedHistory) {
                        categorizedHistoryData[categorizedHistoryIndex] = {
                            ...categorizedHistory,
                            histories: [...categorizedHistory.histories, history]
                        };
                    } else {
                        categorizedHistoryData.push(
                            {
                                date: object,
                                format: format(object, 'yyyy/MM/dd'),
                                histories: [history]
                            }
                        );
                    }
                });

            setCategorizedHistories(categorizedHistoryData);
        });
    }, []);


    const value: HistoryProps = { histories, categorizedHistories };

    return (
        <HistoryContext.Provider value={value}>
            {children}
        </HistoryContext.Provider>
    );
};
