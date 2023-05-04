/**
 * `App` is responsible for..
 *   - Main layout of application
 *   - Subscribing to store and passing data down
 *   - Tying the "routing" in with the store changes
 */

import * as React from 'react';
import { connect } from 'react-redux';
import { ApplicationState, BoardModel, WorkspaceModel, createWorkspace, createBoards, createCards, clearStore } from '../../lib/store';
import twelloApi from '../../lib/api';
import router from '../../lib/router';
import Home from '../home';
import Workspace from '../workspace';
import './app.scss';


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
        }
    }

    handlePathChange() {
        const location = router.currentLocation();

        // FUTURE
        // This does not handle switching between workspace identifiers,
        // but that isn't really a supported feature yet
        if (!location) {
            clearStore();
        } else if (location && !this.props.workspace) {
            // Make sure the workspace exists before trying to get boards
            twelloApi
                .get(`workspaces/${location}`)
                .then(workspace => createWorkspace(workspace))
                .then(() => twelloApi.get(`boards?workspace=${location}`))
                .then(boards => {
                    createBoards(boards);
                    boards.forEach((board: BoardModel) => twelloApi
                        .get(`cards?board=${board.identifier}`)
                        .then(cards => createCards(cards))
                    );
                })
                .catch(err => {
                    console.error(err);
                    router.updateLocation('');
                });
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

        // Convert id/model maps to arrays
        const { boards, cards, workspace} = this.props;

        return (<Workspace
            boards={Object.keys(boards).map(k => boards[k])}
            cards={Object.keys(cards).map(k => cards[k])}
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
