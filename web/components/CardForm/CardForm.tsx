import { ChangeEvent, SyntheticEvent, useState } from 'react'

import { CardModel, CardParams } from '@/lib/models'
import { Button, TextArea, TextInput } from '@/components/base'

type Event = ChangeEvent<HTMLTextAreaElement | HTMLInputElement>

interface CardFormProps {
  card: CardModel,
  submitForm(params: CardParams): any,
  cancelSubmit(): any,
}

interface FormValues {
  title: string,
  body: string,
}

interface FormErrors {
  title: string | null,
}

export default function CardForm({
  card: { title, body },
  submitForm,
  cancelSubmit,
}: CardFormProps) {
  // TODO: Abstract form handling & validation into a more generalized utility
  const [formValues, setFormValues] = useState<FormValues>({
    title,
    body: body || '',
  })
  const [formErrors, setFormErrors] = useState<FormErrors>({
    title: null,
  })

  function setTitle(evt: Event) {
    const { value } = evt.target

    setFormValues({
      ...formValues,
      title: value,
    })
    setFormErrors({
      title: value ? null : 'A title would be helpful',
    })
  }

  function setBody(evt: Event) {
    const { value } = evt.target

    setFormValues({
      ...formValues,
      body: value,
    })
  }

  function isValid() {
    return !formErrors.title
  }

  async function onSubmit(evt: SyntheticEvent) {
    evt.preventDefault()

    if (isValid()) {
      return await submitForm(formValues)
    }
  }

  return (
    <form onSubmit={onSubmit}>
      <TextInput
        autoFocus={true}
        label='Title'
        value={formValues.title}
        error={formErrors.title}
        id='asdf'
        placeholder='Look into that thing'
        onChange={setTitle}
        onBlur={setTitle}
      />
      <TextArea
        label='Body'
        placeholder='Something something here...'
        value={formValues.body}
        onChange={setBody}
      />
      <Button
        { ...( !isValid() && { disabled: true } ) }
        size='sm'
        type='submit'
      >
        Save
      </Button>
      <Button
        size='sm'
        variant='outlined'
        onClick={cancelSubmit}
      >
        Cancel
      </Button>
    </form>
  )
}
