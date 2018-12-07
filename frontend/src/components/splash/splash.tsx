import * as React from 'react';
import './splash.scss';

function createWorkspace() {
    fetch('/api/v1/workspaces/new', { method: 'POST' })
        .then(resp => resp.json())
        .then(({ identifier }) => {
            window.location.hash = `#/${identifier}`;
        });
}

export default () => (
    <div className='Splash'>
        <h2 className='welcome'>a <span className='hello'>hello</span> from twello!</h2>
        <p className='caption'>
            Workspaces give you places to make things like boards and cards... and magic!
            Create a new one or, if you're really lucky, get a friend to share a workspace with you.
        </p>
        <div className='create'>
            <button className='button' onClick={createWorkspace}>
                Create workspace
            </button>
        </div>
    </div>
);
