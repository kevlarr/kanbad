import { ReactNode, useState } from 'react'

import { getEventDataCard } from '@/lib/dnd'
import {
  Button,
  FlexContainer,
  Heading,
  Text,
  TextInput,
  TextArea,
 } from '@/components/base'
 import {
  Card,
  Dropzone,
  SortableList,
 } from '@/components'

export default function Components() {
  const [activeDropzone, setActiveDropzone] = useState(-1)

  const sectionGroup = (title: string, description: string, children: ReactNode) => (
    <FlexContainer direction='column' gap='md' pad='md'>
      <Heading level={2} underline>{title}</Heading>
      <Text>{description}</Text>
      <FlexContainer direction='column' gap='md' pad='md'>
        {children}
      </FlexContainer>
    </FlexContainer>
  )

  const section = (title: string, children: ReactNode) => (
    <FlexContainer direction='column'>
      <Heading level={3} underline>{title}</Heading>
      <FlexContainer direction='column' gap='md' pad='md'>
        {children}
      </FlexContainer>
    </FlexContainer>
  )


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

  const buttons = section('Button', <>
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
  </>)


  const flexContainers = section('FlexContainer', <>
    <Heading level={4}>Default</Heading>
    <FlexContainer>{auroraSquares}</FlexContainer>

    <Heading level={4}>Column</Heading>
    <FlexContainer direction='column'>{auroraSquares}</FlexContainer>

    <Heading level={4}>Gaps</Heading>
    <Heading level={5}>xs</Heading>
    <FlexContainer gap='xs'>{auroraSquares}</FlexContainer>
    <Heading level={5}>sm</Heading>
    <FlexContainer gap='sm'>{auroraSquares}</FlexContainer>
    <Heading level={5}>md</Heading>
    <FlexContainer gap='md'>{auroraSquares}</FlexContainer>
    <Heading level={5}>lg</Heading>
    <FlexContainer gap='lg'>{auroraSquares}</FlexContainer>
    <Heading level={5}>xl</Heading>
    <FlexContainer gap='xl'>{auroraSquares}</FlexContainer>

    <Heading level={4}>Padding</Heading>
    <Heading level={5}>xs</Heading>
    <FlexContainer style={{backgroundColor: 'var(--snow0)'}} pad='xs'>{auroraSquares}</FlexContainer>
    <Heading level={5}>sm</Heading>
    <FlexContainer style={{backgroundColor: 'var(--snow0)'}} pad='sm'>{auroraSquares}</FlexContainer>
    <Heading level={5}>md</Heading>
    <FlexContainer style={{backgroundColor: 'var(--snow0)'}} pad='md'>{auroraSquares}</FlexContainer>
    <Heading level={5}>lg</Heading>
    <FlexContainer style={{backgroundColor: 'var(--snow0)'}} pad='lg'>{auroraSquares}</FlexContainer>
    <Heading level={5}>xl</Heading>
    <FlexContainer style={{backgroundColor: 'var(--snow0)'}} pad='xl'>{auroraSquares}</FlexContainer>
  </>)


  const headings = section('Heading', <>
    {[1, 2, 3, 4, 5, 6].map((level) => (
      <Heading key={level} level={level as any}>Heading Level {level}</Heading>
    ))}
  </>)


  const text = section('Text', <>
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
  </>)


  const textAreas = section('TextArea', <>
    <Heading level={4}>No Label:</Heading>
    <TextArea defaultValue='This is some text input' />

    <Heading level={4}>With label:</Heading>
    <TextArea defaultValue='This is some text input' label='Some Label' />

    <Heading level={4}>With label and error:</Heading>
    <TextArea
      defaultValue='This is some text input'
      error='This is an error message, fix your stuff.'
      label='Some Label'
    />

    <Heading level={4}>Resize:</Heading>
    <TextArea resize rows={10} />
  </>)


  const textInputs = section('TextInput', <>
    <Heading level={4}>No label:</Heading>
    <TextInput defaultValue='This is some text input' />

    <Heading level={4}>With label:</Heading>
    <TextInput defaultValue='This is some text input' label='Some Label' />

    <Heading level={4}>With label and error:</Heading>
    <TextInput
      defaultValue='This is some text input'
      error='This is an error message, fix your stuff.'
      label='Some Label'
    />
  </>)

  const dropzones = section('Dropzone', <>
    <Heading level={4}>Defaults to zero height (hover to activate):</Heading>
    <FlexContainer
      direction='column'
      pad='md'
      style={{backgroundColor: 'var(--snow0)'}}
      onMouseEnter={() => setActiveDropzone(1)}
      onMouseLeave={() => setActiveDropzone(-1)}
    >
      <Dropzone active={activeDropzone === 1} />
    </FlexContainer>
    <Heading level={4}>Always expanded:</Heading>
    <FlexContainer
      direction='column'
      pad='md'
      style={{backgroundColor: 'var(--snow0)'}}
      onMouseEnter={() => setActiveDropzone(2)}
      onMouseLeave={() => setActiveDropzone(-1)}
    >
      <Dropzone active={activeDropzone === 2} alwaysExpand />
    </FlexContainer>
  </>)

  const draggables = [1, 2, 3].map((i) => (
    <Card
      key={`card-${i}`}
      card={{
        board: 'some-board',
        identifier: `card-${i}`,
        title: `Card number ${i}`,
        body: i % 2 === 0 ? 'Some really helpful information for the card' : null,
        position: i - 1,
      }}
      updateCard={async (params) => true}
      deleteCard={() => {}}
    />
  ))

  const sortableLists = section('SortableList', <>
      <Heading level={4}>Defaults to expanded dropzone:</Heading>
      <FlexContainer
        direction='column'
        pad='md'
        style={{backgroundColor: 'var(--snow0)'}}
      >
        <SortableList getEventItem={() => null} onDropPosition={() => {}}/>
      </FlexContainer>
      <Heading level={4}>With cards:</Heading>
      <FlexContainer
        direction='column'
        pad='md'
        style={{backgroundColor: 'var(--snow0)'}}
      >
        <SortableList getEventItem={getEventDataCard} onDropPosition={() => {}} draggables={draggables}/>
      </FlexContainer>
  </>)

  const generalComponents = sectionGroup(
    'General Components',
    'These components are essentially wrappers around basic HTML elements and are transferrable across pages or even applications',
    <>
      {buttons}
      {flexContainers}
      {headings}
      {text}
      {textAreas}
      {textInputs}
    </>
  )

  const domainComponents = sectionGroup(
    'Domain-Specific Components',
    'These components are more specific to the Kanban app itself and would make less sense in a more general page or application',
    <>
      {dropzones}
      {sortableLists}
    </>
  )

  return (
    <FlexContainer direction='column' gap='md' pad='md' scroll='y'>
      {generalComponents}
      {domainComponents}
    </FlexContainer>
  )
}
