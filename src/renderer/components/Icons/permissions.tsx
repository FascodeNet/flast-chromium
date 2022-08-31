import {
    ContentPasteOffOutlined,
    ContentPasteOutlined,
    DeveloperBoardOffOutlined,
    DeveloperBoardOutlined,
    Mouse,
    MouseOutlined,
    OpenInNewOffOutlined,
    OpenInNewOutlined,
    PhonelinkOffOutlined,
    PhonelinkOutlined,
    PianoOffOutlined,
    PianoOutlined,
    SensorsOffOutlined,
    SensorsOutlined,
    VideogameAssetOffOutlined,
    VideogameAssetOutlined
} from '@mui/icons-material';
import React, { ReactNode } from 'react';
import { PermissionType } from '../../../main/session/permission';
import { Camera, CameraOff, Microphone, MicrophoneOff, Notification, NotificationOff, Place, PlaceOff } from './index';

export interface IconProps {
    enabled: ReactNode;
    disabled: ReactNode;
}

export const PermissionIcons: Record<PermissionType, IconProps> = {
    geolocation: {
        enabled: (<Place />),
        disabled: (<PlaceOff />)
    },
    camera: {
        enabled: (<Camera />),
        disabled: (<CameraOff />)
    },
    microphone: {
        enabled: (<Microphone />),
        disabled: (<MicrophoneOff />)
    },
    notifications: {
        enabled: (<Notification />),
        disabled: (<NotificationOff />)
    },
    sensors: {
        enabled: (<SensorsOutlined />),
        disabled: (<SensorsOffOutlined />)
    },
    midi: {
        enabled: (<PianoOutlined />),
        disabled: (<PianoOffOutlined />)
    },
    hid: {
        enabled: (<VideogameAssetOutlined />),
        disabled: (<VideogameAssetOffOutlined />)
    },
    serial: {
        enabled: (<DeveloperBoardOutlined />),
        disabled: (<DeveloperBoardOffOutlined />)
    },
    idle_detection: {
        enabled: (<PhonelinkOutlined />),
        disabled: (<PhonelinkOffOutlined />)
    },
    clipboard: {
        enabled: (<ContentPasteOutlined />),
        disabled: (<ContentPasteOffOutlined />)
    },
    pointer_lock: {
        enabled: (<Mouse />),
        disabled: (<MouseOutlined />)
    },
    open_external: {
        enabled: (<OpenInNewOutlined />),
        disabled: (<OpenInNewOffOutlined />)
    }
};
