import {
    Box,
    ButtonBase as MuiButtonBase,
    buttonClasses,
    Checkbox,
    Radio,
    styled,
    Switch,
    Typography
} from '@mui/material';
import React, { ReactNode } from 'react';

export const ButtonBase = styled(MuiButtonBase)(({ theme }) => ({
    height: 50,
    padding: theme.spacing(.5, 1, .5, 1.5),
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: theme.spacing(1),
    borderRadius: theme.shape.borderRadius,
    transition: theme.transitions.create(['background-color', 'box-shadow', 'border-color', 'color'], {
        duration: theme.transitions.duration.short
    }),
    [`&.${buttonClasses.disabled}`]: {
        color: theme.palette.action.disabled
    },
    '&:hover': {
        background: theme.palette.action.hover
    }
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

const FormContainer = styled(Box)({
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

export const SwitchItem = ({ icon, primary, secondary, checked, setChecked, disabled }: SwitchItemProps) => (
    <ButtonBase onClick={() => setChecked(!checked)} disabled={disabled}>
        <Icon icon={icon} />
        <TextBlock primary={primary} secondary={secondary} />
        <FormContainer>
            <Switch
                checked={checked}
                onChange={() => setChecked(!checked)}
                disabled={disabled}
                disableRipple
                sx={{ '& .MuiSwitch-switchBase:hover': { backgroundColor: 'transparent !important' } }}
            />
        </FormContainer>
    </ButtonBase>
);

export const CheckItem = ({ icon, primary, secondary, checked, setChecked, disabled }: SwitchItemProps) => (
    <ButtonBase onClick={() => setChecked(!checked)} disabled={disabled} sx={{ pl: .5 }}>
        <Checkbox
            checked={checked}
            onChange={() => setChecked(!checked)}
            disabled={disabled}
            disableRipple
        />
        <Icon icon={icon} />
        <TextBlock primary={primary} secondary={secondary} />
    </ButtonBase>
);

interface RadioItemProps<T> extends IconItemProps {
    name: string;
    value: T;
    selectedValue: T;
    setSelected: (value: T) => void;
    disabled?: boolean;
}

export const RadioItem = <T, >(
    {
        icon,
        primary,
        secondary,
        name,
        value,
        selectedValue,
        setSelected,
        disabled
    }: RadioItemProps<T>
) => (
    <ButtonBase onClick={() => setSelected(value)} disabled={disabled} sx={{ pl: .5 }}>
        <Radio
            name={name}
            value={value}
            checked={value === selectedValue}
            onChange={() => setSelected(value)}
            disabled={disabled}
            disableRipple
            sx={{ '&:hover': { backgroundColor: 'transparent' } }}
        />
        <Icon icon={icon} />
        <TextBlock primary={primary} secondary={secondary} />
    </ButtonBase>
);
