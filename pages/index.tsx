import type { NextPage } from 'next'
import Head from 'next/head'

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <div className="pt-40 text-center text-3xl font-bold">
          <span className="text-indigo-500">Jammy!</span>
        </div>
      </main>
    </div>
  )
}

export default Home
