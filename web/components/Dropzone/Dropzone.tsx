import { ComponentProps, forwardRef } from 'react'

import css from './Dropzone.module.css'

type BaseProps = ComponentProps<'div'>

interface DropzoneProps extends BaseProps {
  active?: boolean,
}

const Dropzone = forwardRef<HTMLDivElement, DropzoneProps>(function Dropzone({
  active = false,
}, ref) {
  const classes = [
    css.dropzone,
    active ? css.active : null,
  ]

  return <div className={classes.join(' ')} ref={ref}></div>
})

export default Dropzone
