import React from 'react'
import {
  Box,
  Flex,
  Image,
  Heading,
  Text,
  Button,
  Divider,
  Badge,
  SimpleGrid,
  Link,
} from '@chakra-ui/react'
import { useAccount, useContractRead, useContractReads } from 'wagmi'
import abiEvent from '../constants/abiEvent'
import abi, { TICKET_CONTRACT_ADDRESS } from '../constants'
import { Layout } from '../components/layout/Layout'
import EventCard from '../components/EventCard'

const Events = () => {
  const { address } = useAccount()
  const {
    data: events,
    error,
    isLoading,
  } = useContractRead({
    address: TICKET_CONTRACT_ADDRESS,
    abi: abi,
    functionName: 'getEventsPerAddress',
    args: [address as `0x${string}`],
  })

  if (events?.length === 0 && !isLoading)
    return (
      <Box textAlign="center" py={8}>
        <Box fontSize="xl" fontWeight="semibold" mb={2}>
          You have not created any events yet.
        </Box>
        <Box mb={4}>Get started by creating your first event.</Box>
        <Link href="/create-event">
          <Button colorScheme="blue" as="a">
            Create Event
          </Button>
        </Link>
      </Box>
    )

  return (
    <Layout>
      <SimpleGrid columns={{ sm: 1, md: 2, lg: 3 }} spacing={4}>
        {events?.map((item) => (
          <EventCard key={item} address={item} />
        ))}
      </SimpleGrid>
    </Layout>
  )
}

export default Events
