import * as React from 'react';
import { WorkspaceModel, createWorkspace } from '../../lib/store';
import twelloApi from '../../lib/api';
import './home.scss';

const clickCreate = () => twelloApi
    .post('workspaces/new', {})
    .then(workspace => createWorkspace(workspace));

export default () => (
    <div className='Home'>
        <h2 className='welcome'>a <span className='hello'>hello</span> from twello!</h2>
        <p className='caption'>
            Workspaces give you places to make things like boards and cards... and magic!
            Create a new one or, if you're really lucky, get a friend to share a workspace with you.
        </p>
        <div className='create'>
            <button className='button' onClick={clickCreate}>
                Create workspace
            </button>
        </div>
    </div>
);
