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
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from '../../Icons/arrow';
import { ExternalLink } from '../../Icons/state';

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
    [`&:hover, &.${buttonClasses.focusVisible}`]: {
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

export interface ItemDisabledProps {
    disabled?: boolean;
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

export const ItemFormContainer = styled(Box)({
    marginLeft: 'auto'
});

interface SwitchItemProps extends ItemTextBlockProps, ItemIconProps, ItemDisabledProps {
    checked: boolean;
    setChecked: (checked: boolean) => void;
}

export const SwitchItem = ({ icon, primary, secondary, checked, setChecked, disabled }: SwitchItemProps) => (
    <ItemButtonBase onClick={() => setChecked(!checked)} disabled={disabled} sx={{ pl: icon ? .5 : 1.5 }}>
        <ItemIcon icon={icon} />
        <ItemTextBlock primary={primary} secondary={secondary} />
        <ItemFormContainer>
            <Switch
                checked={checked}
                onChange={() => setChecked(!checked)}
                disabled={disabled}
                disableRipple
                tabIndex={-1}
                sx={{ '& .MuiSwitch-switchBase:hover': { backgroundColor: 'transparent !important' } }}
            />
        </ItemFormContainer>
    </ItemButtonBase>
);

export const CheckItem = ({ icon, primary, secondary, checked, setChecked, disabled }: SwitchItemProps) => (
    <ItemButtonBase onClick={() => setChecked(!checked)} disabled={disabled} sx={{ pl: .5 }}>
        <Checkbox
            checked={checked}
            onChange={() => setChecked(!checked)}
            disabled={disabled}
            disableRipple
            tabIndex={-1}
        />
        <ItemIcon icon={icon} />
        <ItemTextBlock primary={primary} secondary={secondary} />
    </ItemButtonBase>
);

interface RadioItemProps<T> extends ItemTextBlockProps, ItemIconProps, ItemDisabledProps {
    name: string;
    value: T;
    selectedValue: T;
    setSelected: (value: T) => void;
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
            tabIndex={-1}
            sx={{ '&:hover': { backgroundColor: 'transparent' } }}
        />
        <ItemIcon icon={icon} />
        <ItemTextBlock primary={primary} secondary={secondary} />
    </ItemButtonBase>
);

interface SelectItemProps<T> extends ItemTextBlockProps, ItemIconProps, ItemDisabledProps {
    value: T;
    setSelected: (value: T) => void;
    choices: ({ value: T; children?: ReactNode; })[];
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
        <ItemFormContainer>
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
        </ItemFormContainer>
    </ItemContainer>
);

interface LinkItemProps extends ItemTextBlockProps, ItemIconProps, ItemDisabledProps {
    href: string;
    route?: boolean;
}

export const LinkItem = (
    {
        icon,
        primary,
        secondary,
        href,
        route,
        disabled
    }: LinkItemProps
) => {
    const navigate = useNavigate();

    return (
        <ItemButtonBase
            onClick={() => route ? navigate(href) : window.location.href = href}
            disabled={disabled}
            sx={{ pl: icon ? .5 : 1.5 }}
        >
            <ItemIcon icon={icon} />
            <ItemTextBlock primary={primary} secondary={secondary} />
            <ItemFormContainer>
                <ItemIcon icon={route ? <ChevronRight /> : <ExternalLink />} />
            </ItemFormContainer>
        </ItemButtonBase>
    );
};

