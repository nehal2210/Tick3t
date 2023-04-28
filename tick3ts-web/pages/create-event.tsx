import {
  Box,
  Button,
  Divider,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Link,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Text,
  useToast,
} from '@chakra-ui/react'
import { BigNumber, utils } from 'ethers'
import { create } from 'ipfs-http-client'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useState } from 'react'
import {
  erc721ABI,
  useAccount,
  useContractRead,
  useContractReads,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from 'wagmi'
import { Layout } from '../components/layout/Layout'
import abi, { TICKET_CONTRACT_ADDRESS } from '../constants'

const projectId = '2DDHiA47zFkJXtnxzl2jFkyuaoq'
const projectSecret = '96a91eeafc0a390ab66e6a87f61152aa'
const projectIdAndSecret = `${projectId}:${projectSecret}`

const ipfs = create({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
  headers: {
    authorization: `Basic ${Buffer.from(projectIdAndSecret).toString(
      'base64'
    )}`,
  },
})

const CreateEvent: NextPage = () => {
  const { address } = useAccount()

  const toast = useToast()
  const route = useRouter()
  const [eventName, setEventName] = useState('')
  const [eventLocation, setEventLocation] = useState('')
  const [eventDate, setEventDate] = useState('')
  const [eventTime, setEventTime] = useState('')
  const [eventDesc, setEventDesc] = useState('')
  const [ticketAmount, setTicketAmount] = useState('1')
  const [ticketPrice, setTicketPrice] = useState('0')
  const { data: eventCreated, error: fuck } = usePrepareContractWrite({
    address: TICKET_CONTRACT_ADDRESS,
    abi: abi,
    functionName: 'createEvent',
    args: [
      eventName,
      eventLocation,
      eventDate,
      'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80',
      BigNumber.from(ticketAmount ? ticketAmount : 1),
      BigNumber.from(
        ticketPrice.toString()
          ? utils.parseUnits(ticketPrice.toString(), 'ether')
          : 0
      ),
      eventDesc,
    ],
  })

  const {
    writeAsync: createEvent,
    reset: resetCreateEvent,
    data: createEventTx,
  } = useContractWrite(eventCreated)
  const { status: createEventStatus } = useWaitForTransaction(createEventTx)
  const handleCreateEvent = () => {
    createEvent?.()
    setEventName('')
    setEventLocation('')
    setEventDate('')
    setEventDesc('')
    setTicketAmount('')
    setTicketPrice('')
  }
  // Creates the contracts array for `nftTokenIds`

  const { isLoading, error } = useWaitForTransaction({
    hash: createEventTx?.hash,
    onSuccess(data) {
      toast({
        title: 'Transaction Successful',
        description: (
          <>
            <Text>Successfully created your event NFT!</Text>
            <Text>
              <Link
                href={`https://mumbai.polygonscan.com/tx/${createEventTx?.hash}`}
                isExternal
              >
                View on polyscan
              </Link>
            </Text>
          </>
        ),
        status: 'success',
        duration: 5000,
        isClosable: true,
      })
      route.push('/')
    },
  })
  return (
    <Layout>
      <Heading as="h1" mb="8">
        Create event
      </Heading>
      <Box
        p={8}
        backgroundColor="white"
        borderRadius="md"
        boxShadow="md"
        width={{ base: '90%', md: '80%', lg: '100%' }}
        alignItems="center"
        justifyContent="center"
        display={'flex'}
        flexDirection={'column'}
      >
        <Divider my="8" borderColor="gray.400" />

        {/* Add inputs for event details */}
        <FormControl id="eventName" mt={4}>
          <FormLabel>Event Name</FormLabel>
          <Input
            type="text"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
          />
        </FormControl>
        <FormControl id="eventDesc" mt={4}>
          <FormLabel>Description</FormLabel>
          <Input
            type="text"
            value={eventDesc}
            onChange={(e) => setEventDesc(e.target.value)}
          />
        </FormControl>
        <FormControl id="eventLocation" mt={4}>
          <FormLabel>Event Location</FormLabel>
          <Input
            type="text"
            value={eventLocation}
            onChange={(e) => setEventLocation(e.target.value)}
          />
        </FormControl>

        <FormControl id="eventDate" mt={4}>
          <FormLabel>Event Date</FormLabel>
          <Input
            type="date"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
          />
        </FormControl>

        <FormControl id="eventTime" mt={4}>
          <FormLabel>Event Time</FormLabel>
          <Input
            type="time"
            value={eventTime}
            onChange={(e) => setEventTime(e.target.value)}
          />
        </FormControl>

        <FormControl id="ticketAmount" mt={4}>
          <FormLabel>Amount of Tickets</FormLabel>
          <NumberInput
            min={0}
            value={ticketAmount}
            onChange={(value) => setTicketAmount(value)}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </FormControl>
        <FormControl id="ticketPrice" mt={4}>
          <FormLabel>Price for a Ticket in Matic</FormLabel>
          <NumberInput
            min={0}
            value={ticketPrice}
            onChange={(value) => setTicketPrice(value.toString())}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </FormControl>

        <Text textAlign="center">
          <Button
            mt={8}
            colorScheme="teal"
            size="lg"
            disabled={
              !eventName ||
              !eventLocation ||
              !eventDate ||
              !eventDesc ||
              !ticketAmount ||
              !ticketPrice
            }
            onClick={handleCreateEvent}
            // isLoading={isLoading}
          >
            {
              {
                idle: 'Create',
                error: 'Try again',
                loading: 'Creating...',
                success: 'Created!',
              }[createEventStatus]
            }
          </Button>
        </Text>
        <Divider my="8" borderColor="gray.400" />
      </Box>
    </Layout>
  )
}

export default CreateEvent
