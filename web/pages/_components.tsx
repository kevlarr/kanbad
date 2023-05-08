import {
  Button,
  Heading,
  Text,
 } from '@/components/base'

export default function Components() {
  const headings = [1, 2, 3, 4, 5, 6].map((level) => (
    <Heading key={level} level={level as any}>Heading Level {level}</Heading>
  ))

  const buttons = [
    <Button>Default Button</Button>,
    <Button variant='filled'>Filled Button</Button>,
    <Button variant='outlined'>Outlined Button</Button>,
    <Button variant='subtle'>Subtle Button</Button>,
    <Button compact variant='filled'>Filled Compact</Button>,
    <Button compact variant='outlined'>Outlined Compact</Button>,
    <Button compact variant='subtle'>Subtle Compact</Button>,
  ].map((button, i) => (
    <div key={i} style={{margin: '1rem 0'}}>{button}</div>
  ))

  return (
    <>
      {headings}
      <Text>
        Quite possible. We live long and are celebrated poopers. How much did you make me?
        You know, I was God once. Dr. Zoidberg, that doesn't make sense. But, okay!
        Ok, we'll go deliver this crate like professionals, and then we'll go ride the bumper cars.
      </Text>
      <Text strong>These are some strong words, eh?</Text>
      <Text>
        This is some text with some
        {' '}<Text inline strong>strong, inline word</Text>{' '}
        . Pretty neat, huh?
      </Text>
      {buttons}
    </>
  )
}
