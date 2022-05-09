import React, { useState } from 'react'
import styled from 'styled-components'
import { isAddress } from '../../utils'
import { useActiveWeb3React } from '../../hooks'
import { WETH, ChainId } from '@thinkanddev/rskswap-sdk'
import EthereumLogo from '../../assets/images/rbtc-logo.png' //import EthereumLogo from '../../assets/images/ethereum-logo.png'
import contractMap from '@rsksmart/rsk-contract-metadata'
import contractTestnetMap from '@rsksmart/rsk-testnet-contract-metadata'

const toChecksumAddress = require('rskjs-util').toChecksumAddress

const getTokenLogoURL = (address, chainId) => {
  let logo = ''
  if (chainId === ChainId.RSK_MAINNET) {
    const metadata = contractMap[toChecksumAddress(address, chainId)]
    if (metadata)
      logo = `https://raw.githubusercontent.com/rsksmart/rsk-contract-metadata/master/images/${metadata.logo}`
  } else if (chainId === ChainId.RSK_TESTNET) {
    const metadata = contractTestnetMap[toChecksumAddress(address, chainId)]
    if (metadata)
      logo = `https://raw.githubusercontent.com/rsksmart/rsk-testnet-contract-metadata/master/images/${metadata.logo}`
  } else {
    logo = `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${address}/logo.png`
  }
  return logo
}
const NO_LOGO_ADDRESSES: { [tokenAddress: string]: true } = {}

const Image = styled.img<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  background-color: white;
  border-radius: 1rem;
  box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.075);
`

const Emoji = styled.span<{ size?: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ size }) => size};
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  margin-bottom: -4px;
`

const StyledEthereumLogo = styled.img<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.075);
  border-radius: 24px;
`

export default function TokenLogo({
  address,
  size = '24px',
  ...rest
}: {
  address?: string
  size?: string
  style?: React.CSSProperties
}) {
  const [, refresh] = useState<number>(0)
  const { chainId } = useActiveWeb3React()

  let path = ''
  const validated = isAddress(address)
  // hard code to show ETH instead of WETH in UI
  if (validated === WETH[chainId].address) {
    return <StyledEthereumLogo src={EthereumLogo} size={size} {...rest} />
  } else if (!NO_LOGO_ADDRESSES[address] && validated) {
    path = getTokenLogoURL(validated, chainId)
  }
  if (path === '') {
    return (
      <Emoji {...rest} size={size}>
        <span role="img" aria-label="Thinking">
          🤔
        </span>
      </Emoji>
    )
  }

  return (
    <Image
      {...rest}
      // alt={address}
      src={path}
      size={size}
      onError={() => {
        NO_LOGO_ADDRESSES[address] = true
        refresh(i => i + 1)
      }}
    />
  )
}
