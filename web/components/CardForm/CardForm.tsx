import { ChangeEvent, FocusEvent, SyntheticEvent, useState } from 'react'
import { TextInput as MantineInput, Textarea as MantineTextarea } from '@mantine/core'
import { useForm } from '@mantine/form'

import { CardModel, CardParams } from '@/lib/models'
import { Button, TextArea, TextInput } from '@/components/base'

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
  const form = useForm({
    initialValues: {
      title,
      body: body ?? '',
    },
    validate: {
      title: (value) => value ? null : 'A title would be helpful',
    },
    validateInputOnChange: true,
    validateInputOnBlur: true,
  });

  async function onSubmit(evt: SyntheticEvent) {
    evt.preventDefault()

    if (form.isValid()) {
      return await submitForm(form.values)
    }
  }

  return (
    <form onSubmit={onSubmit}>
      <MantineInput
        label='Title'
        placeholder='Look into that thing'
        withAsterisk
        {...form.getInputProps('title')}
      />

      <TextInput
        autoFocus={true}
        label='Title'
        id='asdf'
        placeholder='Look into that thing'
      />
      <MantineTextarea
        autosize
        label='Body'
        maxRows={8}
        minRows={4}
        placeholder='Something something here...'
        {...form.getInputProps('body')}
      />
      <TextArea
        label='Body'
        placeholder='Something something here...'
      />
      <Button
        { ...( !form.isValid() && { 'data-disabled': true } ) }
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
