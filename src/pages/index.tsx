import { GetStaticProps } from 'next'
import Head from 'next/head'
import { SubscribeButton } from '../components/SubscribeButton'
import { stripe } from '../services/stripe'
import Image from 'next/image'
import styles from '../styles/home.module.scss'
import GirlCodingImage from '../../public/images/avatar.svg'

interface HomeProps {
  product: {
    priceId: string,
    amount: string
  }
}

export default function Home({product}: HomeProps) {
  return (
    <>
      <Head>
        <title>Home | ig.news</title>
      </Head>
      <main className={styles.container}>
        <section className={styles.section}>
          <span>👏 Hey, welcome!</span>
          <h1>News about the <span>React</span> world.</h1>
          <p>
            Get access to all the publications <br />
            <span>for {product.amount} a month</span>
          </p>
          <SubscribeButton />
        </section>
        <Image src={GirlCodingImage} alt="Girl coding" />
      </main>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const price = await stripe.prices.retrieve('price_1JF7oQKXIC7vSxGj16SiCSv2', {
    expand: ['product']
  })

  const product = {
    priceId: price.id,
    amount: new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price.unit_amount / 100)
  }

  return {
    props: {
      product: product
    },
    revalidate: 60 * 60 * 24 // 1 dia
  }
}
