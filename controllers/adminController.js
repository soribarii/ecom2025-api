import prisma from "../config/prisma.js";
import createError from "../utils/createError.js";

export const changeOrderStatus = async (req, res, next) => {
  try {
    const { orderId, orderStatus } = req.body;
    const order = await prisma.order.findFirst({
      where: {
        id: Number(orderId)
      }
    })

    if(!order) {
      createError(400, 'Order not found!')
    }

    const orderUpdate = await prisma.order.update({
      where: {
        id: Number(orderId)
      },
      data: {
        orderStatus: orderStatus
      }
    })


    res.send(orderUpdate)
  } catch (error) {
    next(error)
  }
}

export const getOrderAdmin = async (req, res, next) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        products: {
          include: {
            product: true
          }
        },
        orderedBy: {
          select: {
            id: true,
            email: true,
            address: true
          }
        }
      }
    });
    res.send(orders)
  } catch (error) {
    next(error)
  }
}