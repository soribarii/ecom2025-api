import prisma from "../config/prisma.js";
import createError from "../utils/createError.js";
import cloudinary from "../utils/cloudinary.js";

export const create = async (req, res, next) => {
  try {
    const { title, description, price, quantity, categoryId, images } =
      req.body;
    const product = await prisma.product.create({
      data: {
        title: title,
        description: description,
        price: parseFloat(price),
        quantity: parseInt(quantity),
        categoryId: parseInt(categoryId),
        images: {
          create: images.map((item) => ({
            asset_id: item.asset_id,
            public_id: item.public_id,
            url: item.url,
            secure_url: item.secure_url,
          })),
        },
      },
    });
    res.send(product);
  } catch (error) {
    next(error);
  }
};

export const list = async (req, res, next) => {
  try {
    const { count } = req.params;
    const products = await prisma.product.findMany({
      take: parseInt(count),
      orderBy: {
        createdAt: "desc",
      },
      include: {
        category: true,
        images: true,
      },
    });
    res.send(products);
  } catch (error) {
    next(error);
  }
};

export const read = async (req, res, next) => {
  try {
    const { id } = req.params;
    const products = await prisma.product.findFirst({
      where: {
        id: Number(id),
      },
      include: {
        category: true,
        images: true,
      },
    });

    res.send(products);
  } catch (error) {
    next(error);
  }
};

export const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, price, quantity, categoryId, images } =
      req.body;

    // clear images
    await prisma.image.deleteMany({
      where: {
        productId: Number(id),
      },
    });

    const product = await prisma.product.update({
      where: {
        id: Number(id),
      },
      data: {
        title: title,
        description: description,
        price: parseFloat(price),
        quantity: parseInt(quantity),
        categoryId: parseInt(categoryId),
        images: {
          create: images.map((item) => ({
            asset_id: item.asset_id,
            public_id: item.public_id,
            url: item.url,
            secure_url: item.secure_url,
          })),
        },
      },
    });
    res.send(product);
  } catch (error) {
    next(error);
  }
};

export const remove = async (req, res, next) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.delete({
      where: {
        id: Number(id),
      },
      include: {
        images: true,
      },
    });
    res.send(product);
  } catch (error) {
    next(error);
  }
};

export const listBy = async (req, res, next) => {
  try {
    const { sort, order, limit } = req.body;
    console.log(sort, order, limit);
    const products = await prisma.product.findMany({
      take: limit,
      orderBy: { [sort]: order },
      include: {
        category: true,
        images: true,
      },
    });
    res.send(products);
  } catch (error) {
    next(error);
  }
};

const handleQuery = async (req, res, query) => {
  try {
    const products = await prisma.product.findMany({
      where: {
        title: {
          contains: query,
          mode: "insensitive",
        },
      },
      include: {
        category: true,
        images: true,
      },
    });
    res.send(products);
  } catch (error) {
    createError(500, "HandleQuery Error");
  }
};

const handlePrice = async (req, res, priceRange) => {
  try {
    const products = await prisma.product.findMany({
      where: {
        price: {
          gte: priceRange[0],
          lte: priceRange[1],
        },
      },
      include: {
        category: true,
        images: true,
      },
    });
    res.send(products);
  } catch (error) {
    createError(500, "HandlePrice Error");
  }
};

const handleCategory = async (req, res, categoryId) => {
  try {
    const products = await prisma.product.findMany({
      where: {
        categoryId: {
          in: categoryId.map((id) => Number(id)),
        },
      },
      include: {
        category: true,
        images: true,
      },
    });
    res.send(products);
  } catch (error) {
    createError(500, "HandleCategory Error");
  }
};

export const searchFilters = async (req, res, next) => {
  try {
    const { query, category, price } = req.body;

    if (query) {
      console.log("query => ", query);
      await handleQuery(req, res, query);
    }
    if (category) {
      console.log("category => ", category);
      await handleCategory(req, res, category);
    }
    if (price) {
      console.log("price => ", price);
      await handlePrice(req, res, price);
    }

    // res.send('Hello searchFilters product')
  } catch (error) {
    next(error);
  }
};

export const createImages = async (req, res, next) => {
  try {
    const result = await cloudinary.uploader.upload(req.body.image, {
      public_id: `product-${Date.now()}`,
      resource_type: "auto",
      folder: "Ecom2025",
    });
    res.send(result);
  } catch (error) {
    next(error);
  }
};

export const removeImage = async (req, res, next) => {
  try {
    const { public_id } = req.body;
    cloudinary.uploader.destroy(public_id, (result) => {
      res.send("Remove Image Success!");
    });
  } catch (error) {
    next(error);
  }
};
