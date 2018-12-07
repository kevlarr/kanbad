import * as React from 'react';
import router from '../../lib/router';
import Board from '../board';
import './workspace.scss';

function loadWorkspace(workspaceId: String) {
    fetch(`/api/v1/workspaces/${workspaceId}`)
        .then(resp => {
            if (resp.status !== 200) {
                router.transitionTo('');
                return;
            }

            return resp.json();
        })
        .then(json => {
            console.log(json);
        });
}

interface Props {
    workspaceId: String;
}

interface State {
}

export class Workspace extends React.Component<Props, State> {
    render() {
        // TODO: This belongs elsewhere and causes a "flicker" on bad identifier.
        // Plus, the JSON isn't used.. yet
        loadWorkspace(this.props.workspaceId);

        const boards = [
            <Board key='board-1' title='TODO' />,
            <Board key='board-2' title='Done' />,
        ];

        return (
            <div className='Workspace'>
                <div className='workspace-meta'>
                    <button className='button add-board'>+ Add Board</button>
                    <h2 className='workspace-identifier'>Workspace #{this.props.workspaceId}</h2>
                    <p className='workspace-disclaimer'>Make sure to <strong><span className='star'>★</span>bookmark</strong> this page. While the workspace won't go anywhere, losing the address means you won't go here again.</p>
                </div>
                <div className='workspace-boards'>
                    {...boards}
                </div>
            </div>
        );
    }
}

export default Workspace;
