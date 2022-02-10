import { getCurrentWindow } from '@electron/remote';
import { Divider } from '@mui/material';
import { ipcRenderer } from 'electron';
import React, { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from 'react';
import { FindState } from '../../../../../../interfaces/view';
import { Remove } from '../../../../../components/Icons';
import { ArrowDown, ArrowUp } from '../../../../../components/Icons/arrow';
import { useViewManagerContext } from '../../../../../contexts/view';
import { useElectronAPI } from '../../../../../utils/electron';
import { StyledButton, StyledContainer, StyledInput, StyledLabel, StyledPanel } from './styles';

export const Panel = () => {
    const { findInPage, moveFindInPage, stopFindInPage } = useElectronAPI();
    const { selectedId, getCurrentViewState } = useViewManagerContext();

    const [value, setValue] = useState('');
    const [state, setState] = useState<FindState | undefined>(undefined);

    const viewState = getCurrentViewState();
    useEffect(() => {
        console.log('useEffect', viewState);
        setState(viewState.findState);
    }, []);

    useEffect(() => {
        const windowId = getCurrentWindow().id;
        ipcRenderer.on(`view-find-${windowId}`, (e, id: number, state: FindState) => {
            console.log(id, selectedId, state);
            if (id != selectedId) return;

            setState(state);
        });

        return () => {
            ipcRenderer.removeAllListeners(`view-find-${windowId}`);
        };
    }, [selectedId]);

    const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const text = e.target.value;
        setValue(e.target.value);

        if (text === '') {
            await stop(false);
        } else {
            const state = await findInPage(selectedId, text, false);
            setState(state);
        }
    };

    const handleKeyPress = async (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key !== 'Enter') return;
        await move(!e.shiftKey);
    };

    const handleKeyDown = async (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key !== 'Escape') return;
        await stop(true);
    };

    const move = async (forward: boolean) => {
        const state = await moveFindInPage(selectedId, forward);
        setState(state);
    };

    const stop = async (hide: boolean) => {
        setValue('');
        await stopFindInPage(selectedId, hide);
        setState(undefined);
    };

    const ref = useRef<HTMLInputElement>(null);
    useEffect(() => {
        ref.current?.focus();
    }, []);

    return (
        <StyledPanel className="panel">
            <StyledContainer>
                <StyledInput
                    ref={ref} type="text" value={value}
                    onChange={handleChange} onKeyPress={handleKeyPress} onKeyDown={handleKeyDown}
                />
                <StyledLabel>{state ? `${state.index} / ${state.matches}` : '0 / 0'}</StyledLabel>
            </StyledContainer>
            <Divider orientation="vertical" flexItem sx={{ margin: '6px 4px' }} />
            <StyledButton onClick={() => move(false)}>
                <ArrowUp />
            </StyledButton>
            <StyledButton onClick={() => move(true)}>
                <ArrowDown />
            </StyledButton>
            <StyledButton onClick={() => stop(true)}>
                <Remove />
            </StyledButton>
        </StyledPanel>
    );
};
