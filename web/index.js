// @ts-check
import { join } from "path";
import { readFileSync } from "fs";
import express from "express";
import serveStatic from "serve-static";

import shopify from "./shopify.js";
import productCreator from "./product-creator.js";
import PrivacyWebhookHandlers from "./privacy.js";

const PORT = parseInt(
  process.env.BACKEND_PORT || process.env.PORT || "3000",
  10
);

const STATIC_PATH =
  process.env.NODE_ENV === "production"
    ? `${process.cwd()}/frontend/dist`
    : `${process.cwd()}/frontend/`;

const app = express();

// Set up Shopify authentication and webhook handling
app.get(shopify.config.auth.path, shopify.auth.begin());
app.get(
  shopify.config.auth.callbackPath,
  shopify.auth.callback(),
  shopify.redirectToShopifyOrAppRoot()
);
app.post(
  shopify.config.webhooks.path,
  shopify.processWebhooks({ webhookHandlers: PrivacyWebhookHandlers })
);

// If you are adding routes outside of the /api path, remember to
// also add a proxy rule for them in web/frontend/vite.config.js

app.use("/api/*", shopify.validateAuthenticatedSession());

app.use(express.json());

// Get store info
app.get("/api/store/info", async (_req, res) => {
  const client = new shopify.api.clients.Graphql({
    session: res.locals.shopify.session,
  });
  const shopinfo = await client.query({
    data: `query {
      shop {
        name
        currencyCode
        checkoutApiSupported
        taxesIncluded
        resourceLimits {
          maxProductVariants
        }
      }
    }`,
  });
  res.status(200).send({ shop: shopinfo.body.data.shop });
})

// Get total orders
app.get("/api/order/count", async (_req, res) => {
  const client = new shopify.api.clients.Graphql({
    session: res.locals.shopify.session,
  });

  const countData = await client.request(`
    query {
      ordersCount {
        count
      }
    }
  `);

  res.status(200).send({ count: countData.data.ordersCount.count });
});

// Get pending orders
app.get("/api/pendingorder/count", async (_req, res) => {
  const client = new shopify.api.clients.Graphql({
    session: res.locals.shopify.session,
  });

  const countData = await client.request(`
    query {
      pendingOrdersCount {
        count
      }
    }
  `);

  res.status(200).send({ count: countData.data.pendingOrdersCount.count });
});

// Get total sale
/*app.get("/api/total/sale", async (_req, res) => {
  const client = new shopify.api.clients.Graphql({
    session: res.locals.shopify.session,
  });
  const GET_ORDERS = gql`
    query getOrders($first: Int!, $after: String) {
      orders(first: $first, after: $after, query: "financial_status:paid") {
        edges {
          node {
            id
            totalPrice
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  `;
  async function getTotalSales() {
    let totalSales = 0;
    let hasNextPage = true;
    let cursor = null;

    while (hasNextPage) {
        const variables = { first: 250, after: cursor }; // Adjust the limit as needed
        const response = await client.request(GET_ORDERS, variables);
        
        response.orders.edges.forEach(edge => {
            totalSales += parseFloat(edge.node.totalPrice);
        });

        hasNextPage = response.orders.pageInfo.hasNextPage;
        cursor = response.orders.pageInfo.endCursor;
    }

    console.log(`Total Sales Amount: $${totalSales.toFixed(2)}`);
    res.status(200).send({ sale: `${totalSales.toFixed(2)}` });
  }

  getTotalSales().catch(error => {
      console.error('Error fetching orders:', error);
  });
});*/

// Get total collections
app.get("/api/collections/count", async (_req, res) => {
  const client = new shopify.api.clients.Graphql({
    session: res.locals.shopify.session,
  });

  const countData = await client.request(`
    query {
      collectionsCount {
        count
      }
    }
  `);

  res.status(200).send({ count: countData.data.collectionsCount.count });
});

app.get("/api/products/count", async (_req, res) => {
  const client = new shopify.api.clients.Graphql({
    session: res.locals.shopify.session,
  });

  const countData = await client.request(`
    query shopifyProductCount {
      productsCount {
        count
      }
    }
  `);

  res.status(200).send({ count: countData.data.productsCount.count });
});

app.post("/api/products", async (_req, res) => {
  let status = 200;
  let error = null;

  try {
    await productCreator(res.locals.shopify.session);
  } catch (e) {
    console.log(`Failed to process products/create: ${e.message}`);
    status = 500;
    error = e.message;
  }
  res.status(status).send({ success: status === 200, error });
});

app.use(shopify.cspHeaders());
app.use(serveStatic(STATIC_PATH, { index: false }));

app.use("/*", shopify.ensureInstalledOnShop(), async (_req, res, next) => {
  return res
    .status(200)
    .set("Content-Type", "text/html")
    .send(
      readFileSync(join(STATIC_PATH, "index.html"))
        .toString()
        .replace("%VITE_SHOPIFY_API_KEY%", process.env.SHOPIFY_API_KEY || "")
    );
});

app.listen(PORT);
