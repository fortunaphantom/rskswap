import { Contract } from '@ethersproject/contracts'
//import { getAddress } from '@ethersproject/address'
import { AddressZero } from '@ethersproject/constants'
import { JsonRpcSigner, Web3Provider } from '@ethersproject/providers'
import { BigNumber } from '@ethersproject/bignumber'
import { abi as IUniswapV2Router02ABI } from '@uniswap/v2-periphery/build/IUniswapV2Router02.json'
import { ROUTER_ADDRESS } from '../constants'
import { ALL_TOKENS } from '../constants/tokens'
import { ChainId, JSBI, Percent, TokenAmount, Token, getChecksumAddress } from '@thinkanddev/rskswap-sdk'

// returns the checksummed address if the address is valid, otherwise returns false
export function isAddress(value: any): string | false {
  try {
    return getChecksumAddress(value) //return getAddress(value)
  } catch {
    return false
  }
}

const EXPLORER = {
  1: 'https://etherscan.io',
  3: 'https://ropsten.etherscan.io',
  4: 'https://rinkeby.etherscan.io',
  5: 'https://goerli.etherscan.io',
  42: 'https://kovan.etherscan.io',
  30: 'https://explorer.rsk.co',
  31: 'https://explorer.testnet.rsk.co'
}

export function getEtherscanLink(chainId: ChainId, data: string, type: 'transaction' | 'address'): string {
  const prefix = EXPLORER[chainId] || EXPLORER[1]

  switch (type) {
    case 'transaction': {
      return `${prefix}/tx/${data}`
    }
    case 'address':
    default: {
      return `${prefix}/address/${data}`
    }
  }
}

// shorten the checksummed version of the input address to have 0x + 4 characters at start and end
export function shortenAddress(address: string, chars = 4): string {
  const parsed = isAddress(address)
  if (!parsed) {
    throw Error(`Invalid 'address' parameter '${address}'.`)
  }
  return `${parsed.substring(0, chars + 2)}...${parsed.substring(42 - chars)}`
}

// add 10%
export function calculateGasMargin(value: BigNumber): BigNumber {
  return value.mul(BigNumber.from(10000).add(BigNumber.from(1000))).div(BigNumber.from(10000))
}

// converts a basis points value to a sdk percent
export function basisPointsToPercent(num: number): Percent {
  return new Percent(JSBI.BigInt(num), JSBI.BigInt(10000))
}

export function calculateSlippageAmount(value: TokenAmount, slippage: number): [JSBI, JSBI] {
  if (slippage < 0 || slippage > 10000) {
    throw Error(`Unexpected slippage value: ${slippage}`)
  }
  return [
    JSBI.divide(JSBI.multiply(value.raw, JSBI.BigInt(10000 - slippage)), JSBI.BigInt(10000)),
    JSBI.divide(JSBI.multiply(value.raw, JSBI.BigInt(10000 + slippage)), JSBI.BigInt(10000))
  ]
}

// account is not optional
export function getSigner(library: Web3Provider, account: string): JsonRpcSigner {
  return library.getSigner(account).connectUnchecked()
}

// account is optional
export function getProviderOrSigner(library: Web3Provider, account?: string): Web3Provider | JsonRpcSigner {
  return account ? getSigner(library, account) : library
}

// account is optional
export function getContract(address: string, ABI: any, library: Web3Provider, account?: string): Contract {
  if (!isAddress(address) || address === AddressZero) {
    throw Error(`Invalid 'address' parameter '${address}'.`)
  }

  return new Contract(address, ABI, getProviderOrSigner(library, account))
}

// account is optional
export function getRouterContract(_: number, library: Web3Provider, account?: string) {
  return getContract(ROUTER_ADDRESS, IUniswapV2Router02ABI, library, account)
}

export function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // $& means the whole matched string
}

export function isDefaultToken(token?: Token): boolean {
  return Boolean(token && ALL_TOKENS[token.chainId]?.[token.address])
}

export function isCustomAddedToken(allTokens: { [address: string]: Token }, token?: Token): boolean {
  const isDefault = isDefaultToken(token)
  return Boolean(token && allTokens[token.address] && !isDefault)
}
