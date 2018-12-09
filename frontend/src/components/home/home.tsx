import * as React from 'react';
import { WorkspaceModel, createWorkspace } from '../../lib/store';
import './home.scss';

// TODO kvlr: better location for this
function createAndLoad() {
    fetch('/api/v1/workspaces/new', { method: 'POST' })
        .then(resp => {
            if (resp.status !== 200) {
                throw new Error(`${resp.status} ${resp.statusText}`);
            }

            return resp.json();
        })
        .then(workspace => createWorkspace(workspace))
        .catch(err => console.log(err));
}

export default () => (
    <div className='Home'>
        <h2 className='welcome'>a <span className='hello'>hello</span> from twello!</h2>
        <p className='caption'>
            Workspaces give you places to make things like boards and cards... and magic!
            Create a new one or, if you're really lucky, get a friend to share a workspace with you.
        </p>
        <div className='create'>
            <button className='button' onClick={createAndLoad}>
                Create workspace
            </button>
        </div>
    </div>
);
