const prisma = require('../../connectDb');
const asyncHandler = require('../../utilities/asyncHandler');

exports.createAddOns = asyncHandler(async (req, res) => {
  let { name, category, displayType, price, image } = req.body;
  price = parseInt(price);
  if (req.file) {
    image = req.file.filename;
  }
  const addOn = await prisma.addOn.create({
    data: {
      name,
      category,
      displayType,
      price,
      image,
    },
  });

  if (!addOn) {
    return res.status(400).json({
      status: 'Failed',
      message: 'Please provide valid request',
    });
  }
  return res.status(200).json({
    status: 'Success',
    message: 'Created Addons Successfully',
    addOn,
  });
});

exports.getAddOns = asyncHandler(async (req, res) => {
  const addOns = await prisma.addOn.findMany();
  if (addOns.length == 0) {
    res.status(200).json({
      status: 'Success',
      message: 'there is no addOns at the movement',
    });
  }
  res.status(200).json({
    status: 'Success',
    results: addOns.length,
    addOns,
  });
});

exports.getAddOnById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const addOn = await prisma.addOn.findUnique({
    where: {
      id,
    },
  });
  if (!id) {
    return res.status(400).json({
      status: 'Failed',
      message: 'Please valid id',
    });
  }
  if (!addOn) {
    return res.status(404).json({
      status: 'Failed',
      message: 'AddOn not found',
    });
  }

  res.status(200).json({
    status: 'Success',
    addOn,
  });
});

exports.deleteAddOn = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const addOn = await prisma.addOn.delete({
    where: {
      id,
    },
  });

  if (!addOn) {
    return res.status(404).json({
      status: 'Failed',
      message: 'AddOn not found',
    });
  }

  res.status(200).json({
    status: 'Success',
    message: 'AddOn deleted successfully',
    addOn,
  });
});

exports.updateAddOn = asyncHandler(async (req, res) => {
  const { id } = req.params;
  let { name, category, displayType, price, image } = req.body;

  if (price) {
    price = parseInt(price);
  }

  if (req.file) {
    image = req.file.filename;
  }

  if (!id) {
    return res.status(400).json({
      status: 'Failed',
      message: 'Please valid id',
    });
  }
  const addOn = await prisma.addOn.update({
    where: {
      id,
    },
    data: {
      name,
      category,
      displayType,
      price,
      image,
    },
  });

  if (!addOn) {
    return res.status(404).json({
      status: 'Failed',
      message: 'AddOn not found',
    });
  }

  res.status(200).json({
    status: 'Success',
    message: 'AddOn updated successfully',
    addOn,
  });
});
