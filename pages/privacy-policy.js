import Head from "next/head";
import Header from "./../components/header";
import Footer from "./../components/footer";

export default function ExplorePage() {
  return (
    <>
      <Head>
        <title>Privacy Policy</title>
        <link rel="icon" href="/favicon.png" />
      </Head>

      <Header current={4}></Header>
      <div
        className="bg-[#0D0F23] dark:bg-white"
        
      >
        <div className="w-full 2xl:max-w-screen-2xl h-auto pt-[104px] flex flex-col m-auto" >
          <div
            className="container mx-auto"
            style={{ paddingLeft: "5rem", paddingRight: "5rem" ,marginBottom: "50px"}}
          >
            <h3
              class="text-4xl md:text-6xl font-bold text-white text-center"
              style={{ marginTop: "50px" }}
            >
              Privacy Poilcy
            </h3>
            <div className="text-white mt-4 text-xl">
              <ul>
                <li style={{ listStyle: "auto" }} className="mt-5">
                  This Privacy Policy sets the terms and conditions for
                  processing the User’s Personal Data while using the Website.
                  By providing the Personal Data, you also provide the Consent
                  for METAAIR to collect, hold, use and disclose your Personal
                  Data in accordance with the terms of this Privacy Policy
                </li>
                <li style={{ listStyle: "auto" }} className="mt-5">
                  METAAIR respect your privacy and are committed to protecting
                  it through our compliance with this Privacy Policy. This
                  policy describes:
                  <ul className="ml-5">
                    <li style={{ listStyle: "auto" }} className="mt-5">
                      the types of information that we may collect from you when
                      you access or use our Website – and other online Services;
                      and
                    </li>
                    <li style={{ listStyle: "auto" }} className="mt-5">
                      our practices for collecting, using, maintaining,
                      protecting and disclosing that information.
                    </li>
                  </ul>
                </li>
                <li style={{ listStyle: "auto" }} className="mt-5 mb-5">
                  This policy applies only to information we collect through our
                  Services and in the electronic communications sent through or
                  in connection with our Services
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <Footer></Footer>
    </>
  );
}
