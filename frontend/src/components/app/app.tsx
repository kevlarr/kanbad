import * as React from 'react';
import { connect } from 'react-redux';
import { ApplicationState, WorkspaceModel, createWorkspace, clearStore } from '../../lib/store';
import router from '../../lib/router';
import Home from '../home';
import Workspace from '../workspace';
import './app.scss';

// TODO kvlr: better location for this
function loadWorkspace(identifier: string) {
    fetch(`/api/v1/workspaces/${identifier}`)
        .then(resp => {
            if (resp.status !== 200) {
                throw new Error(`${resp.status} ${resp.statusText}`);
            }

            return resp.json();
        })
        .then(workspace => createWorkspace(workspace))
        .catch(err => router.updateLocation(''));
}

class BaseApp extends React.Component<ApplicationState, {}> {
    constructor(props: ApplicationState) {
        super(props);

        // If page is loaded with workspace identifier, strip it,
        // assign event listener, and trigger change
        const identifier = router.currentLocation();

        if (identifier) {
            router.updateLocation('');
        }

        window.addEventListener('hashchange', this.handlePathChange.bind(this), false);

        if (identifier) {
            router.updateLocation(identifier);
            //loadWorkspace(identifier);
        }
    }

    handlePathChange() {
        const location = router.currentLocation();

        if (!location) {
            clearStore();
        } else if (location && !this.props.workspace) {
            loadWorkspace(location);
        }
    }

    updateLocation() {
        const location = router.currentLocation();

        if (this.props.workspace && !location) {
            router.updateLocation(this.props.workspace.identifier);
        }
    }

    renderMain() {
        if (!this.props.workspace) {
            return (
                <Home />
            );
        }

        const { boards, workspace} = this.props;

        return (<Workspace
            boards={Object.keys(boards).map(k => boards[k])}
            workspace={workspace}
        />);
    }

    render() {
        console.log('Render APP');
        this.updateLocation();

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

const stateToProps = (state: ApplicationState) => ({ ...state });

export const App = connect(stateToProps)(BaseApp);

export default App;
