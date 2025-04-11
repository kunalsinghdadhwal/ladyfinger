#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

declare_id!("coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF");

#[program]
pub mod ladyfinger {
    use super::*;

  pub fn close(_ctx: Context<CloseLadyfinger>) -> Result<()> {
    Ok(())
  }

  pub fn decrement(ctx: Context<Update>) -> Result<()> {
    ctx.accounts.ladyfinger.count = ctx.accounts.ladyfinger.count.checked_sub(1).unwrap();
    Ok(())
  }

  pub fn increment(ctx: Context<Update>) -> Result<()> {
    ctx.accounts.ladyfinger.count = ctx.accounts.ladyfinger.count.checked_add(1).unwrap();
    Ok(())
  }

  pub fn initialize(_ctx: Context<InitializeLadyfinger>) -> Result<()> {
    Ok(())
  }

  pub fn set(ctx: Context<Update>, value: u8) -> Result<()> {
    ctx.accounts.ladyfinger.count = value.clone();
    Ok(())
  }
}

#[derive(Accounts)]
pub struct InitializeLadyfinger<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
  init,
  space = 8 + Ladyfinger::INIT_SPACE,
  payer = payer
  )]
  pub ladyfinger: Account<'info, Ladyfinger>,
  pub system_program: Program<'info, System>,
}
#[derive(Accounts)]
pub struct CloseLadyfinger<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
  mut,
  close = payer, // close account and return lamports to payer
  )]
  pub ladyfinger: Account<'info, Ladyfinger>,
}

#[derive(Accounts)]
pub struct Update<'info> {
  #[account(mut)]
  pub ladyfinger: Account<'info, Ladyfinger>,
}

#[account]
#[derive(InitSpace)]
pub struct Ladyfinger {
  count: u8,
}
