import { ipcRenderer } from 'electron';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { DefaultUserConfig, UserConfig } from '../../interfaces/user';
import { DeepPartial } from '../../utils';
import { useElectronAPI } from '../utils/electron';

export interface UserConfigProps {
    userId: string;
    config: UserConfig;
    setConfig: (config: DeepPartial<UserConfig>) => Promise<void>;
}

export const UserConfigContext = createContext<UserConfigProps>({
    userId: '',
    config: DefaultUserConfig,
    setConfig: (_) => Promise.resolve()
});

export const useUserConfigContext = () => useContext(UserConfigContext);

interface UserConfigProviderProps {
    children?: ReactNode;
}

export const UserConfigProvider = ({ children }: UserConfigProviderProps) => {
    const context = useContext(UserConfigContext);

    const [userId, setUserId] = useState(context.userId);
    const [config, setConfig] = useState(context.config);

    const _setConfig = async (config: DeepPartial<UserConfig>) => {
        const { setUserConfig } = useElectronAPI();
        const cfg = await setUserConfig(userId, config);
        setConfig(cfg);
    };

    useEffect(() => {
        const { getCurrentUserId, getUserConfig } = useElectronAPI();

        getCurrentUserId().then(async (id) => {
            setUserId(id);

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


    const value: UserConfigProps = { userId, config, setConfig: _setConfig };

    return (
        <UserConfigContext.Provider value={value}>
            {children}
        </UserConfigContext.Provider>
    );
};
