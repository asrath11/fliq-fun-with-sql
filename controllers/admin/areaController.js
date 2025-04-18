const prisma = require('../../connectDb');
const asyncHandler = require('../../utilities/asyncHandler');

// Create Area
exports.createArea = asyncHandler(async (req, res) => {
  const { name, cityId } = req.body;

  const area = await prisma.area.create({
    data: {
      name,
      cityId,
    },
  });

  res.status(201).json({ status: 'success', data: { area } });
});

// Get All Areas
exports.getAllAreas = asyncHandler(async (req, res) => {
  const areas = await prisma.area.findMany({
    include: {
      City: {
        select: { name: true },
      },
    },
  });

  res.status(200).json({ status: 'success', data: { areas } });
});

// Get Single Area
exports.getAreaById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const area = await prisma.area.findUnique({
    where: { id: parseInt(id) },
    include: {
      City: { select: { name: true } },
    },
  });

  if (!area) {
    return res.status(404).json({ status: 'fail', message: 'Area not found' });
  }

  res.status(200).json({ status: 'success', data: { area } });
});

// Update Area
exports.updateArea = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, cityId } = req.body;

  const area = await prisma.area.update({
    where: { id: parseInt(id) },
    data: {
      name,
      cityId,
    },
  });

  res.status(200).json({ status: 'success', data: { area } });
});

// Delete Area
exports.deleteArea = asyncHandler(async (req, res) => {
  const { id } = req.params;

  await prisma.area.delete({
    where: { id: parseInt(id) },
  });

  res.status(204).json({ status: 'success', message: 'Area deleted' });
});
