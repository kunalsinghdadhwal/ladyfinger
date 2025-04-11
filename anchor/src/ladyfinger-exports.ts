// Here we export some useful types and functions for interacting with the Anchor program.
import { AnchorProvider, Program } from '@coral-xyz/anchor'
import { Cluster, PublicKey } from '@solana/web3.js'
import LadyfingerIDL from '../target/idl/ladyfinger.json'
import type { Ladyfinger } from '../target/types/ladyfinger'

// Re-export the generated IDL and type
export { Ladyfinger, LadyfingerIDL }

// The programId is imported from the program IDL.
export const LADYFINGER_PROGRAM_ID = new PublicKey(LadyfingerIDL.address)

// This is a helper function to get the Ladyfinger Anchor program.
export function getLadyfingerProgram(provider: AnchorProvider, address?: PublicKey) {
  return new Program({ ...LadyfingerIDL, address: address ? address.toBase58() : LadyfingerIDL.address } as Ladyfinger, provider)
}

// This is a helper function to get the program ID for the Ladyfinger program depending on the cluster.
export function getLadyfingerProgramId(cluster: Cluster) {
  switch (cluster) {
    case 'devnet':
    case 'testnet':
      // This is the program ID for the Ladyfinger program on devnet and testnet.
      return new PublicKey('coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF')
    case 'mainnet-beta':
    default:
      return LADYFINGER_PROGRAM_ID
  }
}
