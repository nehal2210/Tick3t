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
  useToast,
  Link,
} from '@chakra-ui/react'
import {
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from 'wagmi'
import abiEvent from '../constants/abiEvent'
import abi, { TICKET_CONTRACT_ADDRESS } from '../constants'
import { utils } from 'ethers'
import { useRouter } from 'next/router'

type EventProps = {
  address: `0x${string}`
}

const EventCard: React.FC<EventProps> = ({ address }) => {
  const route = useRouter()
  const toast = useToast()
  const { data: name } = useContractRead({
    address: address,
    abi: abiEvent,
    functionName: 'name',
  })
  const { data: price } = useContractRead({
    address: address,
    abi: abiEvent,
    functionName: 'price',
  })
  const { data: image } = useContractRead({
    address: address,
    abi: abiEvent,
    functionName: 'image',
  })
  const { data: location } = useContractRead({
    address: address,
    abi: abiEvent,
    functionName: 'Location',
  })
  const { data: description } = useContractRead({
    address: address,
    abi: abiEvent,
    functionName: 'Description',
  })
  const { data: date } = useContractRead({
    address: address,
    abi: abiEvent,
    functionName: 'Date',
  })

  const { data: mint, error: fuck } = usePrepareContractWrite({
    address: address,
    abi: abiEvent,
    functionName: 'safeMint',
    overrides: {
      value: price,
    },
  })

  const {
    writeAsync: safeMint,
    reset: resetsafeMint,
    data: safeMintTx,
  } = useContractWrite(mint)
  const { status: safeMintStatus } = useWaitForTransaction(safeMintTx)

  const handleMint = () => {
    safeMint?.()
  }

  const { isLoading, error } = useWaitForTransaction({
    hash: safeMintTx?.hash,
    onSuccess(data) {
      toast({
        title: 'Transaction Successful',
        description: (
          <>
            <Text>Successfully minted your ticket!</Text>
            <Text>
              <Link
                href={`https://mumbai.polygonscan.com/tx/${safeMintTx?.hash}`}
                isExternal
              >
                View on Polyscan
              </Link>
            </Text>
          </>
        ),
        status: 'success',
        duration: 6000,
        isClosable: true,
      })
      route.push('/my-tickets')
    },
  })
  return (
    <Box
      p={4}
      backgroundColor="white"
      borderRadius="md"
      boxShadow="md"
      width={{ base: '90%', md: '80%', lg: '80%' }}
      alignItems="center"
      justifyContent="center"
      display={'flex'}
      flexDirection={'column'}
    >
      <Image
        src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80"
        alt="Event image"
        borderRadius="md"
        boxShadow="md"
        width={'50%'}
      />
      <Heading mt={4} fontSize="2xl">
        {name ?? 'Party'}
      </Heading>
      <Badge mt={2} colorScheme="green">
        Free
      </Badge>
      <Text mt={4} fontSize="sm" color="gray.500">
        {description ?? 'A cool event'}
      </Text>
      <Divider my={4} />
      <Flex mt={4} alignItems="center">
        <Box>
          <Text fontWeight="bold" fontSize="sm" color="gray.500">
            Date
          </Text>
          <Text fontSize="sm">{date ?? 'Always'}</Text>
        </Box>
        <Box ml={8}>
          <Text fontWeight="bold" fontSize="sm" color="gray.500">
            Location
          </Text>
          <Text fontSize="sm"> {location ?? 'Neverland'}</Text>
        </Box>
      </Flex>
      <Divider my={4} />
      <Box mt={4} alignItems="center">
        <Text fontWeight="bold" fontSize="sm" color="gray.500">
          Ticket Price
        </Text>
        <Text fontSize="sm">
          {price
            ? `${utils.formatUnits(price, 'ether')} matic` ?? 'Free'
            : null}
        </Text>
      </Box>
      <Button mt={4} colorScheme="blue" width="50%" onClick={handleMint}>
        {
          {
            idle: 'Buy ticket',
            error: 'Try again',
            loading: 'Processing...',
            success: 'Bought!',
          }[safeMintStatus]
        }
      </Button>
    </Box>
  )
}

export default EventCard
