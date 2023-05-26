import Image from 'next/image';
import Head from 'next/head';
import { Form, useNotification, Button } from 'web3uikit';
import { data } from 'autoprefixer';
import { ethers } from 'ethers';
import nftMarketplaceAbi from '../../constants/NftMarketplace.json';
import nftAbi from '../../constants/BasicNft.json';
import { useMoralis, useWeb3Contract } from 'react-moralis';
import networkMapping from '../../constants/networkMapping.json';
import { useEffect, useState } from 'react';

export default function Home() {
  const { chainId, account, isWeb3Enabled } = useMoralis();
  const chainString = chainId ? parseInt(chainId).toString() : '31337';
  const marketplaceAddress = networkMapping[chainString].NftMarketplace[0];
  const { runContractFunction } = useWeb3Contract();
  const dispatch = useNotification();
  const [proceeds, setProceeds] = useState('0');

  const approveAndList = async (data) => {
    console.log('Approving...');
    const nftAddress = data.data[0].inputResult;
    const tokenId = data.data[1].inputResult;
    const price = ethers.utils.parseUnits(data.data[2].inputResult, 'ether').toString();

    const approveOptions = {
      abi: nftAbi,
      contractAddress: nftAddress,
      functionName: 'approve',
      params: {
        to: marketplaceAddress,
        tokenId: tokenId,
      },
    };
    await runContractFunction({
      params: approveOptions,
      onSuccess: () => {
        handleApproveSuccess(nftAddress, tokenId, price);
      },
      onError: (error) => {
        console.log(error);
      },
    });
  };

  async function handleApproveSuccess(nftAddress, tokeId, price) {
    console.log('Ok! Now time to list');
    const listOptions = {
      abi: nftMarketplaceAbi,
      contractAddress: marketplaceAddress,
      functionName: 'listItem',
      params: {
        nftAddress: nftAddress,
        tokeId: tokeId,
        price: price,
      },
    };
    await runContractFunction({
      params: listOptions,
      onError: (error) => console.log(error),
      onSuccess: () => handleListSuccess,
    });
  }

  async function handleListSuccess() {
    dispatch({
      type: 'success',
      message: 'NFT Listing',
      title: 'NFT listed',
      position: 'topR',
    });
  }

  const handleWithdrawSuccess = () => {
    dispatch({
      type: 'success',
      message: 'Withdrawing proceeds',
      position: 'topR',
    });
  };

  async function setupUI() {
    const returnedProceeds = await runContractFunction({
      params: {
        abi: nftMarketplaceAbi,
        contractAddress: marketplaceAddress,
        functionName: 'getProceeds',
        params: {
          seller: account,
        },
      },
      onError: (error) => console.log(error),
    });
    if (returnedProceeds) {
      setProceeds(returnedProceeds.toString());
    }
  }

  useEffect(() => {
    setupUI();
  }, [proceeds, account, isWeb3Enabled, chainId]);

  return (
    <div>
      <Head>
        <title>NFT Marketplace</title>
        <meta name="description" content="NFT Marketplace" />
      </Head>

      <Form
        onSubmit={approveAndList}
        data={[
          {
            name: 'NFT Address',
            type: 'text',
            inputWidth: '50%',
            value: '',
            key: 'nftAddress',
          },
          {
            name: 'Token ID',
            type: 'number',
            value: '',
            key: 'tokeId',
          },
          {
            name: 'Price (ETH)',
            type: 'number',
            value: '',
            key: 'price',
          },
        ]}
        title="Sell your NFT"
        id="Main Form"
      />
      <div>Withdraw {proceeds} proceeds</div>
      {proceeds != '0' ? (
        <Button
          onClick={() => {
            runContractFunction({
              params: {
                abi: nftMarketplaceAbi,
                contractAddress: marketplaceAddress,
                functionName: 'withdrawProceeds',
                params: {},
              },
              onError: (error) => console.log(error),
              onSuccess: () => handleWithdrawSuccess,
            });
          }}
          text="Withdraw"
          type="button"
        />
      ) : (
        <div>No proceeds detected</div>
      )}
    </div>
  );
}
