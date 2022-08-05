import React, { KeyboardEvent, MouseEvent, useEffect, useState } from 'react';
import { SearchEngine } from '../../../../../../interfaces/user';
import { ResultData } from '../../../../../../main/utils/search';
import { useViewManagerContext } from '../../../../../contexts/view';
import { useElectronAPI } from '../../../../../utils/electron';
import { ResultType } from '../../interface';
import { ResultPanel } from '../ResultPanel';
import { SearchPanel } from '../SearchPanel';
import { StyledContainer } from './styles';

const filter = (array: ResultData[]) => array.filter((data, i) => array.findIndex(
    ({ title, url }) => title === data.title || url === data.url
) === i);

export const Popup = () => {

    const { getCurrentView, addView, loadView } = useElectronAPI();
    const { selectedId } = useViewManagerContext();

    const [value, setValue] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [results, setResults] = useState<ResultData[]>([]);

    const [type, setType] = useState<ResultType>('suggest');
    const [engine, setEngine] = useState<SearchEngine | undefined>(undefined);

    const viewState = getCurrentView();
    useEffect(() => {
        (async () => {
            setValue(decodeURIComponent((await viewState)?.url ?? ''));
        })();
    }, []);

    const addOrLoadView = async (e: KeyboardEvent<HTMLInputElement> | MouseEvent<HTMLDivElement>, url: string) => {
        if (e.shiftKey) {
            await addView(url, true);
        } else {
            await loadView(selectedId, url);
        }
    };

    return (
        <StyledContainer>
            <SearchPanel
                value={value}
                setValue={setValue}
                selectedIndex={selectedIndex}
                setSelectedIndex={setSelectedIndex}
                data={results}
                setData={setResults}
                type={type}
                setType={setType}
                engine={engine}
                setEngine={setEngine}
                addOrLoadView={addOrLoadView}
            />
            <ResultPanel
                value={value}
                selectedIndex={selectedIndex}
                data={results}
                engine={engine}
                addOrLoadView={addOrLoadView}
            />
        </StyledContainer>
    );
};
