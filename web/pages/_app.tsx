import { useState } from 'react'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import Link from 'next/link'
import { AppShell, Burger, Flex, Header, MediaQuery, Navbar } from '@mantine/core'

import { Heading } from '@/components/base'
import '@/styles/globals.css'

export default function App({ Component, pageProps }: AppProps) {
  const [navHidden, setNavHidden] = useState(true)

  return (
    <>
      <Head>
        <title>Kanbad</title>
        <meta name='viewport' content='width=device-width, initial-scale=1' />
      </Head>
      <AppShell
        navbarOffsetBreakpoint='sm'
        asideOffsetBreakpoint='sm'
        navbar={
          <Navbar p='md' hiddenBreakpoint='sm' hidden={navHidden} width={{ sm: 200, lg: 300 }}>
            <Navbar.Section grow>
              ... list of created or joined boards
            </Navbar.Section>
            <Navbar.Section>
              ... create workspace button
            </Navbar.Section>
          </Navbar>
        }
        header={
          <Header height={{ base: 50 /*, md: 50 */ }} px='md'>
            <Flex align='center'>
              <MediaQuery largerThan='sm' styles={{ display: 'none' }}>
                <Burger
                  opened={!navHidden}
                  onClick={() => setNavHidden(!navHidden)}
                  size='sm'
                  mr='xl'
                />
              </MediaQuery>

              <Link href='/'>
                <Heading level={1}>kanbad</Heading>
              </Link>
            </Flex>
          </Header>
        }
      >
        <Component {...pageProps} />
      </AppShell>
    </>
  )
}
