import { ComponentProps, useState } from 'react'

import { InputGroup } from '@/components/base'
import css from './TextInput.module.css'

type BaseProps = ComponentProps<'input'>

interface TextInputProps extends BaseProps {
  error?: string | null,
  label?: string | null,
}

export default function TextInput({
  id,
  error,
  label,
  ...rest
}: TextInputProps) {
  const classes = [
    css.input,
    error ? css.error : null,
  ]

  return (
    <InputGroup error={error} label={label}{...(id && {id})}>
      <input
        className={classes.join(' ')}
        type='text'
        {...(id && {id})}
        {...rest}
      />
    </InputGroup>
  )
}
