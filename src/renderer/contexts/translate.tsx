import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { En } from '../../languages/en';
import { Language } from '../../languages/language';

export interface TranslateProps {
    translate: Language;
    setTranslate: (language: Language) => void;
}

export const TranslateContext = createContext<TranslateProps>({
    translate: En,
    setTranslate: () => {
    }
});

export const useTranslateContext = () => useContext(TranslateContext);

interface TranslateProviderProps {
    children?: ReactNode;
}

export const TranslateProvider = ({ children }: TranslateProviderProps) => {
    const context = useContext(TranslateContext);

    const [userId, setUserId] = useState('');

    const [translate, setTranslate] = useState<Language>(context.translate);

    useEffect(() => {
        window.flast.user.current().then(async (id) => {
            if (!id) return;
            setUserId(id);

            const language = await window.flast.user.language(id);
            setTranslate(language);
        });
    }, []);


    const value: TranslateProps = { translate, setTranslate };

    return (
        <TranslateContext.Provider value={value}>
            {children}
        </TranslateContext.Provider>
    );
};
