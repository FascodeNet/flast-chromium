import { getCurrentWindow } from '@electron/remote';
import { ipcRenderer } from 'electron';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { DefaultViewState, ViewState } from '../../interfaces/view';
import { useElectronAPI } from '../utils/electron';
import { setTabsBounds } from '../utils/tab';

export interface ViewManagerProps {
    selectedId: number;
    views: ViewState[];
    getCurrentViewState: () => ViewState;
    getViewState: (id: number) => ViewState | undefined;
    setSelectedId: (id: number) => void;

    tabContainerWidth: number;
    setTabContainerWidth: (width: number) => void;
}

export const ViewManagerContext = createContext<ViewManagerProps>({
    selectedId: -1,
    views: [],
    getCurrentViewState: () => DefaultViewState,
    getViewState: () => undefined,
    // tslint:disable-next-line:no-empty
    setSelectedId: () => {
    },

    tabContainerWidth: 0,
    // tslint:disable-next-line:no-empty
    setTabContainerWidth: () => {
    }
});

export const useViewManagerContext = () => useContext(ViewManagerContext);

interface ViewManagerProviderProps {
    children?: ReactNode;
}

export const ViewManagerProvider = ({ children }: ViewManagerProviderProps) => {
    const context = useContext(ViewManagerContext);

    const [selectedId, setSelectedId] = useState(context.selectedId);
    const [views, setViews] = useState(context.views);

    const [tabContainerWidth, setTabContainerWidth] = useState(context.tabContainerWidth);

    const getCurrentViewState = () => getViewState(selectedId) ?? DefaultViewState;
    const getViewState = (id: number) => views.find((view) => view.id === id);

    const windowId = getCurrentWindow().id;
    useEffect(() => {
        const { viewsApi } = useElectronAPI();

        viewsApi.getCurrentView().then((view) => setSelectedId(view.id));
        viewsApi.getViews().then((viewStates) => setViews(viewStates));
    }, []);

    useEffect(() => {
        ipcRenderer.on(`window-update-${windowId}`, (e) => {
            setTabsBounds(tabContainerWidth, views, false);
        });

        ipcRenderer.on(`views-${windowId}`, (e, states: ViewState[]) => {
            setViews(states);
            setTabsBounds(tabContainerWidth, states, false);
        });

        ipcRenderer.on(`view-${windowId}`, (e, state: ViewState) => {
            const viewStates = [...views];
            const viewStateIndex = viewStates.findIndex((viewState) => viewState.id === state.id);
            viewStates.splice(viewStateIndex, 1, state);
            setViews(viewStates);
            setTabsBounds(tabContainerWidth, viewStates, false);
        });

        ipcRenderer.on(`view-select-${windowId}`, (e, id: number) => {
            setSelectedId(id);
        });

        return () => {
            ipcRenderer.removeAllListeners(`window-update-${windowId}`);
            ipcRenderer.removeAllListeners(`views-${windowId}`);
            ipcRenderer.removeAllListeners(`view-${windowId}`);
            ipcRenderer.removeAllListeners(`view-select-${windowId}`);
        };
    }, [selectedId, views]);


    const value: ViewManagerProps = {
        selectedId,
        views,
        getCurrentViewState,
        getViewState,
        setSelectedId,

        tabContainerWidth,
        setTabContainerWidth
    };

    return (
        <ViewManagerContext.Provider value={value}>
            {children}
        </ViewManagerContext.Provider>
    );
};
