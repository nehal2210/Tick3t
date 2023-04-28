import { useState, useEffect } from 'react'
import { Heading, Link, Box, Center, Button } from '@chakra-ui/react'
import { useAccount } from 'wagmi'
import { Layout } from '../components/layout/Layout'

const MyTicketsPage = () => {
  return (
    <Layout>
      <Center height="100vh">
        <Box p="8" borderWidth="1px" borderRadius="lg" boxShadow="lg">
          <Heading as="h1" mb="8" textAlign="center">
            My Tickets
          </Heading>
          <Box textAlign="center">
            <Button
              variant="solid"
              colorScheme="teal"
              as="a"
              href="https://testnets.opensea.io/account"
              target="_blank"
            >
              View my tickets on OpenSea
            </Button>
          </Box>
        </Box>
      </Center>
    </Layout>
  )
}

export default MyTicketsPage
