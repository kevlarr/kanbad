import { ChangeEvent, FocusEvent, SyntheticEvent, useState } from 'react'
import { Button, Group, Stack, TextInput, Textarea } from '@mantine/core'
import { useForm } from '@mantine/form'

import { CardModel, CardParams } from '@/lib/models'

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
      <Stack>
        <TextInput
          autoFocus={true}
          label="Title"
          placeholder="Look into that thing"
          withAsterisk
          {...form.getInputProps('title')}
        />

        <Textarea
          autosize
          label="Body"
          maxRows={8}
          minRows={4}
          placeholder="That thing would be really helpful to learn more about, so here's what I should do..."
          {...form.getInputProps('body')}
        />

        <Group position="center" spacing="xl">
          <Button
            { ...( !form.isValid() && { "data-disabled": true } ) }
            size="xs"
            type='submit'
            variant="subtle"
            compact
          >
            Save
          </Button>

          <Button
            compact
            color="gray"
            size="xs"
            variant="subtle"
            onClick={cancelSubmit}
          >
            Cancel
          </Button>
        </Group>
      </Stack>
    </form>
  )
}
