🛍️ E-Shop – MERN E-Commerce Platform

A full-stack E-Commerce web application built using the MERN (MongoDB, Express, React, Node) stack.
It supports both buyers and sellers, with real-time updates, authentication, product management, and PDF invoice generation.

**Tech Stack**

Frontend
⚛️ React.js (with Vite)
🔄 Axios (API communication)
🎨 Tailwind CSS + Lucide Icons
⚡ React Hot Toast (notifications)
💬 Framer Motion (animations)
    React Router DOM (navigation)

Backend
🧠 Node.js + Express.js
🗄️ MongoDB + Mongoose
🔐 JWT Authentication
📧 Nodemailer (email notifications)
📜 PDFKit (generate invoices)
🔔 Socket.IO (real-time order updates)

**Key Features**

_Buyer Features_

   Register and login securely
   Browse all products
   Add items to cart and checkout
   Receive order confirmation via email
   View and manage past orders
   Download PDF invoices

   **HOME** <img width="1896" height="973" alt="image" src="https://github.com/user-attachments/assets/3bb5af25-8578-4005-b5cf-e4170c40b870" />
   **MY ORDER** <img width="1763" height="852" alt="image" src="https://github.com/user-attachments/assets/e12b679a-80d2-40c1-bf24-8f9b580ff84b" />

_Seller Features_

  Secure seller authentication
  Real-time dashboard (via Socket.IO)
  View and manage incoming orders
  Update order status
  Track sales statistics and revenue
  Download customer invoices

  **Seller Panel** <img width="1851" height="943" alt="image" src="https://github.com/user-attachments/assets/416c828e-f983-4862-a47d-6eb6b97aa214" />
  **Order Page** <img width="1467" height="847" alt="image" src="https://github.com/user-attachments/assets/66852098-10fb-4172-9a31-62a1852da01e" />



⚙️ Admin/General

   Seed products and default seller
   Manage API routes efficiently
   Environment-based configuration

**Setup $ Installation**
   Clone the repository:
      git clone https:/github.com/simran18074/ecommerce.git
      cd ecommerce
      
  Setup backend:  
      cd server
      npm install
      
  Add environment variables: Create a .env file inside server/:   
      MONGO_URI=your_mongo_connection_string
      EMAIL_USER=your_email@gmail.com
      EMAIL_PASS=your_app_password
      JWT_SECRET=your_secret_key
      JWT_EXPIRES_IN=7d
      PORT=5000


**Email Notifications**   
  Buyer receives confirmation emails upon order checkout
  Uses Nodemailer + Gmail SMTP
  Make sure EMAIL_USER and EMAIL_PASS are correctly set in .env

**Seller Dashboard**
   Real-time updates using Socket.IO
   Displays:
        Total Orders
        Pending / Delivered / Cancelled counts
        Monthly Revenue Graph
    
**Generate PDF Invoice**
    Sellers and Buyers can download invoices in PDF
    Built using PDFKit

🧑‍💻 Author
Simran
📧 simran181204@gmail.com
💼 MERN Stack Developer | Passionate about full-stack apps 🚀
  
