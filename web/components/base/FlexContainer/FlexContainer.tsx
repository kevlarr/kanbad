import { ComponentProps } from 'react'

import css from './FlexContainer.module.css'

type BaseProps = ComponentProps<'div'>

interface FlexContainerProps extends BaseProps {
  direction?: 'row' | 'column',
  gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | null,
  pad?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | null,
}

export default function FlexContainer({
  children,
  className,
  direction = 'row',
  gap = null,
  pad = null,
  ...rest
}: FlexContainerProps) {
  const classes = [
    className,
    css.flexContainer,
    css[direction],
    gap && css[`gap${gap}`],
    pad && css[`pad${pad}`],
  ]

  return (
    <div className={classes.join(' ')} {...rest}>
      {children}
    </div>
  )
}
