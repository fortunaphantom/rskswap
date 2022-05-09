import { ChainId, Token, WETH } from '@thinkanddev/rskswap-sdk'
import KOVAN_TOKENS from './kovan'
import MAINNET_TOKENS from './mainnet'
import RINKEBY_TOKENS from './rinkeby'
import ROPSTEN_TOKENS from './ropsten'
import RSKMAINNET_TOKENS from './rskmainnet'
import RSKTESTNET_TOKENS from './rsktestnet'

type AllTokens = Readonly<{ [chainId in number]: Readonly<{ [tokenAddress: string]: Token }> }>
export const ALL_TOKENS: AllTokens = [
  // WETH on all chains
  ...Object.values(WETH),
  // chain-specific tokens
  ...MAINNET_TOKENS,
  ...RINKEBY_TOKENS,
  ...KOVAN_TOKENS,
  ...ROPSTEN_TOKENS,
  ...RSKMAINNET_TOKENS,
  ...RSKTESTNET_TOKENS
]
  // remap WETH to ETH
  .map(token => {
    if (token.equals(WETH[token.chainId])) {
      ;(token as any).symbol = 'RBTC'
      ;(token as any).name = 'RBTC'
    }
    return token
  })
  // put into an object
  .reduce<AllTokens>(
    (tokenMap, token) => {
      if (tokenMap[token.chainId][token.address] !== undefined) throw Error('Duplicate tokens.')
      return {
        ...tokenMap,
        [token.chainId]: {
          ...tokenMap[token.chainId],
          [token.address]: token
        }
      }
    },
    {
      [ChainId.MAINNET]: {},
      [ChainId.RINKEBY]: {},
      [ChainId.GÖRLI]: {},
      [ChainId.ROPSTEN]: {},
      [ChainId.KOVAN]: {},
      [ChainId.RSK_MAINNET]: {},
      [ChainId.RSK_TESTNET]: {}
    }
  )
