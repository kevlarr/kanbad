import * as React from 'react';
import router from '../../lib/router';

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

        return (
            <h2>workspace {this.props.workspaceId}</h2>
        );
    }
}

export default Workspace;
