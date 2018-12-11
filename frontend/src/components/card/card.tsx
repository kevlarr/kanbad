import * as React from 'react';
import { CardModel, updateCard, deleteCard } from '../../lib/store';
import twelloApi from '../../lib/api';
import './card.scss';

interface Props {
    card: CardModel;
}

interface State {
    editing: boolean;
    bodyValue: string;
    titleValue: string;
}

export class Card extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            editing: false,
            bodyValue: props.card.body,
            titleValue: props.card.title,
        };
    }

    edit() {
        this.setState({ editing: true });
    }

    delete() {
        twelloApi
            .delete(`cards/${this.props.card.identifier}`)
            .then(() => deleteCard(this.props.card));
    }

    save() {
        const card = this.props.card;
        const { bodyValue: body, titleValue: title } = this.state;

        if (title !== card.title || body !== card.body) {
            twelloApi
                // Need to strip out "board: <uuid>" from card...
                .put(`cards/${card.identifier}`, {
                    identifier: card.identifier,
                    title,
                    body,
                })
                .then(card => updateCard(card));
        }

        this.setState({ editing: false });
    }

    cancel() {
        this.setState({
            editing: false,
            bodyValue: this.props.card.body,
            titleValue: this.props.card.title,
        });
    }

    renderContent() {
        if (this.state.editing) {
            return (
                <form className='card-form'>
                    <input
                        type='text'
                        autoFocus={true}
                        className='title-input'
                        defaultValue={this.props.card.title}
                        onBlur={(evt) => this.setState({ titleValue: evt.target.value })}
                    />
                    <textarea
                        className='body-input'
                        defaultValue={this.state.bodyValue}
                        placeholder='Give the card some details...'
                        onBlur={(evt) => this.setState({ bodyValue: evt.target.value })}
                    />
                    <button
                        type='submit'
                        className='button sm save'
                        onClick={() => this.save()}
                    >Save</button>
                    <button
                        className='button sm cancel'
                        onClick={() => this.cancel()}
                    >Cancel</button>
                </form>
            );
        }

        return (
            <div className='card-content'>
                <h4 className='card-title'>{this.props.card.title}</h4>
                <p className='card-body'>{this.props.card.body}</p>
                <div className='card-edit'>
                    <a onClick={() => this.edit()}>Edit</a>
                    <a onClick={() => this.delete()}>Delete</a>
                </div>
            </div>
        );
    }

    render() {
        return (
            <div className='Card'>
                <div className='card-pin'></div>
                {this.renderContent()}
            </div>
        );
    }
}

export default Card;
