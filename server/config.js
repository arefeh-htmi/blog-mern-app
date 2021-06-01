module.exports = {

  // MongoDB Connection URI
  MONGODB_URI: process.env.MONGODB_URI,
  // Database Name
  DATABASE_NAME: process.env.DATABASE_NAME,

  // Client URL
  CLIENT_ROOT_URL: process.env.CLIENT_ROOT_URL,


  TRANSPORT: {

    // Hostname or IP address of your server that will send the email
    host: process.env.EMAIL_HOST,
    // Port to connect to (defaults to 587 if secure is false or 465 if true)
    port: 587,
    // Use TLS (true for 465, false for other ports)
    secure: false,

    auth: {
      // The email address for your application
      user: "admin@example.com",
      // Your app email password
      pass: "ADMINEXAMPLEPASSWORD"
    },

    tls: {
      // Set to true to fail sending on invalid certificates
      rejectUnauthorized: false
    }

  },


  // The salt to be used to hash the password
  SALT_ROUNDS: process.env.JWT_SALT,

  // The secret key for JsonWebToken.
  JWT_SECRET: process.env.JWT_SECRET

}
