import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAppBridge } from "@shopify/app-bridge-react";

export function TopBar() {
  const shopify = useAppBridge();
  const [storeName, setStoreName] = useState("");

  useEffect(() => {
    const fetchStoreInfo = async () => {
      try {
        const request = await fetch("/api/store/info", {
          method: "GET",
          headers: { "Content-Type": "application/json" }
        });

        if (!request.ok) {
          throw new Error('Network response was not ok');
        }

        const response = await request.json();
        setStoreName(response.shop.name);
        //console.log(response);
      } catch (error) {
        console.error('Error fetching store info:', error);
      }
    };

    fetchStoreInfo();
  }, []); // Empty dependency array to run only once on mount

  return (
    <div className='topbar-section'>
      <div className="logo-block">
        <img className='logo' src="../assets/logo.png" alt="logo" />
        <h1 className='text-bold h4'>{storeName}</h1>
        <NavLink to="/">Sales</NavLink>
        <NavLink to="/products">Products</NavLink>
      </div>
    </div>
  );
}
