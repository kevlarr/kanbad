import { ComponentProps } from 'react'

import { InputGroup } from '@/components/base'
import css from './TextArea.module.css'

type BaseProps = ComponentProps<'textarea'>

interface TextAreaProps extends BaseProps {
  error?: string | null,
  label?: string | null,
}

export default function TextArea({
  id,
  error,
  label,
  ...rest
}: TextAreaProps) {
  const classes = [
    css.textarea,
    error ? css.error : null,
  ]

  return (
    <InputGroup error={error} label={label}{...(id && {id})}>
      <textarea
        className={classes.join(' ')}
        {...(id && {id})}
        {...rest}
      ></textarea>
    </InputGroup>
  )
}
