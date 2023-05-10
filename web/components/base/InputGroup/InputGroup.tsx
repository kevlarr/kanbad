import { ComponentProps } from 'react'

import { Text } from '@/components/base'
import css from './InputGroup.module.css'

type BaseProps = ComponentProps<'div'>

interface InputGroupProps extends BaseProps {
  error?: string | null,
  label?: string | null,
}

export default function InputGroup({
  id,
  children,
  error,
  label = null,
  ...rest
}: InputGroupProps) {
  return (
    <div className={css.inputGroup} {...rest}>
      {label &&
        <label className={css.label} {...(id && {htmlFor: id})}>{label}</label>
      }
      {children}
      {error &&
        <Text className={css.error} size='sm' warn >{error}</Text>
      }
    </div>
  )
}
