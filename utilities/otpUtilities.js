const { totp } = require('otplib');
const prisma = require('../connectDb');
const env = require('dotenv');
env.config({
  path: 'config.env',
});

//to create random otp using otplib
function generateOtp() {
  totp.options = {
    step: 120,
  };
  const secret = process.env.OTP_SECRET;
  const otpToken = totp.generate(secret);
  return otpToken;
}
//verify otp
verifyOtp = async function (req, res) {
  const { otp } = req.body;
  const userId = req.user.id; // Assuming the user is authenticated already

  // Fetch the most recent OTP record for the user
  const otpRecord = await prisma.otp
    .findUnique({ userId })
    .sort({ createdAt: -1 });
  console.log(otpRecord);
  if (!otpRecord) {
    return res.status(400).json({
      status: 'Failed',
      message: 'OTP not found',
    });
  }

  // Check if OTP has expired
  if (Date.now() > otpRecord.expiredAt) {
    return res.status(400).json({
      status: 'Failed',
      message: 'OTP has expired',
    });
  }

  // Verify OTP
  const isOtpValid = totp.verify({
    token: otp,
    secret: process.env.OTP_SECRET,
  });
  if (!isOtpValid) {
    return res.status(400).json({
      status: 'Failed',
      message: 'Invalid OTP',
    });
  }

  // Optionally, delete OTP after successful verification
  await Otp.deleteOne({ id: otpRecord.id });

  res.status(200).json({
    status: 'success',
    message: 'OTP verified successfully',
  });
};
module.exports = { generateOtp, verifyOtp };
