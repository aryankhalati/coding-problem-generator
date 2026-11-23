import { readFileSync } from "fs";
import { findLeaks } from "./src/services/pipeline.service.js";

const files = [
  "demo-the-grand-orchard.json",
  "demo-delivery-promo-code.json",
  "demo-the-pirate-s-cargo-queue.json",
];

for (const f of files) {
  const data = JSON.parse(readFileSync(`../frontend/src/demo/${f}`, "utf8"));
  console.log(f, "->", findLeaks(data.problem));
}