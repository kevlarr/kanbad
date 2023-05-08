import { ComponentProps } from 'react'

import css from './Button.module.css'

type BaseProps = ComponentProps<'button'>

interface ButtonProps extends BaseProps {
  compact?: boolean,
  type?: 'submit' | 'reset' | 'button',
  variant?: 'filled' | 'outlined' | 'subtle',
}

export default function Button({
  children,
  compact,
  type = 'button',
  variant = 'filled',
  ...rest
}: ButtonProps) {
  return (
    <button
      className={`${css.button} ${css[variant]} ${compact && css.compact}`}
      type={type}
      {...rest}
    >
      {children}
    </button>
  )
}
