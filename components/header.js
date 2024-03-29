import Link from "next/link";
import { Fragment, useState, useContext, useRef, useEffect } from "react";
import { Dialog,Disclosure, Menu, Transition, Switch } from "@headlessui/react";
import { BellIcon, MenuIcon, XIcon } from "@heroicons/react/outline";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClone } from "@fortawesome/free-regular-svg-icons";
import Onboard from "bnc-onboard";


import {
  faMoon,
  faShoppingBag,
  faDollar,
  faCircleUser,
  faUserCircle,
} from "@fortawesome/free-solid-svg-icons";
import { ThemeContext } from "../pages/_app";
import Web3Provider from "./web3";
import Web3 from "web3";
import { useWeb3 } from "./web3";
import detectEthereumProvider from "@metamask/detect-provider";
import SuccessDialog from "./dialog/success";

// themeMode : true : dark, false : light
export default function Header(props) {
  const [currentPage, setCurrentPage] = useState(props.current);
  const { themeMode, toggleThemeMode } = useContext(ThemeContext);

  const INFURA_KEY = 'b451483d68834ca2aa4806a999834f21';
  const rpcUrlInfura = 'wss://rinkeby.infura.io/ws/v3/b451483d68834ca2aa4806a999834f21';
  const headers = [
    { name: "Explore", href: "/explore " },
    { name: "Categories", href: "/categories" },
    { name: "Create NFT", href: "/create-nft" },
  ];

  const walletsList = [
    { walletName: "metamask", preferred: true },
    {
      walletName: "walletConnect",
      infuraKey: INFURA_KEY,
      preferred: true,
    },
    { walletName: "coinbase", preferred: true },
    { walletName: "trust", preferred: true, rpcUrl: rpcUrlInfura },
    { walletName: "authereum" },
    {
      walletName: "ledger",
      rpcUrl: rpcUrlInfura,
    },
    {
      walletName: "keepkey",
      rpcUrl: rpcUrlInfura,
    }
  ];

  const onboard = Onboard({
    networkId: 4,
    subscriptions: {
      wallet: (wallet) => {
        // instantiate web3 when the user has selected a wallet
        web3 = new Web3(wallet.provider);
      },
    },
    walletSelect: {
      wallets: walletsList,
    },
  })

  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  const web3Api = useWeb3();
  console.log(web3Api);

  //Craete function to listen the change in account changed and network changes

  //Create LoadAccounts Function
  const account = web3Api.account;
  const [accountBalance, setAccountBalance] = useState(0);
  const [MetaMaskDialog,setMetaMaskDialog] = useState(false)
  useEffect(() => {
    const loadBalance = async () => {
      if (account) {
        const myBalance = await web3Api.web3.eth.getBalance(account);
        const convertBalance = await web3Api.web3.utils.fromWei(
          myBalance,
          "ether"
        );
        setAccountBalance(convertBalance);
      }
    };

    loadBalance();
  }, [account]);
  //Connect Metamask Wallet
  // const connectMetamask = async () => {
  //   const currentProvider = await detectEthereumProvider();
  //   console.log("WE ARE IN META MASK CONNECT");
  //   if (currentProvider) {
  //     // let web3InstanceCopy = new Web3(currentProvider);
  //     // setWeb3Instance(web3InstanceCopy);
  //     if (!window.ethereum.selectedAddress) {
  //       await window.ethereum.request({ method: "eth_requestAccounts" });
  //     }
  //     await window.ethereum.enable();
  //     let currentAddress = window.ethereum.selectedAddress;
  //     console.log(currentAddress);
  //     account = currentAddress;
  //     const web3 = new Web3(currentProvider);
  //     let amount = await web3.eth.getBalance(currentAddress);
  //     amount = web3.utils.fromWei(web3.utils.toBN(amount), "ether");
  //   } else {
  //     console.log("https://metamask.app.link/dapp/ethereum.stackexchange.com/")
  //     setMetaMaskDialog(true)
  //   }
  // };

  async function onboardLoginFunc() {
    // Prompt user to select a wallet
    await onboard.walletSelect();
    // Run wallet checks to make sure that user is ready to transact
    let walletCheck = await onboard.walletCheck();
    return walletCheck;
  }

  let [successOpen, setSuccessOpen] = useState(false);
  let [loaderOpen, setLoaderOpen] = useState(false);

  function closeLoaderModal() {
    setLoaderOpen(false);
  }

  function openLoaderModal() {
    setLoaderOpen(true);
  }

  function closeSuccessModal() {
    setSuccessOpen(false);
  }

  function openSuccessModal() {
    setSuccessOpen(true);
  }

  useEffect(() => {
    if (account) {
      closeSuccessModal();
    } else {
      openSuccessModal();
    }
  }, [account]);

  return (
    <Disclosure
      as="nav"
      className="z-50 fixed w-full h-[104px] transition-all bg-[#002046] dark:bg-white dark:border-b dark:border-gray-200"
    >
      {({ open }) => (
        <div className="w-full 2xl:max-w-screen-2xl h-full mx-auto">
          <div className="mx-auto px-4 sm:px-8 lg:px-[6vw] h-full">
            <div className="relative flex items-center justify-between h-full">
              <div className="absolute inset-y-0 left-0 flex items-center lg:hidden">
                {/* Mobile menu button*/}
                <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-white dark:text-gray-800 focus:ring-neutral-400 focus:ring-2 focus:ring-inset">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>

              <div className="flex-1 flex items-center justify-center lg:items-stretch lg:justify-start h-full">
                <div className="flex-none self-center">
                  <Link href="/">
                    <a>
                      <img
                        style={{ height: "50px" }}
                        src={"/assets/png/logo.png"}
                        // src={
                        //     "/assets/png/logo-" +
                        //     (themeMode ? "dark" : "light") +
                        //     ".png"
                        //   }
                        alt="Logo"
                        className="h-16 w-auto"
                      ></img>
                    </a>
                  </Link>
                </div>
                <div className="hidden lg:block lg:ml-4 flex-1 h-full">
                  <div className="flex lg:space-x-1 xl:space-x-4 h-full">
                    {headers.map((item, index) => (
                      <div
                        key={item.name}
                        className={classNames(
                          "flex items-center ",
                          index === currentPage
                            ? "border-[#168BF8] border-b-2 text-white dark:text-gray-800"
                            : "text-gray-200 dark:text-gray-600",
                          "hover:text-gray-400 dark:hover:text-gray-400 font-bold"
                        )}
                      >
                        <Link href={item.href}>
                          <a
                            className="block px-3 py-2 rounded-md text-base"
                            aria-current={
                              index === currentPage ? "page" : undefined
                            }
                            onClick={() => setCurrentPage(index)}
                          >
                            {item.name}
                          </a>
                        </Link>
                      </div>
                    ))}

                    <div className="flex-grow"></div>

                    {/* dark or light mode */}
                    <div
                      className="relative grid place-items-center"
                      style={{ display: "flex" }}
                    >
                      <button
                        class="rounded-full bg-gradient-to-b from-[#3461FF] to-[#8454EB] text-white text-xs sm:text-base px-6 sm:px-10 py-1.5 sm:py-2 shadow-lg"
                        style={{
                          marginRight: "5px",
                          padding: "10px",
                          fontSize: "15px",
                        }}
                      >
                        <a href="http://metaaircoin.com/" target="_blank">
                          {" "}
                          Buy MetaAirCoin
                        </a>
                      </button>
                      <Switch
                        checked={themeMode}
                        onChange={toggleThemeMode}
                        className={classNames(
                          themeMode ? "bg-white" : "bg-[#8B8DA1]",
                          "transition duration-150 ease-out relative inline-flex items-center h-6 rounded-full w-12"
                        )}
                      >
                        <div className="absolute left-0 w-1/2 text-[#FFE951]">
                          <FontAwesomeIcon icon={faMoon}></FontAwesomeIcon>
                        </div>
                        <span
                          className={classNames(
                            themeMode
                              ? "bg-[#8B8DA1] translate-x-6"
                              : "bg-white translate-x-0",
                            "inline-block w-6 h-6 transform rounded-full transition duration-300"
                          )}
                        />
                      </Switch>
                    </div>

                    <div className="border-r-2 border-[#787984] my-9">
                      &nbsp;
                    </div>

                    {/* account address */}
                    {account ? (
                      <Menu
                        as="div"
                        className="relative inline-block text-left"
                      >
                        <div className="h-full grid place-items-center">
                          <Menu.Button className="inline-flex justify-center w-full px-0 py-2 text-sm font-medium">
                            <div className="flex flex-row space-x-4">
                              <div className="flex-none w-12 h-12 rounded-full bg-gradient-to-b from-[#FF2D92] to-[#FFA25F]"></div>

                              <div className="flex flex-col ">
                                <p className="flex-1 text-white dark:text-gray-800 text-sm font-bold ">
                                  {" "}
                                  {account}
                                </p>
                                <p className="text-[#7D82B2] dark:text-gray-800 text-xs text-left">
                                  {accountBalance} MAIR
                                </p>
                              </div>
                            </div>
                          </Menu.Button>
                        </div>

                        <Transition
                          as={Fragment}
                          enter="transition ease-out duration-100"
                          enterFrom="transform opacity-0 scale-95"
                          enterTo="transform opacity-100 scale-100"
                          leave="transition ease-in duration-75"
                          leaveFrom="transform opacity-100 scale-100"
                          leaveTo="transform opacity-0 scale-95"
                        >
                          <Menu.Items className="absolute right-0 w-80 mt-4 p-8 origin-top-right bg-[#24274D] dark:bg-white divide-y divide-gray-100 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                            <div className="flex flex-col space-y-6">
                              <Link href="/account/myProfile">
                                <a>
                                  <Menu.Item>
                                    <div className="flex flex-row space-x-3">
                                      <div className="">
                                        <img src="/assets/svg/brand-metamask.svg"></img>
                                      </div>
                                      <div className="flex-1 flex flex-col">
                                        <p className="flex-1 text-white dark:text-gray-800 text-sm font-bold">
                                          Ether Balance{" "}
                                        </p>
                                        <p className="text-[#7D82B2] text-xs text-left">
                                          {accountBalance}
                                        </p>
                                      </div>
                                      <div className="grid place-items-center w-[22px] h-[22px] bg-[#215BF0] text-[#FAD804] text-xs font-bold rounded-sm">
                                        <FontAwesomeIcon
                                          icon={faCircleUser}
                                        ></FontAwesomeIcon>
                                      </div>
                                    </div>
                                  </Menu.Item>
                                </a>
                              </Link>

                              <div className="border border-[#787984]"></div>

                              <Link href="/market/nft-purchased">
                                <a>
                                  <Menu.Item>
                                    <div className="flex flex-row items-center space-x-4 text-white dark:text-gray-800">
                                      <div className="text-center text-2xl w-6">
                                        <FontAwesomeIcon
                                          icon={faShoppingBag}
                                        ></FontAwesomeIcon>
                                      </div>
                                      <div className="flex-1  text-sm">
                                        NFT Purchased
                                      </div>
                                    </div>
                                  </Menu.Item>
                                </a>
                              </Link>

                              <div className="border border-[#787984]"></div>

                              <Link href="/market/nft-resell">
                                <a>
                                  <Menu.Item>
                                    <div className="flex flex-row items-center space-x-4 text-white dark:text-gray-800">
                                      <div className="text-center text-2xl w-6">
                                        <FontAwesomeIcon
                                          icon={faDollar}
                                        ></FontAwesomeIcon>
                                      </div>
                                      <div className="flex-1 text-sm">
                                        NFT Resell
                                      </div>
                                    </div>
                                  </Menu.Item>
                                </a>
                              </Link>

                              <div className="border border-[#787984]"></div>
                            </div>
                          </Menu.Items>
                        </Transition>
                      </Menu>
                    ) : (
                      <button
                        className="rounded-md bg-gradient-to-b  m-6 from-[#3461FF] to-[#8454EB] text-white text-base  sm:px-2 shadow-lg"
                        // onClick={connectMetamask}
                        onClick={onboardLoginFunc}
                      >
                        Connect Wallet
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile menu button*/}

          <Disclosure.Panel className="lg:hidden bg-[#24274D] dark:bg-white">
            <div className="flex flex-col just space-y-4 p-4">
              {headers.map((item, index) => (
                <Disclosure.Button
                  key={item.name}
                  as="a"
                  href={item.href}
                  className={classNames(
                    "flex-1",
                    index === currentPage
                      ? "text-gray-200 dark:text-gray-800"
                      : "text-gray-400 dark:text-gray-600",
                    "hover:text-gray-400 dark:hover:text-gray-400 font-semibold block px-3 py-2 rounded-md text-base"
                  )}
                  aria-current={index === currentPage ? "page" : undefined}
                >
                  {item.name}
                </Disclosure.Button>
              ))}
{!account && <button

                       className={classNames(
                        "flex-1",
                         "text-gray-400 dark:text-gray-600",
                        "hover:text-gray-400 dark:hover:text-gray-400 font-semibold block px-3 py-2 rounded-md text-base text-left"
                      )}
                        // onClick={connectMetamask}
                        onClick={onboardLoginFunc}
                      >
                        Connect Wallet
                      </button>}
              {/* dark or light mode */}
              <div className="flex-1 relative grid px-3 py-2">
                <Switch
                  checked={themeMode}
                  onChange={toggleThemeMode}
                  className={classNames(
                    themeMode ? "bg-white" : "bg-[#8B8DA1]",
                    "transition duration-150 ease-out relative inline-flex items-center h-6 rounded-full w-12"
                  )}
                >
                  <div className="absolute left-0 w-1/2 text-[#FFE951]">
                    <FontAwesomeIcon icon={faMoon}></FontAwesomeIcon>
                  </div>
                  <span
                    className={classNames(
                      themeMode
                        ? "bg-[#8B8DA1] translate-x-6"
                        : "bg-white translate-x-0",
                      "inline-block w-6 h-6 transform rounded-full transition duration-300"
                    )}
                  />
                </Switch>
              </div>

              {/* account address */}
              {account ? (
                <Disclosure>
                  {({ open }) => (
                    <>
                      <Disclosure.Button className="flex justify-between w-full px-4 py-2 text-sm font-medium text-left focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75">
                        <div className="flex flex-row space-x-4">
                          <div className="flex-none w-12 h-12 rounded-full bg-gradient-to-b from-[#FF2D92] to-[#FFA25F]"></div>

                          <div className="flex flex-col ">
                            <p className="flex-1 text-white dark:text-gray-800 text-sm font-bold">
                              {account}
                            </p>
                            <p className="text-[#7D82B2] text-xs text-left">
                              {accountBalance} MAIR
                            </p>
                          </div>
                        </div>
                      </Disclosure.Button>
                      <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500">
                        <div className="flex flex-col space-y-6">
                          <Link href="/account/myProfile">
                            <a>
                              <div className="flex flex-row space-x-3">
                                <div className="">
                                  <img src="/assets/svg/brand-metamask.svg"></img>
                                </div>
                                <div className="flex-1 flex flex-col">
                                  <p className="flex-1 text-white dark:text-gray-800 text-sm font-bold">
                                    Account Address
                                  </p>
                                  <p className="text-[#7D82B2] text-xs text-left">
                                    This is a sub-headline
                                  </p>
                                </div>
                                <div className="grid place-items-center w-[22px] h-[22px] bg-[#215BF0] text-[#FAD804] text-xs font-bold rounded-sm">
                                  <FontAwesomeIcon
                                    icon={faCircleUser}
                                  ></FontAwesomeIcon>
                                </div>
                              </div>
                            </a>
                          </Link>

                          <Link href="/market/nft-purchased">
                            <a>
                              <div className="flex flex-row items-center space-x-4 text-white dark:text-gray-800">
                                <div className="text-center text-2xl w-6">
                                  <FontAwesomeIcon
                                    icon={faShoppingBag}
                                  ></FontAwesomeIcon>
                                </div>
                                <div className="flex-1 text-sm">
                                  NFT Purchased
                                </div>
                              </div>
                            </a>
                          </Link>

                          <Link href="/market/nft-resell">
                            <a>
                              <div className="flex flex-row items-center space-x-4 text-white dark:text-gray-800">
                                <div className="text-center text-2xl w-6">
                                  <FontAwesomeIcon
                                    icon={faDollar}
                                  ></FontAwesomeIcon>
                                </div>
                                <div className="flex-1 text-sm">NFT Resell</div>
                              </div>
                            </a>
                          </Link>
                        </div>
                      </Disclosure.Panel>
                    </>
                  )}
                </Disclosure>
              ) : (
                ""
              )}
            </div>
          </Disclosure.Panel>

          <SuccessDialog
            show={successOpen}
            closeSuccessModal={closeSuccessModal}
          >
            {{
              msg: "PLease Connect MetaMask With Binance NetWork",
              title: "Attention",
              buttonTitle: "Cancel",
            }}
          </SuccessDialog>
          <Transition appear show={MetaMaskDialog} as={Fragment}>
            <Dialog
            as="div"
            className="fixed inset-0 z-100 overflow-y-auto"
            onClose={()=>setMetaMaskDialog(!MetaMaskDialog)}
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
                    <img src="https://img.icons8.com/color/48/000000/metamask-logo.png"/>
                    <div className="text-white">
                    Tap the button below to <b>Open MetMask</b>. Please access this site on MetaMask's in-app browser for a seamless experience.
                      </div>
                      <div className="text-right">
                        <a className="bg-gradient-to-b from-[#FF2D92] to-[#FFA25F] p-2 text-white" href="https://metamask.app.link/dapp/ethereum.stackexchange.com/" target="_blank">
                          Open MetaMask
                        </a>
                      </div>
                </div>
                </Transition.Child>
            </div>
            </Dialog>
        </Transition>
        </div>
      )}
    </Disclosure>
  );
}
