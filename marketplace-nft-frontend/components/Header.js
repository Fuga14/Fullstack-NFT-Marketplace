import { ConnectButton } from 'web3uikit';
import Link from 'next/link';

export default function Header() {
  return (
    <nav className="p-5 border-b-4 flex flex-row justify-between items-center bg-blue-950">
      <h1 className="py-4 px-4 font-bold text-3xl text-white">NFT Marketplace</h1>
      <div className="flex flex-row items-center">
        <Link
          href="/"
          className="mr-4 p-6 font-bold text-2xl bg-transparent hover:bg-blue-500 text-white font-semibold hover:text-white border border-blue-500 hover:border-transparent rounded"
        >
          Main
        </Link>
        <Link
          href="/sell-nft"
          className="mr-4 p-6 font-bold text-2xl bg-transparent hover:bg-blue-500 text-white font-semibold hover:text-white border border-blue-500 hover:border-transparent rounded"
        >
          Sell page
        </Link>
        {/* <Link
                    href="/graphExample"
                    className="mr-4 p-6 font-bold text-2xl bg-transparent hover:bg-blue-500 text-white font-semibold hover:text-white border border-blue-500 hover:border-transparent rounded"
                >
                    GraphExample
                </Link> */}
        <ConnectButton moralisAuth={false} />
      </div>
    </nav>
  );
}
