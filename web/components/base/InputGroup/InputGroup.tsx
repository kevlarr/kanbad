import { ComponentProps } from 'react'

import { FlexContainer, Text } from '@/components/base'
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
    <FlexContainer direction='column' gap='xs' {...rest}>
      {label &&
        <label className={css.label} {...(id && {htmlFor: id})}>{label}</label>
      }
      {/* Wrap in a flex container so the child input stretches with `flex: 1` */}
      <FlexContainer className={css.input}>
        {children}
      </FlexContainer>
      {error &&
        <Text size='sm' warn >{error}</Text>
      }
    </FlexContainer>
  )
}
