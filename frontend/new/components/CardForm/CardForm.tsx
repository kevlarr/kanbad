import { FocusEvent, useState } from 'react'

import { CardModel, CardParams } from '@/lib/models'
import css from './CardForm.module.css'

interface IProps {
  card: CardModel,
  submitForm(params: CardParams): any
  cancelSubmit(): any
}

export default function CardForm({
  card: { title, body },
  submitForm,
  cancelSubmit,
}: IProps) {
  const [params, setParams] = useState<CardParams>({ title, body })

  const value = (evt: FocusEvent) => (
    (evt.target as HTMLInputElement).value
  )

  const setTitle = (evt: FocusEvent) => setParams({
    ...params,
    title: value(evt),
  })

  const setBody = (evt: FocusEvent) => setParams({
    ...params,
    body: value(evt),
  })

  return (
    <form
      className={css.cardForm}
      onSubmit={async (evt) => {
        evt.preventDefault()
        return await submitForm(params)
      }}
    >
      <input
        type='text'
        className={css.titleInput}
        autoFocus={true}
        defaultValue={title}
        onBlur={setTitle}
      />
      <textarea
        className={css.bodyInput}
        defaultValue={body}
        onBlur={setBody}
      />
      <button
        type='submit'
        className='button sm submit'
      >
        Save
      </button>
      <button
        className='button sm cancel'
        onClick={cancelSubmit}
      >
        Cancel
      </button>
    </form>
  )
}
