import { ComponentProps } from 'react'

import css from './Button.module.css'

type BaseProps = ComponentProps<'button'>

interface ButtonProps extends BaseProps {
  compact?: boolean,
  danger?: boolean,
  size?: 'sm' | 'md',
  type?: 'submit' | 'reset' | 'button',
  variant?: 'filled' | 'outlined' | 'subtle',
}

export default function Button({
  children,
  compact = false,
  danger = false,
  size = 'md',
  type = 'button',
  variant = 'filled',
  ...rest
}: ButtonProps) {
  const classes = [
    css.button,
    css[variant],
    css[size],
    compact ? css.compact : null,
    danger ? css.danger : null,
  ]

  return (
    <button
      className={classes.join(' ')}
      type={type}
      {...rest}
    >
      {children}
    </button>
  )
}
