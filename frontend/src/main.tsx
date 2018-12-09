import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import App from './components/app';
import { STORE } from './lib/store';
import './style.scss';

ReactDOM.render(
    <Provider store={STORE}>
        <App />,
    </Provider>,
    document.getElementById('root')
);
