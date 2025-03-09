## 🟢 Job Searching App

## ✔ Overview
The **Job Searching App** is a full-featured backend application built with **Node.js** and **Express.js**. It provides job seekers with a seamless experience to search, apply, and manage job listings. The app includes authentication, real-time notifications, file uploads, GraphQL support, background jobs, and more.

## ⚡ Features
- **User Authentication:** JWT-based authentication with OAuth (Google login supported).
- **Job Management:** CRUD operations for job postings.
- **Real-time Notifications:** WebSockets for instant updates.
- **File Uploads:** Resume and document uploads using `multer`.
- **GraphQL API:** Query and manage job data efficiently.
- **Rate Limiting & Security:** Implemented with `helmet`, `express-rate-limit`, and `cors`.
- **Automated Tasks:** `node-cron` for scheduled job postings.
- **Email Notifications:** `nodemailer` for alerts and updates.
- **Database Support:** MongoDB with `mongoose`.
- **Excel Export:** Save job lists using `exceljs`.

## Installation
### Prerequisites
Ensure you have **Node.js** and **MongoDB** installed on your system.

### Setup
1. Clone the repository:
   ```sh
   https://github.com/maged-atef/full-Stack-Project-Chat-JobSearchApp.git
   cd full-Stack-Project-Chat-JobSearchApp
   ```
2. Install dependencies:
   ```sh
   npm install
   ```

3. Start the application backend side: ➡ naviaget to /backend then type
```sh
   cd /backend
   npm run start  
 ```

⛔ create .env file on backend folder 
```sh
   
# Database Info
MONGODB_URI = 

# Google Login authentication
CLIENT_ID = 
CLIENT_SECRET = 

# Express Info
HOST = http://127.0.0.1:3000/
EXPRESSPORT = 3000

# App Name
APPNAME= 

# Hashing
SECRETKEY = 


# Google Authentication for Send Mail 

USER = 
PASS = 
MAIL_HOST = 
MAIL_PORT = 
MAIL_SECURE = 

```
4. Start the application frontend side : ➡ naviaget to /frontend then type
```sh
   cd /frontend
   npm install
 ```

5. ## POSTMAN documentation can be accessed from here https://documenter.getpostman.com/view/36638852/2sAYdoEmni#4df10acf-9964-4dc0-9ad4-55bc8d2a2fa7



## Dependencies
```json
{
  "bcrypt": "^5.1.1",
  "body-parser": "^1.20.3",
  "cors": "^2.8.5",
  "crypto-js": "^4.2.0",
  "dotenv": "^16.4.5",
  "exceljs": "^4.4.0",
  "express": "^4.19.2",
  "express-rate-limit": "^5.5.1",
  "express-session": "^1.18.1",
  "file-saver": "^2.0.5",
  "graphql": "^16.10.0",
  "graphql-http": "^1.22.4",
  "helmet": "^8.0.0",
  "joi": "^17.13.3",
  "jsonwebtoken": "^9.0.2",
  "mongodb": "^6.8.0",
  "mongoose": "^8.5.1",
  "multer": "^1.4.5-lts.1",
  "nanoid": "^5.0.7",
  "node-cron": "^3.0.3",
  "nodemailer": "^6.9.14",
  "nodemon": "^3.1.4",
  "passport": "^0.7.0",
  "passport-google-oauth20": "^2.0.0",
  "rate-limit": "^0.1.1"
}
```

## Contributing
1. Fork the repository.
2. Create a feature branch (`git checkout -b feature-name`).
3. Commit your changes (`git commit -m "Add feature"`).
4. Push to the branch (`git push origin feature-name`).
5. Open a Pull Request.

## License
This project is licensed under the MIT License.

## Contact
For any inquiries or contributions, feel free to reach out via email at **maged.atef.arteen@gmail.com**.

