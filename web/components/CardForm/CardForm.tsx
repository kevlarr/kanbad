import { ChangeEvent, SyntheticEvent, useState } from 'react'

import { CardModel, CardParams } from '@/lib/models'
import { Button, FlexContainer, TextArea, TextInput } from '@/components/base'

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
      <FlexContainer direction='column' gap='md'>
        <TextInput
          autoFocus={true}
          label='Title'
          defaultValue={formValues.title}
          error={formErrors.title}
          id='asdf'
          placeholder='Look into that thing'
          onChange={setTitle}
          onBlur={setTitle}
        />
        <TextArea
          label='Body'
          placeholder='Something something here...'
          resize='y'
          rows={5}
          defaultValue={formValues.body}
          onChange={setBody}
        />
        <FlexContainer gap='md'>
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
        </FlexContainer>
      </FlexContainer>
    </form>
  )
}
