import Image from 'next/image';
import Head from 'next/head';
import { useMoralis } from 'react-moralis';
import networkMapping from '../../constants/networkMapping';
import GET_ACTIVE_ITEMS from '../../constants/subgraphQueries';
import { useQuery, gql } from '@apollo/client';
import NFTBox from '../../components/NFTBox';

export default function Home() {
  const { isWeb3Enabled, chainId } = useMoralis();
  const chainString = chainId ? parseInt(chainId).toString() : '31337';
  const marketplaceAddress = chainId ? networkMapping[chainString].NftMarketplace[0] : null;

  const { loading, error, data: listedNfts } = useQuery(GET_ACTIVE_ITEMS);

  return (
    <div className=" container mx-auto">
      <h1 className=" px-5 py-5 font-bold text-2xl ">Recently Listed</h1>
      <div className=" flex flex-wrap">
        {isWeb3Enabled && chainId ? (
          loading || !listedNfts ? (
            <div>Loading...</div>
          ) : (
            listedNfts.activeItems.map((nft) => {
              const { price, nftAddress, tokenId, seller } = nft;
              return (
                <div>
                  <NFTBox
                    price={price}
                    nftAddress={nftAddress}
                    tokenId={tokenId}
                    marketplaceAddress={marketplaceAddress}
                    seller={seller}
                    key={`${nftAddress}${tokenId}`}
                  />
                </div>
              );
            })
          )
        ) : (
          <div>Network Error</div>
        )}
      </div>
    </div>
  );
}
