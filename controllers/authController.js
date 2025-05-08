const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const prisma = require('./../connectDb');
const { createToken } = require('../utilities/createJwtToken');
const { generateOtp } = require('../utilities/otpUtilities');
const sendEmail = require('../utilities/sendEmail');
const asyncHandler = require('../utilities/asyncHandler');
// const { isValidEmail } = require('../utilities/validators');

// Password hashing configuration
const SALT_ROUNDS = 12;

exports.signUp = asyncHandler(async (req, res) => {
  const { email, password, userType = 1 } = req.body;

  // Validation
  if (!email || !password) {
    throw new Error('Please provide email and password');
  }

  // if (!isValidEmail(email)) {
  //   throw new Error('Please provide a valid email address');
  // }

  if (password.length < 8) {
    throw new Error('Password must be at least 8 characters long');
  }

  // Check for existing user
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error('Email already in use');
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  // Create user
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      userType,
    },
    select: {
      id: true,
      email: true,
      userType: true,
    },
  });
  // Generate tokens
  const { accessToken, refreshToken, updatedUser } = await createToken(user, res);

  res.status(201).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

exports.signIn = asyncHandler(async (req, res) => {
  const { email } = req.body;

  // Find user with password selected
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error('Invalid credentials');
  }

  // Generate tokens
  const { accessToken, refreshToken } = await createToken(user, res);

  // // OTP generation and email sending
  const otpToken = generateOtp();
  const otpExpiry = new Date(Date.now() + 300000); // 5 minutes expiry

  await prisma.otp.create({
    data: {
      userId: user.id,
      otp: otpToken,
      expiredAt: otpExpiry,
    },
  });
  await sendEmail.sendOtpToEmail(email, otpToken);

  // Return response without sensitive data
  const userResponse = {
    id: user.id,
    email: user.email,
    userType: user.userType,
  };

  res.json({
    status: 'success',
    message: 'SuccessFully sent otp to your mail',
    accessToken,
  });
});

exports.refreshToken = asyncHandler(async (req, res) => {
  const refreshToken =
    req.cookies['X-RefreshToken'] || req.headers['x-refresh-token'];

  if (!refreshToken) {
    throw new Error('Refresh token is required');
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, email: true, refreshToken: true },
    });

    if (!user) {
      throw new Error('User not found');
    }

    if (refreshToken !== user.refreshToken) {
      throw new Error('Invalid refresh token');
    }

    const { accessToken, refreshToken: newRefreshToken } = await createToken(
      user,
      res
    );

    res.json({
      status: 'success',
      data: {
        accessToken,
        refreshToken: newRefreshToken,
      },
    });
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new Error('Refresh token expired');
    }
    throw new Error('Invalid refresh token');
  }
});

exports.logout = asyncHandler(async (req, res) => {
  const refreshToken =
    req.cookies['X-RefreshToken'] || req.headers['X-RefreshToken'];

  if (refreshToken) {
    // Find user by refresh token
    const user = await prisma.user.findFirst({
      where: { refreshToken },
    });

    if (user) {
      await prisma.user.update({
        where: { id: user.id },
        data: { refreshToken: null },
      });
    }
  }

  // Clear cookies
  res.clearCookie('X-AccessToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });

  res.clearCookie('X-RefreshToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });

  res.status(204).end();
});
