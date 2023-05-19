import { ComponentProps, forwardRef } from 'react'

import css from './Dropzone.module.css'

type BaseProps = ComponentProps<'div'>

interface DropzoneProps extends BaseProps {
  active?: boolean,
  alwaysExpand?: boolean,
}

const Dropzone = forwardRef<HTMLDivElement, DropzoneProps>(function Dropzone({
  active = false,
  alwaysExpand = false,
}, ref) {
  const classes = [
    css.dropzone,
    active ? css.active : null,
    alwaysExpand ? css.expanded : null,
  ]

  return <div className={classes.join(' ')} ref={ref}></div>
})

export default Dropzone
