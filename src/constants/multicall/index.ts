import { ChainId } from '@thinkanddev/rskswap-sdk'
import MULTICALL_ABI from './abi.json'

const MULTICALL_NETWORKS: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: '0xeefBa1e63905eF1D7ACbA5a8513c70307C1cE441',
  [ChainId.ROPSTEN]: '0x53C43764255c17BD724F74c4eF150724AC50a3ed',
  [ChainId.KOVAN]: '0x2cc8688C5f75E365aaEEb4ea8D6a480405A48D2A',
  [ChainId.RINKEBY]: '0x42Ad527de7d4e9d9d011aC45B31D8551f8Fe9821',
  [ChainId.GÖRLI]: '0x77dCa2C955b15e9dE4dbBCf1246B4B85b651e50e',
  [ChainId.RSK_MAINNET]: '0x4Eeebb5580769Ba6d26bFD07bE636300076d1831',
  [ChainId.RSK_TESTNET]: '0x4Eeebb5580769Ba6d26bFD07bE636300076d1831'
}

export { MULTICALL_ABI, MULTICALL_NETWORKS }
