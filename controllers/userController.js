// User Controller
const prisma = require('./../connectDb');
const asyncHandler = require('../utilities/asyncHandler');
exports.getUsers = asyncHandler(async (_req, res) => {
  const users = await prisma.user.findMany();
  if (users.length === 0) {
    return res
      .status(400)
      .json({ status: 'Failed', message: 'There are no Users' });
  }

  return res.status(200).json({
    status: 'Success',
    users,
  });
});
exports.getUser = asyncHandler(async (req, res) => {
  let { id } = req.params;
  if (!id) {
    return res.status(400).json({
      status: 'Success',
      message: 'Please Provide Id',
    });
  }
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });
  if (!user) {
    return res.status(400).json({
      status: 'Failed',
      message: 'User not found',
    });
  }
  return res.status(200).json({ status: 'Success', user });
});
