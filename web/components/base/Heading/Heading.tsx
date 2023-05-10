import { ComponentProps } from 'react'
import css from './Heading.module.css'

type Level = 1 | 2 | 3 | 4 | 5 | 6

type BaseProps =
  ComponentProps<'h1'> &
  ComponentProps<'h2'> &
  ComponentProps<'h3'> &
  ComponentProps<'h4'> &
  ComponentProps<'h5'> &
  ComponentProps<'h6'>

function headingTag(level: Level) {
  switch (level) {
    case 1: return 'h1'
    case 2: return 'h2'
    case 3: return 'h3'
    case 4: return 'h4'
    case 5: return 'h5'
    default: return 'h6'
  }
}

interface Props extends BaseProps {
  inline?: boolean,
  level: Level,
}

export default function Text({
  children,
  inline = false,
  level,
  ...rest
} : Props) {
  const Tag = headingTag(level)
  const classes = [
    css.heading,
    inline ? css.inline : null,
  ]

  return (
    <Tag className={classes.join(' ')} {...rest} >
      {children}
    </Tag>
  )
}
