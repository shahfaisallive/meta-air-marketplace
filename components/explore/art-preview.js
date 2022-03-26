import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEthereum } from "@fortawesome/free-brands-svg-icons";
import Link from "next/link";
import { useState, useEffect,Fragment } from "react";
import Web3 from "web3";
import { Dialog, Transition } from '@headlessui/react'

import LoaderDialog from '../dialog/loader'
import {
  FacebookShareCount,
  HatenaShareCount,
  OKShareCount,
  PinterestShareCount,
  RedditShareCount,
  TumblrShareCount,
  VKShareCount,
} from "react-share";
export default function ArtPreview(props) {
  const [Approve, setApprove] = useState(false);
  const [nftMarketAddress, setNftMarketAddress] = useState("");
const [isLoading,setIsLoading] = useState(false)
const [BidModal,setBidModal] = useState(false)
const [BidPrice,setBidPrice] = useState(0)
const [BidDetailModal,setBidDetailModal] = useState(false)
// const [TopBid,setTopBid] = useState(null)
  useEffect(() => {
    const fetchData = async () => {
      const marketContractFile = await fetch("/abis/NFTMarketPlace.json");
      //Convert all to json
      const convertMarketContractFileToJson = await marketContractFile.json();
      //Get The ABI
      const markrtAbi = convertMarketContractFileToJson.abi;

      const netWorkId = 4;

      const nftMarketWorkObject =
        convertMarketContractFileToJson.networks[netWorkId];

      if (nftMarketWorkObject) {
        const marketAddress = nftMarketWorkObject.address;
        setNftMarketAddress(marketAddress);
      }
    };
    fetchData()
    
  }, []);
  // useEffect(()=>{
  //   if(props && props.children.marketContract){
  //     getTopBid()
  //   }
  // },[props,props.children.mar])
  var ApproveItem = async () => {
    setIsLoading(true)
    //Web3.utils.toWei(props.children.item.price, 'ether')
    const price = props.children.item.price*100;
    console.log(price)
    const approved = await props.children.tokenContract.methods
      .approve(nftMarketAddress, Web3.utils.toWei(price.toString(), 'ether'))
      .send({ from: props.children.account })
      console.log(approved);
    if(approved && approved.status === true){
        setApprove(true)
        setIsLoading(false)
    }
    else{
        setApprove(false)
        setIsLoading(false)
    }
    
  };
  var placeBid = async ()=>{
    await props.children.marketContract.methods
    .placeBid(props.children.item.itemId, Web3.utils.toWei(BidPrice, 'ether'))
    .send({ from: props.children.account })
    console.log("Bid Placed",BidPrice)
    setBidModal(false)
  }
  var sellNft = async()=>{
    console.log("nftAddress", props.children.nftContract._address)
    console.log("buyer", props.children.topBid.bidPlacedBy)
    console.log(props.children.item.itemId)
    await props.children.marketContract.methods
    .sellToBidder(props.children.nftContract._address, props.children.topBid.bidPlacedBy, props.children.item.itemId)
    .send({ from: props.children.account })
    setBidDetailModal(false)
  }
  // var getTopBid = async()=>{
  //   const bid = await props.children.marketContract.methods.bids(props.children.item.itemId).call()        
  //   setTopBid(bid)     
  // }
  return (
    <div className="flex flex-col lg:flex-row items-center space-x-0 space-y-8 lg:space-x-8 lg:space-y-0 bg-[#161A42] border-2 border-[#161A42] dark:bg-white dark:border-2 dark:border-gray-200 rounded-md p-6">
      <div className="flex-none w-full lg:w-[30%]">
        <img src={props.children.item.image} className="w-full"></img>
      </div>

      <div className="flex-1 w-full flex flex-col lg:flex-row space-x-0 space-y-8 lg:space-x-8 lg:space-y-0">
        <div className="flex-grow text-white dark:text-gray-800">
          <h1 className="text-4xl font-bold leading-normal">
            {props.children.item.name}
          </h1>

          <h4 className="text-[#6C71AD] text-2xl">
            {props.children.item.category}
          </h4>

          <p className="text-[#B4BAEF] dark:text-gray-600 text-base my-6">
            {props.children.item.description}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="flex-1 flex flex-col space-y-6">
              <div className="flex flex-row space-x-4">
                <div className="flex-none w-14 h-14 rounded-full bg-gradient-to-b from-[#FF2D92] to-[#FFA25F]"></div>
                <div className="flex-1 flex flex-col text-ellipsis overflow-hidden">
                  <p className="text-[#7D82B2] dark:text-gray-800 text-base">
                    Sell By
                  </p>
                  <p className="text-white dark:text-gray-500 text-base font-bold text-ellipsis overflow-hidden whitespace-nowrap">
                    {props.children.item.seller}
                  </p>
                </div>
              </div>
              {/* <button
                  className="w-48 rounded-full bg-gradient-to-b from-[#3461FF] to-[#8454EB] text-white text-base uppercase py-2 shadow-md m-auto ml-0 border-2 border-[#161A42] dark:border-white"
                  onClick={() =>
                    {props.children.tokenContract.methods.mint('0x3305e1AC935039D775E4fc45f4065e79D9Fe61B5', BigInt(200000000000000000000)).send({from: props.children.account})}
                  }
                >
                  ⚡ Shah Faisal Mint
                </button>
                <button
                  className="w-48 rounded-full bg-gradient-to-b from-[#3461FF] to-[#8454EB] text-white text-base uppercase py-2 shadow-md m-auto ml-0 border-2 border-[#161A42] dark:border-white"
                  onClick={async() =>
                    {
                        const allow = await props.children.tokenContract.methods.allowance('0x0b7C7Efe2183fEf476b5f86cE53dA612c5dC89b6', nftMarketAddress).call()
                        console.log(allow)
                    }
                  }
                >
                  ⚡ Zeeshan Check Allowance
                </button> */}
              {props.children.item.sold ? (
                ""
              ) : Approve ? (
                <button
                  className="w-48 rounded-full bg-gradient-to-b from-[#FF2D92] to-[#FFA25F] text-white text-base uppercase py-2 shadow-md m-auto ml-0 border-2 border-[#161A42] dark:border-white"
                  onClick={() =>
                    props.children.buyFunction(props.children.item)
                  }
                >
                  ⚡ BUY NOW
                </button>
              ) : (
                <button
                  className="w-48 rounded-full bg-gradient-to-b from-[#3461FF] to-[#8454EB] text-white text-base uppercase py-2 shadow-md m-auto ml-0 border-2 border-[#161A42] dark:border-white"
                  onClick={() => ApproveItem()}
                  disabled={isLoading}
                >
                  ⚡ APPROVE{" "} 
                </button>
              )}
            </div>
            {/* <button onClick={async() =>{
              const bid = await props.children.marketContract.methods.bids(props.children.item.itemId).call()             
              console.log(bid)
            }}>Get Highest Bid</button> */}

            <div className="flex-1 flex flex-col space-y-6">
              <div className="flex flex-row space-x-4">
                <div className="flex-none w-14 h-14 rounded-full bg-gradient-to-b from-[#FF2D92] to-[#FFA25F]"></div>
                <div className="flex flex-col text-ellipsis overflow-hidden">
                  <p className="text-[#7D82B2] dark:text-gray-800 text-base">
                    Created By
                  </p>
                  <p className="text-white dark:text-gray-500 text-base font-bold text-ellipsis overflow-hidden whitespace-nowrap">
                    {props.children.item.creator}
                  </p>
                </div>
              </div>
              {!props.children.item.sold && Approve ? <button
              className="w-48 rounded-full bg-gradient-to-b from-[#FF2D92] to-[#FFA25F] text-white text-base uppercase py-2 shadow-md m-auto ml-0 border-2 border-[#161A42] dark:border-white"
              onClick={() => {setBidModal(!BidModal)}}
              disabled={isLoading}
            >
              ⚡ Place Bid{" "} 
            </button>:""
              }
            </div>
          </div>
        </div>

        <div className="flex-none items-start">
          <div className="flex flex-row">
            <div className="rounded-full w-[1.5rem] text-center  text-white">
              {/* <FontAwesomeIcon icon={faEthereum} className="" /> */}
              <img src="/assets/png/mair.png" />
            </div>
            <h1 className="flex-grow text-[#47DEF2] text-base ml-2">
              {props.children.item.price}MAIR
            </h1>
          </div>
          {
            props.children.topBid && 
            <>
            <label className="text-white">Top Bid</label>
            <div  style={{color:"#FFA25F",cursor:"pointer"}} onClick={()=>setBidDetailModal(!BidDetailModal)}>{Web3.utils.fromWei(props.children.topBid.bidAmount, 'ether')} MAIR</div>
            </>
          }
        </div>
      </div>
      <LoaderDialog show={isLoading} openLoaderModal={()=>setIsLoading(!isLoading)}></LoaderDialog>
      <Transition appear show={BidModal} as={Fragment}>
            <Dialog
            as="div"
            className="fixed inset-0 z-100 overflow-y-auto"
            onClose={()=>setBidModal(!BidModal)}
            >
            <div className="min-h-screen px-4 text-center">
                <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
                >
                <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-80 transition-opacity" />
                </Transition.Child>

                {/* This element is to trick the browser into centering the PriceModal contents. */}
                <span
                className="inline-block h-screen align-middle"
                aria-hidden="true"
                >
                &#8203;
                </span>
                <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
                >
                <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-[#24274D] dark:bg-white shadow-xl">
                    <Dialog.Title
                    as="h3"
                    className="text-white text-2xl font-semibold leading-6 "
                    >
                    </Dialog.Title>

                    <div className="relative text-[#B4BAEF]">
                      <label className="text-white">Bid Price</label>
                  <input
                    className="w-full text-sm p-3.5 pr-16 rounded-md border border-[#9FA4FF] bg-[#212760] dark:bg-white focus:outline-none focus:ring-2"
                    type="number"
                    min={0}
                    placeholder="Price"
                    id="nft-price"
                    value={BidPrice}
                    onChange={(e) =>{
                      setBidPrice(e.target.value)
                    }
                      
                    }
                  ></input>

                  <p className="absolute top-1/2 right-8 -translate-y-1/2 text-sm">
                    <img src="/assets/png/mair-white.png" style={{marginTop:"25px"}} />
                  </p>
                  {/* <FontAwesomeIcon
                    icon={faEthereum}
                    className="absolute top-1/2 right-4 -translate-y-1/2 text-sm"
                  /> */}
                </div>
                <div style={{display:"flex",marginTop:"15px"}}>
                <button
                  className="w-48 rounded-full bg-gradient-to-b from-[#FF2D92] to-[#FFA25F] text-white text-base uppercase py-2 shadow-md m-auto ml-0 border-2 border-[#161A42] dark:border-white"
                  onClick={() =>{
                    setBidPrice(0)
                    setBidModal(false)}
                  }
                >
                   Cancel
                </button>
              
                <button
                  className="w-48 rounded-full bg-gradient-to-b from-[#3461FF] to-[#8454EB] text-white text-base uppercase py-2 shadow-md m-auto ml-0 border-2 border-[#161A42] dark:border-white"
                  onClick={() => placeBid()}
                  disabled={isLoading}
                >
                Place Bid
                </button>
                </div>
                </div>
                </Transition.Child>
            </div>
            </Dialog>
        </Transition>
        <Transition appear show={BidDetailModal} as={Fragment}>
            <Dialog
            as="div"
            className="fixed inset-0 z-100 overflow-y-auto"
            onClose={()=>setBidDetailModal(!BidDetailModal)}
            >
            <div className="min-h-screen px-4 text-center">
                <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
                >
                <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-80 transition-opacity" />
                </Transition.Child>

                {/* This element is to trick the browser into centering the PriceModal contents. */}
                <span
                className="inline-block h-screen align-middle"
                aria-hidden="true"
                >
                &#8203;
                </span>
                <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
                >
                <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-[#24274D] dark:bg-white shadow-xl">
                    <Dialog.Title
                    as="h3"
                    className="text-white text-2xl font-semibold leading-6 "
                    >
                    </Dialog.Title>

                   
                
                   
                        <div className="text-white">Bid By : {props.children.topBid && props.children.topBid.bidPlacedBy}</div>
                        <div className="text-white">Bid Amount : { props.children.topBid && Web3.utils.fromWei(props.children.topBid.bidAmount, 'ether')}</div>
                        <div> <button
                  className="w-48 rounded-full bg-gradient-to-b from-[#3461FF] to-[#8454EB] text-white text-base uppercase py-2 shadow-md m-auto ml-0 border-2 border-[#161A42] dark:border-white"
                  onClick={()=>{sellNft()}}
                
                  
                >
                  ⚡ SELL 
                </button></div>
                      
               </div>
                
                
                </Transition.Child>
            </div>
            </Dialog>
        </Transition>
    </div>
  );
}
