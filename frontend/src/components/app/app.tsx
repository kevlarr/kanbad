import * as React from 'react';
import './app.scss';

interface Props {}

export const App = (props: Props) => (
    <div className='App'>
        <header className='app-header'>
            <h1 className='app-name'>twello</h1>
        </header>
        <main className='app-main'>
            <h2>hey, make stuff!</h2>
        </main>
    </div>
);

export default App;
