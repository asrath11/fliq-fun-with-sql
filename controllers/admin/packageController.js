const prisma = require('../../connectDb');
const asyncHandler = require('../../utilities/asyncHandler');
exports.createPackage = asyncHandler(async (req, res) => {
  let {
    name,
    priceDescription,
    capacityDescription,
    cityId,
    area,
    price,
    extraPersonCost,
    imageCover,
    images,
    videoLink,
  } = req.body;
  price = Number(price);
  extraPersonCost = Number(extraPersonCost);
  const image = req.files.imageCover[0];
  const multipleImages = req.files.images;
  if (req.files) {
    if (image) {
      imageCover = image.filename;
      console.log(imageCover);
    }
    if (multipleImages) {
      images = multipleImages.map((el) => el.filename);
    }
  }
  const package = await prisma.package.create({
    data: {
      name,
      priceDescription,
      capacityDescription,
      cityId,
      area,
      price,
      extraPersonCost,
      imageCover,
      images,
      videoLink,
    },
  });
  if (!package) {
    return res.status(400).json({
      status: 'Failed',
      message: 'please enter valid request',
    });
  }
  return res.status(201).json({
    status: 'Success',
    message: 'Successfully created Package',
    package,
  });
});

exports.getPackages = asyncHandler(async (req, res) => {
  const packages = await prisma.package.findMany();
  if (packages.length === 0) {
    return res.status(200).json({
      status: 'Success',
      message: 'There no packages at the movement',
    });
  }
  return res.status(200).json({
    status: 'Success',
    message: 'Successfully retrieved packages',
    results: packages.length,
    packages,
  });
});

exports.getPackage = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({
      status: 'Failed',
      message: 'Please provide Id',
    });
  }
  const package = await prisma.package.findUnique({
    where: { id },
  });
  if (!package) {
    return res.status(404).json({
      status: 'Failed',
      message: 'There no package by that id',
    });
  }
  return res.status(200).json({
    status: 'Success',
    package,
  });
});

exports.deletePackage = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({
      status: 'Failed',
      message: 'Please provide Id',
    });
  }
  const package = await prisma.package.delete({
    where: { id },
  });
  if (!package) {
    return res.status(404).json({
      status: 'Failed',
      message: 'There no package by that id',
    });
  }
  return res.status(204).json({
    status: 'Success',
    package,
  });
});
exports.updatePackage = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Extract fields from the request body
  let {
    name,
    priceDescription,
    capacityDescription,
    cityId,
    area,
    price,
    extraPersonCost,
    videoLink,
  } = req.body;

  // Convert price fields to numbers
  price = price ? Number(price) : undefined;
  extraPersonCost = extraPersonCost ? Number(extraPersonCost) : undefined;

  // Initialize update object with non-file fields
  const updateData = {
    name,
    priceDescription,
    capacityDescription,
    cityId,
    area,
    price,
    extraPersonCost,
    videoLink,
  };

  // Handle file uploads if they exist
  if (req.files) {
    if (req.files.imageCover && req.files.imageCover[0]) {
      updateData.imageCover = req.files.imageCover[0].filename;
    }
    if (req.files.images && req.files.images.length > 0) {
      updateData.images = req.files.images.map((el) => el.filename);
    }
  }

  // Update the package in the database
  const updatedPackage = await prisma.package.update({
    where: { id },
    data: { ...updateData },
  });

  // Handle case where the package is not found
  if (!updatedPackage) {
    return res.status(404).json({
      status: 'Failed',
      message: 'No package found with that ID',
    });
  }

  // Return success response
  return res.status(200).json({
    status: 'Success',
    message: 'Package updated successfully',
    package: updatedPackage,
  });
});

exports.getPackagesByArea = asyncHandler(async (req, res) => {
  const { area } = req.params;

  if (!area) {
    return res.status(400).json({
      status: 'Failed',
      message: 'Please provide area',
    });
  }

  const packages = await prisma.package.findMany({
    where: {
      area: {
        contains: area,
        mode: 'insensitive', // Makes the search case-insensitive
      },
    },
    select: {
      id: true,
      name: true,
      priceDescription: true,
      capacityDescription: true,
      area: true,
      price: true,
      extraPersonCost: true,
      imageCover: true,
      images: true,
      videoLink: true,
      maxCapacity: true,
      minCapacity: true,
    },
  });
  if (!packages.length) {
    return res.status(200).json({
      status: 'Success',
      message: 'There are no packages at the moment',
      results: 0,
      packages: [],
    });
  }

  return res.status(200).json({
    status: 'Success',
    message: 'Successfully retrieved packages',
    results: packages.length,
    packages,
  });
});
