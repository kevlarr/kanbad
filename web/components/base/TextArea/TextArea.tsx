import { ComponentProps } from 'react'

import { InputGroup } from '@/components/base'
import css from './TextArea.module.css'

type BaseProps = ComponentProps<'textarea'>
type Resize = 'x' | 'y' | 'xy' | null

interface TextAreaProps extends BaseProps {
  error?: string | null,
  label?: string | null,
  resize?: boolean,
}

export default function TextArea({
  id,
  error,
  label,
  resize = false,
  ...rest
}: TextAreaProps) {

  const classes = [
    css.textarea,
    error && css.error,
    resize && css.resize,
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
