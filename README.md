🛠️ Home Service App – Backend

This is the backend server for the Home Service Booking platform, developed using Node.js, Express.js, and MongoDB. It provides RESTful APIs for user registration, authentication, service booking, employee management, and more.

⚙️ Features

User and employee registration/login with JWT authentication

Role-based access control (user/admin/employee)

Service management (add/edit/delete)

Booking system with time slot management

OTP verification via Twilio (or similar)

Secure password handling using bcrypt

Email notifications using Nodemailer

Image upload support (via Multer)

🧰 Tech Stack

Backend: Node.js, Express.js

Database: MongoDB with Mongoose

Authentication: JWT (JSON Web Tokens)

Other Libraries:

bcrypt for password hashing

multer for image/file uploads

nodemailer for sending emails

twilio (or equivalent) for OTP handling

🔧 Setup Instructions

Clone the repository
git clone https://github.com/yourusername/homeservice-backend.git
cd homeservice-backend

Install dependencies
npm install

Create a .env file with the following:
env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password_or_app_password

Start the server
npm start
