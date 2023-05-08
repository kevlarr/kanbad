import { ComponentProps } from 'react'

import css from './Button.module.css'

type BaseProps = ComponentProps<'button'>

// FIXME: This is allowing passing arbitrary params (eg: `color='gray'` when switching
// from Mantine button to this) that get converted to HTML attributes
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
