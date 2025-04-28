const prisma = require('../../connectDb');
const asyncHandler = require('../../utilities/asyncHandler');

const createSlotBooking = asyncHandler(async (req, res) => {
  const { date, timeSlot, numberOfPeople, packageId } = req.body;
  console.log(date, timeSlot, numberOfPeople, packageId);
  const slots = await prisma.slotBooking.create({
    data: {
      date,
      timeSlot,
      numberOfPeople,
      packageId,
    },
  });
  return res.status(201).json({
    status: 'Success',
    message: 'Successfully created slot',
    slots,
  });
});

const getAllSlotBookings = asyncHandler(async (req, res) => {
  const slots = await prisma.slotBooking.findMany();
  if (slots.length === 0) {
    return res.status(200).json({
      status: 'Success',
      message: 'There is no slot bookings at the movement',
    });
  }
  return res.status(200).json({
    status: 'Success',
    message: 'Successfully fetched all slot bookings',
    slots,
  });
});

const getSlotBookings = asyncHandler(async (req, res) => {
  const { id } = req.params;
  console.log(id);
  const slot = await prisma.slotBooking.findUnique({
    where: {
      id,
    },
  });
  if (!id) {
    return res.status(500).json({
      message: 'Please provide id',
    });
  }
  console.log(slot);
});

const updateSlotBooking = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { date, timeSlot, numberOfPeople, packageId } = req.body;

  if (!id) {
    return res.status(400).json({
      status: 'Error',
      message: 'Please provide a slot booking ID',
    });
  }

  const updatedSlot = await prisma.slotBooking.update({
    where: { id },
    data: {
      date,
      timeSlot,
      numberOfPeople,
      packageId,
    },
  });

  return res.status(200).json({
    status: 'Success',
    message: 'Successfully updated slot booking',
    slot: updatedSlot,
  });
});

const deleteSlotBooking = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      status: 'Error',
      message: 'Please provide a slot booking ID',
    });
  }

  await prisma.slotBooking.delete({
    where: { id },
  });

  return res.status(200).json({
    status: 'Success',
    message: 'Successfully deleted slot booking',
  });
});

const getSlotBookingsByDate = asyncHandler(async (req, res) => {
  const { date } = req.params;

  if (!date) {
    return res.status(400).json({
      status: 'Error',
      message: 'Please provide a date',
    });
  }

  const slots = await prisma.slotBooking.findMany({
    where: {
      date: new Date(date),
    },
  });

  if (slots.length === 0) {
    return res.status(200).json({
      status: 'Success',
      message: 'No slot bookings found for this date',
    });
  }

  return res.status(200).json({
    status: 'Success',
    message: 'Successfully fetched slot bookings for the date',
    slots,
  });
});

module.exports = {
  createSlotBooking,
  getAllSlotBookings,
  getSlotBookings,
  updateSlotBooking,
  deleteSlotBooking,
  getSlotBookingsByDate,
};
