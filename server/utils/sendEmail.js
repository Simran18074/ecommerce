import dotenv from "dotenv";
dotenv.config();
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

console.log("📧 Email config:", {
  user: process.env.EMAIL_USER ? "Loaded ✅" : "Missing ❌",
  pass: process.env.EMAIL_PASS ? "Loaded ✅" : "Missing ❌",
});

export const sendOrderConfirmation = async (
  to,
  { userName, items, totalAmount, status }
) => {
  try {
    const itemList = items
      .map(
        (item, i) =>
          `<tr>
            <td style="padding:8px;border-bottom:1px solid #eee;">${i + 1}</td>
            <td style="padding:8px;border-bottom:1px solid #eee;">${
              item.name
            }</td>
            <td style="padding:8px;border-bottom:1px solid #eee;">₹${
              item.price
            }</td>
            <td style="padding:8px;border-bottom:1px solid #eee;">${
              item.quantity
            }</td>
          </tr>`
      )
      .join("");

    const mailOptions = {
      from: `"E-Shop" <${process.env.EMAIL_USER}>`,
      to,
      subject: `🧾 Your Order Confirmation - Status: ${status}`,
      html: `
        <div style="font-family:Arial, sans-serif; background:#f9fafb; padding:20px;">
          <div style="max-width:600px; margin:auto; background:white; padding:20px; border-radius:10px;">
            <h2 style="color:#4f46e5;">Thank you for your order, ${userName}! 🎉</h2>
            <p style="font-size:16px; color:#333;">
              We're excited to let you know your order has been placed successfully.
            </p>

            <h3 style="margin-top:20px;">🛒 Order Details:</h3>
            <table style="width:100%; border-collapse:collapse;">
              <thead>
                <tr style="background:#f3f4f6;">
                  <th style="padding:8px;">#</th>
                  <th style="padding:8px;">Product</th>
                  <th style="padding:8px;">Price</th>
                  <th style="padding:8px;">Qty</th>
                </tr>
              </thead>
              <tbody>${itemList}</tbody>
            </table>

            <h3 style="margin-top:20px;">💰 Total Amount: ₹${totalAmount.toFixed(
              2
            )}</h3>
            <p style="margin-top:10px;">Current Status: <b>${status}</b></p>

            <hr style="margin:20px 0;" />
            <p style="font-size:14px; color:#555;">
              You can track your order status anytime from your E-Shop dashboard.
            </p>
            <p style="font-size:12px; color:#888;">© ${new Date().getFullYear()} E-Shop Pvt. Ltd.</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Order confirmation email sent to ${to}`);
  } catch (err) {
    console.error("❌ Email send failed:", err.message);
    throw err;
  }
};
