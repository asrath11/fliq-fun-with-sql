const jwt = require('jsonwebtoken');
const prisma = require('./../connectDb');
const env = require('dotenv');
env.config({
  path: 'config.env',
});

// Create JWT token
async function createToken(user, res) {
  // Create Access Token
  const accessToken = jwt.sign({ id: user.id }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY, // e.g. 15m
  });
  // Create Refresh Token
  const refreshToken = jwt.sign(
    { id: user.id },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY, // e.g. 7d
    }
  );
  // Store the refresh token in the user's record in the database
  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken },
  });
  if (!updatedUser) {
    console.error('User not found or update failed');
  }
  // Options for cookies
  const options = {
    httpOnly: true, // Prevent client-side JS from accessing the token
  };

  // Set the access token in a cookie
  res.cookie('X-AccessToken', accessToken, options);

  // Set the refresh token in a cookie
  res.cookie('X-RefreshToken', refreshToken, options);

  return { accessToken, refreshToken, updatedUser };
}

module.exports = { createToken };
