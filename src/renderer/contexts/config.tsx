import { ipcRenderer } from 'electron';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { DefaultUserConfig, UserConfig } from '../../interfaces/user';
import { useElectronAPI } from '../utils/electron';

export interface UserConfigProps {
    config: UserConfig;
    setConfig: (config: UserConfig) => void;
}

export const UserConfigContext = createContext<UserConfigProps>({
    config: DefaultUserConfig,
    setConfig: (_) => {
    }
});

export const useUserConfigContext = () => useContext(UserConfigContext);

interface UserConfigProviderProps {
    children?: ReactNode;
}

export const UserConfigProvider = ({ children }: UserConfigProviderProps) => {
    const context = useContext(UserConfigContext);

    const [config, setConfig] = useState(context.config);

    useEffect(() => {
        const { getCurrentUserId, getUserConfig } = useElectronAPI();

        getCurrentUserId().then(async (id) => {
            const userConfig = await getUserConfig(id);
            setConfig(userConfig);
        });
    }, []);

    useEffect(() => {
        ipcRenderer.on('settings-update', (e, data: UserConfig) => {
            setConfig(data);
        });

        return () => {
            ipcRenderer.removeAllListeners('settings-update');
        };
    }, [config]);


    const value: UserConfigProps = { config, setConfig };

    return (
        <UserConfigContext.Provider value={value}>
            {children}
        </UserConfigContext.Provider>
    );
};
