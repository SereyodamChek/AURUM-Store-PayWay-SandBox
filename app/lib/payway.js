// app/lib/payway.js
import crypto from "crypto";

export function signRequest(payload, apiKey) {
  const secretKey = String(apiKey || "").trim();

  if (!secretKey) {
    throw new Error("Missing PayWay API Key");
  }

  const beforeHash =
    String(payload.req_time ?? "") +
    String(payload.merchant_id ?? "") +
    String(payload.tran_id ?? "") +
    String(payload.amount ?? "") +
    String(payload.firstname ?? "") +
    String(payload.lastname ?? "") +
    String(payload.email ?? "") +
    String(payload.phone ?? "") +
    String(payload.return_params ?? "");

  console.log("[HASH DEBUG] Before hash:", beforeHash);

  const hash = crypto
    .createHmac("sha512", secretKey)
    .update(beforeHash, "utf8")
    .digest("base64");

  console.log("[HASH DEBUG] Hash:", hash);

  return hash;
}

export function formatAmount(amount) {
  const num = parseFloat(amount);
  if (Number.isNaN(num)) throw new Error("Invalid amount");
  return num.toFixed(2);
}