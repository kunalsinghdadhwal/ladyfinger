'use client'

import { getLadyfingerProgram, getLadyfingerProgramId } from '@project/anchor'
import { useConnection } from '@solana/wallet-adapter-react'
import { Cluster, Keypair, PublicKey } from '@solana/web3.js'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import toast from 'react-hot-toast'
import { useCluster } from '../cluster/cluster-data-access'
import { useAnchorProvider } from '../solana/solana-provider'
import { useTransactionToast } from '../ui/ui-layout'

export function useLadyfingerProgram() {
  const { connection } = useConnection()
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const provider = useAnchorProvider()
  const programId = useMemo(() => getLadyfingerProgramId(cluster.network as Cluster), [cluster])
  const program = useMemo(() => getLadyfingerProgram(provider, programId), [provider, programId])

  const accounts = useQuery({
    queryKey: ['ladyfinger', 'all', { cluster }],
    queryFn: () => program.account.ladyfinger.all(),
  })

  const getProgramAccount = useQuery({
    queryKey: ['get-program-account', { cluster }],
    queryFn: () => connection.getParsedAccountInfo(programId),
  })

  const initialize = useMutation({
    mutationKey: ['ladyfinger', 'initialize', { cluster }],
    mutationFn: (keypair: Keypair) =>
      program.methods.initialize().accounts({ ladyfinger: keypair.publicKey }).signers([keypair]).rpc(),
    onSuccess: (signature) => {
      transactionToast(signature)
      return accounts.refetch()
    },
    onError: () => toast.error('Failed to initialize account'),
  })

  return {
    program,
    programId,
    accounts,
    getProgramAccount,
    initialize,
  }
}

export function useLadyfingerProgramAccount({ account }: { account: PublicKey }) {
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const { program, accounts } = useLadyfingerProgram()

  const accountQuery = useQuery({
    queryKey: ['ladyfinger', 'fetch', { cluster, account }],
    queryFn: () => program.account.ladyfinger.fetch(account),
  })

  const closeMutation = useMutation({
    mutationKey: ['ladyfinger', 'close', { cluster, account }],
    mutationFn: () => program.methods.close().accounts({ ladyfinger: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accounts.refetch()
    },
  })

  const decrementMutation = useMutation({
    mutationKey: ['ladyfinger', 'decrement', { cluster, account }],
    mutationFn: () => program.methods.decrement().accounts({ ladyfinger: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })

  const incrementMutation = useMutation({
    mutationKey: ['ladyfinger', 'increment', { cluster, account }],
    mutationFn: () => program.methods.increment().accounts({ ladyfinger: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })

  const setMutation = useMutation({
    mutationKey: ['ladyfinger', 'set', { cluster, account }],
    mutationFn: (value: number) => program.methods.set(value).accounts({ ladyfinger: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })

  return {
    accountQuery,
    closeMutation,
    decrementMutation,
    incrementMutation,
    setMutation,
  }
}
