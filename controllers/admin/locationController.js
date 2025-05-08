const prisma = require('../../connectDb');
const asyncHandler = require('../../utilities/asyncHandler');

exports.getLocations = asyncHandler(async (req, res) => {
  // 1. Fetch raw data from Prisma
  const states = await prisma.state.findMany({
    select: {
      name: true, // state name
      City: {
        select: {
          name: true, // city name
          Area: {
            select: {
              name: true, // area name
            },
            orderBy: { name: 'asc' }, // optional sorting
          },
        },
        orderBy: { name: 'asc' }, // optional sorting
      },
    },
    orderBy: { name: 'asc' },
  });

  // 2. Efficient single-pass transformation
  const result = states.map(({ name: state, City }) => ({
    state,
    cities: City.map(({ name: city, Area }) => ({
      city,
      areas: Area.map(({ name: area }) => area),
    })),
  }));

  res.status(200).json({
    status: 'success',
    locations: result,
    message: 'Locations fetched successfully',
  });
});
