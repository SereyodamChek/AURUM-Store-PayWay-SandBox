// app/utils/timestamps.js
export function generateTimestamps() {
  const now = new Date();
  return {
    createdAt: now,
    updatedAt: now,
    paid_at: now,
  };
}