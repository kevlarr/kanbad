import * as React from 'react';

interface Props {
    workspaceId: String;
}

interface State {
}

export class Workspace extends React.Component<Props, State> {
    render() {
        return (
            <h2>workspace {this.props.workspaceId}</h2>
        );
    }
}

export default Workspace;
