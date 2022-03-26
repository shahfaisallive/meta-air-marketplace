import Head from "next/head";
import Header from "./../components/header";
import Footer from "./../components/footer";

export default function ExplorePage() {
  return (
    <>
      <Head>
        <title>Terms of use</title>
        <link rel="icon" href="/favicon.png" />
      </Head>

      <Header current={4}></Header>
      <div className="bg-[#0D0F23] dark:bg-white">
        <div className="w-full 2xl:max-w-screen-2xl h-auto pt-[104px] flex flex-col m-auto">
          <div
            className="container mx-auto"
            style={{
              paddingLeft: "5rem",
              paddingRight: "5rem",
              marginBottom: "50px",
            }}
          >
            <h3
              class="text-4xl md:text-6xl font-bold text-white text-center"
              style={{ marginTop: "50px" }}
            >
              Terms of use
            </h3>
            <div className="text-white mt-4 text-xl">
              <ul>
                <li style={{ listStyle: "auto" }} className="mt-5">
                  These Terms govern the access and use of the Website. Each
                  time the Visitor accesses the Website, it agrees to comply
                  with these Terms posted on this Website. If the Visitor does
                  not agree to any of the provisions set out in these Terms, it
                  should not use the Website or any of the services available on
                  the Website.
                </li>

                <li style={{ listStyle: "auto" }} className="mt-5 mb-5">
                  Each time the Developer submits an application for listing on
                  the Website, it has to also irrevocably agree and is bound to
                  comply with these Terms. In the event the Developer does not
                  agree to any of the provisions set out in these Terms, it
                  should not submit an application for listing on the Website.
                </li>
                <li style={{ listStyle: "auto" }} className="mt-5 mb-5">
                  The services provided on the Website are administered and
                  maintained by METAAIR. Database of information about their
                  rankings, functionalities, usage specifics and descriptions.
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
