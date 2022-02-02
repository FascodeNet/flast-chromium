export type ResultType = 'suggest' | 'address' | 'calculator';

export interface Result {
    type: ResultType;
    label: string;
    url?: string;
    favicon?: string;
    data: SuggestData;
}

export type SuggestType = 'query' | 'calculator' | string;

export interface SuggestData {
    value: string;
    type: SuggestType;
}
