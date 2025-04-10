const prisma = require('../../connectDb');
const asyncHandler = require('../../utilities/asyncHandler');

// Get all states
exports.getStates = asyncHandler(async (_req, res) => {
  const states = await prisma.state.findMany();

  if (states.length === 0) {
    return res.status(200).json({
      status: 'Success',
      message: 'At the moment, there are no states.',
    });
  }

  return res.status(200).json({
    status: 'Success',
    results: states.length,
    states,
  });
});

// Get a single state by ID
exports.getState = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      status: 'Failed',
      message: 'Please provide a valid state ID.',
    });
  }

  const state = await prisma.state.findUnique({
    where: {
      id,
    },
  });

  if (!state) {
    return res.status(404).json({
      status: 'Failed',
      message: 'State not found.',
    });
  }

  return res.status(200).json({
    status: 'Success',
    state,
  });
});
exports.getCitiesByState = asyncHandler(async (req, res) => {
  const { stateId } = req.params;
  if (!stateId) {
    return res.status(400).json({
      message: 'Please provide StateId',
    });
  }
  const city = await prisma.city.findMany({ where: { stateId: stateId } });
  console.log(city);
  if (!city) {
    return res.status(404).json({
      status: 'Failed',
      message: 'City not found',
    });
  }
  return res.status(200).json({
    status: 'Success',
    result: city.length,
    city,
  });
});

// Create a new state
exports.createState = asyncHandler(async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({
      status: 'Failed',
      message: 'Please provide the name of the state.',
    });
  }

  const state = await prisma.state.create({ data: { name } });

  return res.status(201).json({
    status: 'Success',
    state,
  });
});

// Delete a state by ID
exports.deleteState = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      status: 'Failed',
      message: 'Please provide a valid state ID.',
    });
  }

  const state = await prisma.state.findUnique({
    where: { id },
  });

  if (!state) {
    return res.status(404).json({
      status: 'Failed',
      message: 'State not found.',
    });
  }

  return res.status(200).json({
    status: 'Success',
    message: 'State deleted successfully.',
  });
});
