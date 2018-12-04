import * as React from 'react';
import './hello.scss';

export interface Props {
    compiler: string;
    framework: string;
}

export const Hello = (props: Props) => (
    <div className='Hello'>
        <h1 className='header'>¡Hola, mundo!</h1>
        <p className='welcome-text'>Welcome to {props.framework} feat. {props.compiler}</p>
    </div>
);

export default Hello;
