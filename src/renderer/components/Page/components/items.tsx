import {
    Box,
    ButtonBase as MuiButtonBase,
    buttonClasses,
    Checkbox,
    MenuItem,
    Radio,
    Select,
    styled,
    Switch,
    Theme,
    Typography
} from '@mui/material';
import React, { ReactNode } from 'react';

const containerStyled = (theme: Theme) => ({
    height: 50,
    padding: theme.spacing(.5, 1, .5, 1.5),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: theme.spacing(1),
    borderRadius: theme.shape.borderRadius,
    transition: theme.transitions.create(['background-color', 'box-shadow', 'border-color', 'color'], {
        duration: theme.transitions.duration.short
    })
});

export const ItemContainer = styled(Box)(({ theme }) => containerStyled(theme));

export const ItemButtonBase = styled(MuiButtonBase)(({ theme }) => ({
    ...containerStyled(theme),
    [`&.${buttonClasses.disabled}`]: {
        color: theme.palette.action.disabled
    },
    '&:hover': {
        background: theme.palette.action.hover
    }
}));

export interface ItemIconProps {
    icon?: ReactNode;
}

export interface ItemTextBlockProps {
    primary?: ReactNode;
    secondary?: ReactNode;
}

export const ItemIcon = ({ icon }: ItemIconProps) => icon ? (
    <Box sx={{ width: 42, height: 42, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        {icon}
    </Box>
) : null;

export const ItemFavicon = styled(
    Box,
    { shouldForwardProp: (prop) => prop !== 'src' }
)<{ src?: string; }>(({ src }) => ({
    width: 24,
    minWidth: 24,
    height: 24,
    minHeight: 24,
    backgroundImage: src ? `url('${src}')` : 'unset',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'contain'
}));

export const ItemTextBlock = ({ primary, secondary }: ItemTextBlockProps) => (
    <Box
        sx={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'center',
            overflow: 'hidden'
        }}
    >
        <Typography
            variant="body1"
            align="left"
            color="text.primary"
            sx={{
                width: '100%',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                userSelect: 'none'
            }}
        >
            {primary}
        </Typography>
        {secondary && <Typography
            variant="body2"
            align="left"
            color="text.secondary"
            sx={{
                width: '100%',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                userSelect: 'none'
            }}

        >
            {secondary}
        </Typography>}
    </Box>
);

const FormContainer = styled(Box)({
    marginLeft: 'auto'
});

interface SwitchItemProps extends ItemTextBlockProps, ItemIconProps {
    checked: boolean;
    setChecked: (checked: boolean) => void;
    disabled?: boolean;
}

export const SwitchItem = ({ icon, primary, secondary, checked, setChecked, disabled }: SwitchItemProps) => (
    <ItemButtonBase onClick={() => setChecked(!checked)} disabled={disabled} sx={{ pl: icon ? .5 : 1.5 }}>
        <ItemIcon icon={icon} />
        <ItemTextBlock primary={primary} secondary={secondary} />
        <FormContainer>
            <Switch
                checked={checked}
                onChange={() => setChecked(!checked)}
                disabled={disabled}
                disableRipple
                sx={{ '& .MuiSwitch-switchBase:hover': { backgroundColor: 'transparent !important' } }}
            />
        </FormContainer>
    </ItemButtonBase>
);

export const CheckItem = ({ icon, primary, secondary, checked, setChecked, disabled }: SwitchItemProps) => (
    <ItemButtonBase onClick={() => setChecked(!checked)} disabled={disabled} sx={{ pl: .5 }}>
        <Checkbox
            checked={checked}
            onChange={() => setChecked(!checked)}
            disabled={disabled}
            disableRipple
        />
        <ItemIcon icon={icon} />
        <ItemTextBlock primary={primary} secondary={secondary} />
    </ItemButtonBase>
);

interface RadioItemProps<T> extends ItemTextBlockProps, ItemIconProps {
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
    <ItemButtonBase onClick={() => setSelected(value)} disabled={disabled} sx={{ pl: .5 }}>
        <Radio
            name={name}
            value={value}
            checked={value === selectedValue}
            onChange={() => setSelected(value)}
            disabled={disabled}
            disableRipple
            sx={{ '&:hover': { backgroundColor: 'transparent' } }}
        />
        <ItemIcon icon={icon} />
        <ItemTextBlock primary={primary} secondary={secondary} />
    </ItemButtonBase>
);

interface SelectItemProps<T> extends ItemTextBlockProps, ItemIconProps {
    value: T;
    setSelected: (value: T) => void;
    choices: ({ value: T; children?: ReactNode; })[];
    disabled?: boolean;
}

export const SelectItem = <T, >(
    {
        icon,
        primary,
        secondary,
        value,
        setSelected,
        choices,
        disabled
    }: SelectItemProps<T>
) => (
    <ItemContainer sx={{ pl: icon ? .5 : 1.5, pr: 2 }}>
        <ItemIcon icon={icon} />
        <ItemTextBlock primary={primary} secondary={secondary} />
        <FormContainer>
            <Select
                value={value}
                onChange={(e) => setSelected(e.target.value as T)}
                disabled={disabled}
                size="small"
                sx={{ width: 200 }}
            >
                {choices.map((choice) => (
                    <MenuItem key={choice.value as unknown as string} value={choice.value as unknown as string}>
                        {choice.children}
                    </MenuItem>
                ))}
            </Select>
        </FormContainer>
    </ItemContainer>
);
