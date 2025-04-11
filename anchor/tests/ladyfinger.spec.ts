import * as anchor from '@coral-xyz/anchor'
import { Program } from '@coral-xyz/anchor'
import { Keypair } from '@solana/web3.js'
import { Ladyfinger } from '../target/types/ladyfinger'

describe('ladyfinger', () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)
  const payer = provider.wallet as anchor.Wallet

  const program = anchor.workspace.Ladyfinger as Program<Ladyfinger>

  const ladyfingerKeypair = Keypair.generate()

  it('Initialize Ladyfinger', async () => {
    await program.methods
      .initialize()
      .accounts({
        ladyfinger: ladyfingerKeypair.publicKey,
        payer: payer.publicKey,
      })
      .signers([ladyfingerKeypair])
      .rpc()

    const currentCount = await program.account.ladyfinger.fetch(ladyfingerKeypair.publicKey)

    expect(currentCount.count).toEqual(0)
  })

  it('Increment Ladyfinger', async () => {
    await program.methods.increment().accounts({ ladyfinger: ladyfingerKeypair.publicKey }).rpc()

    const currentCount = await program.account.ladyfinger.fetch(ladyfingerKeypair.publicKey)

    expect(currentCount.count).toEqual(1)
  })

  it('Increment Ladyfinger Again', async () => {
    await program.methods.increment().accounts({ ladyfinger: ladyfingerKeypair.publicKey }).rpc()

    const currentCount = await program.account.ladyfinger.fetch(ladyfingerKeypair.publicKey)

    expect(currentCount.count).toEqual(2)
  })

  it('Decrement Ladyfinger', async () => {
    await program.methods.decrement().accounts({ ladyfinger: ladyfingerKeypair.publicKey }).rpc()

    const currentCount = await program.account.ladyfinger.fetch(ladyfingerKeypair.publicKey)

    expect(currentCount.count).toEqual(1)
  })

  it('Set ladyfinger value', async () => {
    await program.methods.set(42).accounts({ ladyfinger: ladyfingerKeypair.publicKey }).rpc()

    const currentCount = await program.account.ladyfinger.fetch(ladyfingerKeypair.publicKey)

    expect(currentCount.count).toEqual(42)
  })

  it('Set close the ladyfinger account', async () => {
    await program.methods
      .close()
      .accounts({
        payer: payer.publicKey,
        ladyfinger: ladyfingerKeypair.publicKey,
      })
      .rpc()

    // The account should no longer exist, returning null.
    const userAccount = await program.account.ladyfinger.fetchNullable(ladyfingerKeypair.publicKey)
    expect(userAccount).toBeNull()
  })
})
