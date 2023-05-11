import {
  Button,
  FlexContainer,
  Heading,
  InputGroup,
  Text,
  TextInput,
  TextArea,
 } from '@/components/base'

export default function Components() {
  const colorSquare = (color: string) => (
    <div key={color} style={{
      backgroundColor: `var(--${color})`,
      height: '50px',
      width: '50px',
    }}></div>
  )
  const auroraSquares = [11, 12, 13, 14, 15].map((num) => (
    colorSquare(`nord${num}`)
  ))

  const buttons = (
    <FlexContainer direction='column' gap='md'>
      <Heading level={1} underline>Button</Heading>

      <FlexContainer gap='md'>
        <Button>Default Button</Button>
        <Button variant='filled'>Filled Button</Button>
        <Button variant='outlined'>Outlined Button</Button>
        <Button variant='subtle'>Subtle Button</Button>
        <Button compact variant='filled'>Filled Compact</Button>
        <Button compact variant='outlined'>Outlined Compact</Button>
        <Button compact variant='subtle'>Subtle Compact</Button>
      </FlexContainer>

      <FlexContainer gap='md'>
        <Button warn>Warn Button</Button>
        <Button warn variant='filled'>Warn Filled</Button>
        <Button warn variant='outlined'>Warn Outlined</Button>
        <Button warn variant='subtle'>Warn Subtle</Button>
        <Button warn compact variant='filled'>Warn Filled Compact</Button>
        <Button warn compact variant='outlined'>Warn Outlined Compact</Button>
        <Button warn compact variant='subtle'>Warn Subtle Compact</Button>
      </FlexContainer>
    </FlexContainer>
  )

  const flexContainers = (
    <FlexContainer direction='column' gap='md'>
      <Heading level={1} underline>FlexContainer</Heading>

      <Heading level={2}>Default</Heading>
      <FlexContainer>{auroraSquares}</FlexContainer>

      <Heading level={2}>Column</Heading>
      <FlexContainer direction='column'>{auroraSquares}</FlexContainer>

      <Heading level={2}>Gaps</Heading>
      <Heading level={3}>xs</Heading>
      <FlexContainer gap='xs'>{auroraSquares}</FlexContainer>
      <Heading level={3}>sm</Heading>
      <FlexContainer gap='sm'>{auroraSquares}</FlexContainer>
      <Heading level={3}>md</Heading>
      <FlexContainer gap='md'>{auroraSquares}</FlexContainer>
      <Heading level={3}>lg</Heading>
      <FlexContainer gap='lg'>{auroraSquares}</FlexContainer>
      <Heading level={3}>xl</Heading>
      <FlexContainer gap='xl'>{auroraSquares}</FlexContainer>

      <Heading level={2}>Padding</Heading>
      <Heading level={3}>xs</Heading>
      <FlexContainer style={{backgroundColor: 'var(--snow0)'}} pad='xs'>{auroraSquares}</FlexContainer>
      <Heading level={3}>sm</Heading>
      <FlexContainer style={{backgroundColor: 'var(--snow0)'}} pad='sm'>{auroraSquares}</FlexContainer>
      <Heading level={3}>md</Heading>
      <FlexContainer style={{backgroundColor: 'var(--snow0)'}} pad='md'>{auroraSquares}</FlexContainer>
      <Heading level={3}>lg</Heading>
      <FlexContainer style={{backgroundColor: 'var(--snow0)'}} pad='lg'>{auroraSquares}</FlexContainer>
      <Heading level={3}>xl</Heading>
      <FlexContainer style={{backgroundColor: 'var(--snow0)'}} pad='xl'>{auroraSquares}</FlexContainer>
    </FlexContainer>
  )

  const headings = (
    <FlexContainer direction='column' gap='md'>
      <Heading level={1} underline>Heading</Heading>
      {[1, 2, 3, 4, 5, 6].map((level) => (
        <Heading key={level} level={level as any}>Heading Level {level}</Heading>
      ))}
    </FlexContainer>
  )

  const text = (
    <FlexContainer direction='column' gap='md'>
      <Heading level={1} underline>Text</Heading>
      <Text>
        Quite possible. We live long and are celebrated poopers. How much did you make me?
        You know, I was God once. Dr. Zoidberg, that doesn't make sense. But, okay!
        Ok, we'll go deliver this crate like professionals, and then we'll go ride the bumper cars.
      </Text>
      <Text strong>These are some strong words, eh?</Text>
      <Text>
        This is some text with some
        {' '}<Text inline strong>strong, inline words</Text>
        . Pretty neat, huh?
      </Text>
    </FlexContainer>
  )

  const textAreas = (
    <FlexContainer direction='column' gap='md'>
    <Heading level={1} underline>TextArea</Heading>

    <Heading level={2}>No Label</Heading>
    <TextArea defaultValue='This is some text input' />

    <Heading level={2}>With Label</Heading>
    <TextArea defaultValue='This is some text input' label='Some Label' />

    <Heading level={2}>With Label and Error</Heading>
    <TextArea
      defaultValue='This is some text input'
      error='This is an error message, fix your stuff.'
      label='Some Label'
    />

    <Heading level={2}>Resize</Heading>
    <TextArea resize rows={10} />
  </FlexContainer>
  )

  const textInputs = (
    <FlexContainer direction='column' gap='md'>
      <Heading level={1} underline>TextInput</Heading>

      <Heading level={2}>No Label</Heading>
      <TextInput defaultValue='This is some text input' />

      <Heading level={2}>With Label</Heading>
      <TextInput defaultValue='This is some text input' label='Some Label' />

      <Heading level={2}>With Label and Error</Heading>
      <TextInput
        defaultValue='This is some text input'
        error='This is an error message, fix your stuff.'
        label='Some Label'
      />
    </FlexContainer>
  )


  return (
    <FlexContainer direction='column' gap='xl' pad='xl' scroll='y'>
      {buttons}
      {flexContainers}
      {headings}
      {text}
      {textAreas}
      {textInputs}
    </FlexContainer>
  )
}
