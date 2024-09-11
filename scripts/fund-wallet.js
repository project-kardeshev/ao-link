#!/usr/bin/env node

import Irys from "@irys/sdk"
import { config } from "dotenv"

config({ path: [".env", ".env.local"] })
const DEPLOY_KEY = process.env.DEPLOY_KEY

async function fund() {
  if (!DEPLOY_KEY) throw new Error("DEPLOY_KEY not configured")

  // https://docs.ardrive.io/docs/turbo/migrating.html#purchasing-turbo-credits-with-the-irys-sdk
  const jwk = JSON.parse(Buffer.from(DEPLOY_KEY, "base64").toString("utf-8"))
  const irys = new Irys({
    network: "mainnet",
    url: "https://turbo.ardrive.io", // URL of the node you want to connect to, https://turbo.ardrive.io will facilitate upload using ArDrive Turbo.
    token: "arweave",
    key: jwk,
  })

  const balance = await irys.getBalance("yqRGaljOLb2IvKkYVa87Wdcc8m_4w6FI58Gej05gorA")
  console.log("📜 LOG > node balance:", irys.utils.fromAtomic(balance), irys.token)

  // const withdrawTx = await irys.withdrawBalance(irys.utils.toAtomic(0.604))
  // console.log(
  //   `📜 LOG > Successfully withdrew ${irys.utils.fromAtomic(withdrawTx.requested)} ${irys.token}`,
  //   withdrawTx,
  // )

  // const fundTx = await irys.fund(irys.utils.toAtomic(0.1))
  // console.log(
  //   `📜 LOG > Successfully funded ${irys.utils.fromAtomic(fundTx.quantity)} ${irys.token}`,
  //   fundTx,
  // )
}

fund().then()
