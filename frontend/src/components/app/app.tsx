import * as React from 'react';
import Splash from '../splash';
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

        this.state = { location: this.parseRoute() };
        window.addEventListener(
            'hashchange',
            () => this.setState({ location: this.parseRoute() }),
            false,
        );
    }

    parseRoute(): String {
        return window.location.hash.replace(/^#\/?/, '');
    }

    route() {
        switch (this.state.location) {
            case '': return <Splash />;
            default: return <Workspace workspaceId={this.state.location} />;
        }
    }

    render() {
        return (
            <div className='App'>
                <header className='app-header'>
                    <h1 className='app-name'>twello</h1>
                </header>
                <main className='app-main'>
                    {this.route()}
                </main>
            </div>
        );
    }
}

export default App;
