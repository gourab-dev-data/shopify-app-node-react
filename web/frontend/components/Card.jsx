import { Layout, LegacyCard } from '@shopify/polaris'
import React from 'react'

export function Card({title, data, productCard, collectionCard, orderCard, pendingOrdersCard }) {
  return (
    <>
        <Layout.Section oneThird>
            <LegacyCard title={title} sectioned>
              {productCard || collectionCard || orderCard || pendingOrdersCard ? (
                <h2 className='total_count'>{data}</h2>
              ) : (
                <></>
              )}
            </LegacyCard>
        </Layout.Section>
    </>
  )
}