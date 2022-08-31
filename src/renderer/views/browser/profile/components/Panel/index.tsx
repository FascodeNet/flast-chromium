import { Box, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { UserData } from '../../../../../../interfaces/user';
import { useUserConfigContext } from '../../../../../contexts/config';
import { useElectronAPI } from '../../../../../utils/electron';
import { Avatar, Divider, Panel as StyledPanel, PanelContainer as StyledPanelContainer, PanelItem } from './styles';

export const Panel = () => {
    const { usersApi } = useElectronAPI();
    const { userId, config } = useUserConfigContext();

    const [users, setUsers] = useState<UserData[]>([]);

    useEffect(() => {
        usersApi.list().then((userDataList) => setUsers(userDataList));
    }, []);

    return (
        <StyledPanel className="panel">
            <StyledPanelContainer className="panel-container">
                <Box
                    sx={{
                        width: '100%',
                        px: 2,
                        py: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        gap: 1
                    }}
                >
                    <Avatar
                        src={config.profile.avatar ?? undefined}
                        sx={{ width: 64, height: 64 }}
                    />
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-start',
                            justifyContent: 'center'
                        }}
                    >
                        <Typography variant="body1">{config.profile.name}</Typography>
                        <Typography variant="body2">example@example.com</Typography>
                    </Box>
                </Box>
                <Divider sx={{ my: 0 }} />
                <Box
                    sx={{
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    {users.filter((user) => user.id !== userId).map((user) => (
                        <PanelItem className="panel-item">
                            <Avatar
                                src={user.avatar ?? undefined}
                                sx={{ width: 32, height: 32 }}
                            />
                            <Typography variant="body1">{user.name}</Typography>
                        </PanelItem>
                    ))}
                </Box>
            </StyledPanelContainer>
        </StyledPanel>
    );
};
