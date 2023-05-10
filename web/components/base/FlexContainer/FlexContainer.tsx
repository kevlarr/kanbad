import { ComponentProps } from 'react'

import css from './FlexContainer.module.css'

type BaseProps = ComponentProps<'div'>

interface FlexContainerProps extends BaseProps {
  direction?: 'row' | 'column',
  gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | null,
}

export default function FlexContainer({
  children,
  className,
  direction = 'row',
  gap = null,
  ...rest
}: FlexContainerProps) {
  const classes = [
    className,
    css.flexContainer,
    gap && css[gap],
    css[direction],
  ]

  return (
    <div className={classes.join(' ')} {...rest}>
      {children}
    </div>
  )
}
