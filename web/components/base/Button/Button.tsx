import { ComponentProps } from 'react'

import css from './Button.module.css'

type BaseProps = ComponentProps<'button'>

interface ButtonProps extends BaseProps {
  compact?: boolean,
  size?: 'sm' | 'md',
  type?: 'submit' | 'reset' | 'button',
  variant?: 'filled' | 'outlined' | 'subtle',
  warn?: boolean,
}

export default function Button({
  children,
  compact = false,
  size = 'md',
  type = 'button',
  variant = 'filled',
  warn = false,
  ...rest
}: ButtonProps) {
  const classes = [
    css.button,
    css[variant],
    css[size],
    compact ? css.compact : null,
    warn ? css.warn : null,
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
