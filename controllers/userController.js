import prisma from "../config/prisma.js";
import createError from "../utils/createError.js";

export const listUsers = async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        role: true,
        enable: true,
        address: true,
      },
    });
    res.send(users);
  } catch (error) {
    next(error);
  }
};

export const changeStatus = async (req, res, next) => {
  try {
    const { id, enable } = req.body;
    const user = await prisma.user.update({
      where: {
        id: Number(id),
      },
      data: {
        enable: enable,
      },
    });
    res.send("Updated status successfully!");
  } catch (error) {
    next(error);
  }
};

export const changeRole = async (req, res, next) => {
  try {
    const { id, role } = req.body;
    const user = await prisma.user.update({
      where: {
        id: Number(id),
      },
      data: {
        role: role,
      },
    });
    res.send("Updated role successfully!");
  } catch (error) {
    next(error);
  }
};

export const addUserCart = async (req, res, next) => {
  try {
    const { cart } = req.body;

    // find user
    const user = await prisma.user.findFirst({
      where: {
        id: Number(req.user.id),
      },
    });

    // Check quantity
    const soldoutProduct = []

    for (const item of cart) {
      const product = await prisma.product.findUnique({
        where: {
          id: item.id,
        },
        select: {
          quantity: true,
          title: true,
        },
      });

      if (!product || item.count > product.quantity) {
        soldoutProduct.push(product?.title || `'Product ID: ' ${product?.id}` || 'product')
      }
    }

    if(soldoutProduct.length !== 0) {
      if(soldoutProduct.every(product =>  product === 'product')) {
      createError(400, 'Sorry product sold out!');
      }
      createError(400, `Sorry ${soldoutProduct.join(', ')} sold out!`);
    }

    // Delete old cart item
    await prisma.productOnCart.deleteMany({
      where: {
        cart: {
          orderedById: user.id,
        },
      },
    });

    // Delete old Cart
    await prisma.cart.deleteMany({
      where: {
        orderedById: user.id,
      },
    });

    let products = cart.map((item) => ({
      productId: item.id,
      count: item.count,
      price: item.price,
    }));

    // sum total price
    let cartTotal = products.reduce(
      (sum, item) => sum + item.price * item.count,
      0
    );

    const newCart = await prisma.cart.create({
      data: {
        products: {
          create: products,
        },
        cartTotal: cartTotal,
        orderedById: user.id,
      },
    });

    res.send("Add cart successfully!");
  } catch (error) {
    next(error);
  }
};

export const getUserCart = async (req, res, next) => {
  try {
    const cart = await prisma.cart.findFirst({
      where: {
        orderedById: Number(req.user.id),
      },
      include: {
        products: {
          include: {
            product: true,
          },
        },
      },
    });

    res.json({
      products: cart?.products,
      cartTotal: cart?.cartTotal,
    });
  } catch (error) {
    next(error);
  }
};

export const emptyCart = async (req, res, next) => {
  try {
    const cart = await prisma.cart.findFirst({
      where: {
        orderedById: Number(req.user.id),
      },
    });

    if (!cart) {
      createError(400, "Cart Not Found!");
    }

    await prisma.productOnCart.deleteMany({
      where: {
        cartId: cart.id,
      },
    });

    const result = await prisma.cart.deleteMany({
      where: {
        orderedById: Number(req.user.id),
      },
    });

    res.json({
      message: "Cart Delete Successfully!",
      DeletedCount: result.count,
    });
  } catch (error) {
    next(error);
  }
};

export const saveAddress = async (req, res, next) => {
  try {
    const { address } = req.body;
    const addressUser = await prisma.user.update({
      where: {
        id: Number(req.user.id),
      },
      data: {
        address: address,
      },
    });
    res.send("Address Updated Successfully!");
  } catch (error) {
    next(error);
  }
};

export const saveOrder = async (req, res, next) => {
  try {

    const { id, amount, status, currency } = req.body.paymentIntent;

    //  Get User Cart
    const userCart = await prisma.cart.findFirst({
      where: {
        orderedById: Number(req.user.id),
      },
      include: {
        products: true,
      },
    });

    // Check empty
    if (!userCart || userCart.products.length === 0) {
      createError(400, "Cart is empty");
    }

    // Save order in DB

    const amountTHB = Number(amount) / 100

    const order = await prisma.order.create({
      data: {
        products: {
          create: userCart.products.map((item) => ({
            productId: item.productId,
            count: item.count,
            price: item.price
          }))
        },
        orderedBy: {
          connect: {
            id: Number(req.user.id)
          }
        },
        cartTotal: userCart.cartTotal,
        stripePaymentId: id,
        amount: amountTHB,
        status: status,
        currency: currency,
      },
    })

    // Update Product
    const update = userCart.products.map((item) => ({
      where: {
        id: item.productId
      },
      data: {
        quantity: { 
          decrement: item.count
        },
        sold: {
          increment: item.count
        }
      }
    }))

    await Promise.all(
      update.map((updated) => prisma.product.update(updated))
    )

    // Delete cart
    await prisma.cart.deleteMany({
      where: {
        orderedById: Number(req.user.id)
      }
    })

    res.send(order);
  } catch (error) {
    next(error);
  }
};

export const getOrder = async (req, res, next) => {
  try {
    const order = await prisma.order.findMany({
      where: {
        orderedById: Number(req.user.id)
      },
      include: {
        products: {
          include: {
            product: true
          }
        }
      }
    })

    if(order.length === 0) {
      createError(400, 'No order')
    }

    res.send(order);
  } catch (error) {
    next(error);
  }
};
