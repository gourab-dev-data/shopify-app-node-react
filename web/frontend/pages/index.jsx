import {
  Page,
  Layout
} from "@shopify/polaris";
import { useTranslation } from "react-i18next";
import React, { useEffect, useState } from 'react';
import { useAppBridge } from "@shopify/app-bridge-react";

import { OrderDetails, OrderGraphs, Card } from "../components";

export default function HomePage() {
  const { t } = useTranslation();

  const shopify = useAppBridge();
  const [productCount, setProductCount] = useState(0);
  const [collectionsCount, setcollectionsCount] = useState(0);

  useEffect(() => {
    const fetchProductCount = async () => {
      try {
        const request = await fetch("/api/products/count", {
          method: "GET",
          headers: { "Content-Type": "application/json" }
        });

        if (!request.ok) {
          throw new Error('Network response was not ok');
        }

        const response = await request.json();
        setProductCount(response.count);
        //console.log(response.count);
      } catch (error) {
        console.error('Error fetching store info:', error);
      }
    };

    const fetchCollectionsCount = async () => {
      try {
        const request = await fetch("/api/collections/count", {
          method: "GET",
          headers: { "Content-Type": "application/json" }
        });

        if (!request.ok) {
          throw new Error('Network response was not ok');
        }

        const response = await request.json();
        setcollectionsCount(response.count);
        //console.log(response);
      } catch (error) {
        console.error('Error fetching store info:', error);
      }
    };

    fetchProductCount();
    fetchCollectionsCount();
  }, []); // Empty dependency array to run only once on mount

  return (
    <Page fullWidth>
      <div className="home-section">
        <div className="graphs-section">
          <OrderGraphs />
        </div>
        <div className="cards-section">
          <Layout>
            <Card title="Product Count" data={productCount} productCard/>
            <Card title="Total collections" data={collectionsCount} collectionCard/>
            <Card title="Total Order" />
            <Card title="Shipped Order" />
            <Card title="Refund Order" />
            <Card title="Total Sale" />
          </Layout>
        </div>
        <div className="order-details-section">
          <OrderDetails />
        </div>
      </div>
    </Page>
  );
}
