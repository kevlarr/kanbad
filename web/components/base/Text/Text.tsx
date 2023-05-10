import { ComponentProps } from 'react'
import css from './Text.module.css'

// Pretty sure that `p` and `span` both have the same standard props,
// but intersect just to be safe?
// (See: https://react.dev/reference/react-dom/components/common)
type BaseProps = ComponentProps<'p'> & ComponentProps<'span'>

interface Props extends BaseProps {
  inline?: boolean,
  size?: 'sm' | 'md',
  strong?: boolean,
  warn?: boolean,
}

export default function Text({
  children,
  className,
  inline = false,
  size = 'md',
  strong = false,
  warn = false,
  ...rest
} : Props) {
  const Tag = inline ? 'span' : 'p'
  let inner = children

  if (strong) {
    inner = <strong>{inner}</strong>
  }

  const classes = [
    className,
    css.text,
    css[size],
    warn ? css.warn : null,
  ]

  return (
    <Tag className={classes.join(' ')} {...rest} >
      {inner}
    </Tag>
  )
}
