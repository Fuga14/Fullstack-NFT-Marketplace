import '@/styles/globals.css';
import { MoralisProvider } from 'react-moralis';
import Header from '../../components/Header';
import Image from 'next/image';
import Head from 'next/head';
import { NotificationProvider } from 'web3uikit';

import { ApolloClient, ApolloCache, ApolloProvider, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  cache: new InMemoryCache(),
  uri: 'https://api.studio.thegraph.com/query/46606/nftmarketplace/v0.0.2',
});

export default function App({ Component, pageProps }) {
  return (
    <div>
      <Head>
        <title>NFT Marketplace</title>
        <meta name="description" content="NFT Marketplace" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <MoralisProvider initializeOnMount={false}>
        <NotificationProvider>
          <ApolloProvider client={client}>
            <Header />
            <Component {...pageProps} />
          </ApolloProvider>
        </NotificationProvider>
      </MoralisProvider>
    </div>
  );
}
