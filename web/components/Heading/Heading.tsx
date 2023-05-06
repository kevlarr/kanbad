import { ReactNode, ComponentPropsWithoutRef } from 'react'
import css from './Heading.module.css'

type Level = 1 | 2 | 3 | 4 | 5 | 6

type BaseProps =
  ComponentPropsWithoutRef<'h1'> &
  ComponentPropsWithoutRef<'h2'> &
  ComponentPropsWithoutRef<'h3'> &
  ComponentPropsWithoutRef<'h4'> &
  ComponentPropsWithoutRef<'h5'> &
  ComponentPropsWithoutRef<'h6'>

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
  children?: ReactNode,
  level: Level,
}

export default function Text({
  children,
  level,
  ...rest
} : Props) {
  const Tag = headingTag(level)

  return (
    <Tag className={css.heading} {...rest} >
      {children}
    </Tag>
  )
}
