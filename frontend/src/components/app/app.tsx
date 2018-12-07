import * as React from 'react';
import router from '../../lib/router';
import Home from '../home';
import Workspace from '../workspace';
import './app.scss';

interface Props {
}

interface State {
    location: String;
}

export class App extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = { location: router.currentLocation() };
        window.addEventListener(
            'hashchange',
            () => this.setState({ location: router.currentLocation() }),
            false,
        );
    }

    renderMain() {
        switch (this.state.location) {
            case '': return <Home />;
            default: return <Workspace workspaceId={this.state.location} />;
        }
    }

    render() {
        return (
            <div className='App'>
                <header className='app-header'>
                    <a href='#/'>
                        <h1 className='app-name'>twello</h1>
                    </a>
                </header>
                <main className='app-main'>
                    {this.renderMain()}
                </main>
            </div>
        );
    }
}

export default App;
