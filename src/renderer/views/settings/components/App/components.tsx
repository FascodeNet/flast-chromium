import { Box, ButtonBase as MuiButtonBase, styled, Switch, Typography } from '@mui/material';
import React, { ReactNode } from 'react';

export const Section = styled('section')(({ theme }) => ({
    padding: theme.spacing(1, 0),
    display: 'flex',
    flexDirection: 'column'
}));

export const ButtonBase = styled(MuiButtonBase)(({ theme }) => ({
    height: 60,
    padding: theme.spacing(1),
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1)
}));

const Icon = ({ icon }: { icon?: ReactNode; }) => icon ? (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>{icon}</Box>
) : null;

const TextBlock = ({ primary, secondary }: ItemProps) => (
    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start' }}>
        <Typography variant="body1" sx={{ fontWeight: 300 }}>{primary}</Typography>
        {secondary && <Typography variant="body2" sx={{ fontWeight: 100 }}>{secondary}</Typography>}
    </Box>
);

const Container = styled(Box)({
    marginLeft: 'auto'
});

interface ItemProps {
    primary?: ReactNode;
    secondary?: ReactNode;
}

interface IconItemProps extends ItemProps {
    icon?: ReactNode;
}

interface SwitchItemProps extends IconItemProps {
    checked: boolean;
    setChecked: (checked: boolean) => void;
    disabled?: boolean;
}

export const SwitchItem = ({ icon, primary, secondary, checked, setChecked, disabled }: SwitchItemProps) => {
    return (
        <ButtonBase onClick={() => setChecked(!checked)} disabled={disabled}>
            <Icon icon={icon} />
            <TextBlock primary={primary} secondary={secondary} />
            <Container>
                <Switch checked={checked} onChange={() => setChecked(!checked)} disabled={disabled} />
            </Container>
        </ButtonBase>
    );
};
