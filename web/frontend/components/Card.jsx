import { Layout, LegacyCard } from '@shopify/polaris'
import React from 'react'

export function Card({title, data, productCard, collectionCard}) {
  return (
    <>
        <Layout.Section oneThird>
            <LegacyCard title={title} sectioned>
              {productCard || collectionCard ? (
                <h2 className='total_count'>{data}</h2>
              ) : (
                <>
                  {!productCard && <p>No product data available</p>}
                  {!collectionCard && <p>No collection data available</p>}
                </>
              )}
            </LegacyCard>
        </Layout.Section>
    </>
  )
}