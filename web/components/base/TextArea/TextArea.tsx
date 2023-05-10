import { ComponentProps } from 'react'

import { InputGroup } from '@/components/base'
import css from './TextArea.module.css'

type BaseProps = ComponentProps<'textarea'>
type Resize = 'x' | 'y' | 'xy' | null

interface TextAreaProps extends BaseProps {
  error?: string | null,
  label?: string | null,
  resize?: 'x' | 'y' | 'xy' | null,
}

export default function TextArea({
  id,
  error,
  label,
  resize,
  ...rest
}: TextAreaProps) {

  const classes = [
    css.textarea,
    error && css.error,
    resize && {
      x: css.resizeX,
      y: css.resizeY,
      xy: css.resizeXY
    }[resize]
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
