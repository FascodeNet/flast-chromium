import { FunctionComponentElement } from 'react';
import ReactDOM from 'react-dom';

export const render = (component: FunctionComponentElement<any> | Array<FunctionComponentElement<any>>) => {
    ReactDOM.render(component, document.getElementById('app'));
};
