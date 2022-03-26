import Link from "next/link";
export default function Footer() {
  return (
    <div className="bg-[#2F3787] text-white">
      <div className="w-full 2xl:max-w-screen-2xl m-auto">
        <div className="grid grid-cols-1">
          <div className="flex flex-col lg:flex-row m-4 sm:m-8 lg:m-[7vw] leading-normal">
            <div className="w-full lg:w-[21vw] mr-0 lg:mr-16">
              <img
                src="/assets/png/logo.png"
                alt="logo"
                style={{ height: "50px", width: "175px" }}
                // className="w-[40] lg:w-[5vw] h-auto"
              ></img>
              <p>
                The world’s largest BSC community-focused digital marketplace
                for crypto collectibles and non-fungible tokens (NFTs). Buy,
                sell, and discover exclusive digital assets.{" "}
              </p>
            </div>

            <div className="flex-grow flex flex-col md:flex-row mt-0 md:mt-8">
              {/* <div className="grow leading-8 my-8 md:my-0">
                                <h1 className="text-2xl leading-10">Explore</h1>
                                <p>Services</p>
                                <p>Packages</p>
                                <p>Telemedicine</p>
                                <p>Community</p>
                            </div> */}

              <div className="grow leading-8">
                <h1 className="text-2xl leading-10">About us</h1>
                <p>About us</p>
                <p>Blog</p>
                <p>Contact us</p>
              </div>

              <div className="grow leading-8 my-8 md:my-0">
                <h1 className="text-2xl leading-10">Terms and Conditions</h1>
                <p>
                  {" "}
                  <Link href="/privacy-policy">
                    <a>Privacy policy</a>
                  </Link>
                </p>
                <p>Safety</p>
                <p><Link href="/terms-of-use">
                    <a>Terms of use</a>
                  </Link></p>
              </div>

              <div className="flex flex-row">
                <img
                  src="/assets/svg/footer-helper.svg"
                  alt="footer-helper"
                  className="w-[2rem] h-[2rem] mt-2"
                ></img>
                <div className="flex-grow flex flex-col ml-4">
                  <p>Help center</p>
                  <p>We are here</p>
                  <p>for you!</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row mx-4 mb-2 sm:mx-8 sm:mb-4 lg:mx-[6vw] lg:mb-[3vw]">
            <p className="flex-none">© 2022 MetaAir. All rights reserved.</p>
            <p className="flex-none mx-0 lg:mx-8">
              <Link href="/privacy-policy">
                <a>Privacy policy</a>
              </Link>
            </p>
            <p className="flex-grow"><Link href="/terms-of-use">
                    <a>Terms & Conditions</a>
                  </Link></p>

            <p className="flex-none">
              <Link href="/">
                <a href="http://metaaircoin.com/" target="_blank">
                  {" "}
                  MetaAirCoin.com
                </a>
              </Link>{" "}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
