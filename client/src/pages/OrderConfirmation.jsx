import { useParams } from "react-router-dom";

export default function OrderConfirmation() {
  const { orderId } = useParams();
  return (
    <div className="text-center p-6">
      <h2 className="text-2xl font-bold">Order Confirmed 🎉</h2>
      <p className="mt-2">
        Your Order ID: <b>{orderId}</b>
      </p>
      <p className="mt-2">Thank you for shopping with us!</p>
    </div>
  );
}
