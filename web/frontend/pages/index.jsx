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
  const [collectionsCount, setCollectionsCount] = useState(0);
  const [ordersCount, setOrderCount] = useState(0);
  const [pendingOrdersCount, setPendingOrdersCount] = useState(0);

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
        setCollectionsCount(response.count);
        //console.log(response);
      } catch (error) {
        console.error('Error fetching store info:', error);
      }
    };

    const fetchOrdersCount = async () => {
      try {
        const request = await fetch("/api/order/count", {
          method: "GET",
          headers: { "Content-Type": "application/json" }
        });

        if (!request.ok) {
          throw new Error('Network response was not ok');
        }

        const response = await request.json();
        setOrderCount(response.count);
        //console.log(response);
      } catch (error) {
        console.error('Error fetching store info:', error);
      }
    };

    const fetchPendingOrdersCount = async () => {
      try {
        const request = await fetch("/api/pendingorder/count", {
          method: "GET",
          headers: { "Content-Type": "application/json" }
        });

        if (!request.ok) {
          throw new Error('Network response was not ok');
        }

        const response = await request.json();
        setPendingOrdersCount(response.count);
        console.log(response);
      } catch (error) {
        console.error('Error fetching store info:', error);
      }
    };

    /*const fetchTotalSale = async () => {
      try {
        const request = await fetch("/api/total/sale", {
          method: "GET",
          headers: { "Content-Type": "application/json" }
        });

        if (!request.ok) {
          throw new Error('Network response was not ok');
        }

        const response = await request.json();
        //setPendingOrdersCount(response.count);
        console.log(response);
      } catch (error) {
        console.error('Error fetching store info:', error);
      }
    };*/
    
    fetchProductCount();
    fetchCollectionsCount();
    fetchOrdersCount();
    fetchPendingOrdersCount();
    //fetchTotalSale();
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
            <Card title="Total Order" data={ordersCount} orderCard/>
            <Card title="Pending Order" data={pendingOrdersCount} pendingOrdersCard/>
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
