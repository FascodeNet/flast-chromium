import { ipcRenderer } from 'electron';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { DefaultUserConfig, UserConfig, UserType } from '../../interfaces/user';
import { DeepPartial } from '../../utils';
import { useElectronAPI } from '../utils/electron';

export interface UserConfigProps {
    userId: string;
    type: UserType;
    config: UserConfig;
    setConfig: (config: DeepPartial<UserConfig>) => Promise<void>;
}

export const UserConfigContext = createContext<UserConfigProps>({
    userId: '',
    type: 'normal',
    config: DefaultUserConfig,
    setConfig: () => Promise.resolve()
});

export const useUserConfigContext = () => useContext(UserConfigContext);

interface UserConfigProviderProps {
    children?: ReactNode;
}

export const UserConfigProvider = ({ children }: UserConfigProviderProps) => {
    const context = useContext(UserConfigContext);

    const [userId, setUserId] = useState(context.userId);
    const [type, setType] = useState(context.type);
    const [config, setConfig] = useState(context.config);

    const _setConfig = async (userConfig: DeepPartial<UserConfig>) => {
        const { setUserConfig } = useElectronAPI();
        const cfg = await setUserConfig(userId, userConfig);
        setConfig(cfg);
    };

    useEffect(() => {
        const { getCurrentUserId, getUserType, getUserConfig } = useElectronAPI();

        getCurrentUserId().then(async (id) => {
            setUserId(id);

            const userType = await getUserType(id);
            setType(userType);

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


    const value: UserConfigProps = { userId, type, config, setConfig: _setConfig };

    return (
        <UserConfigContext.Provider value={value}>
            {children}
        </UserConfigContext.Provider>
    );
};
