import prisma from "../config/prisma.js";
import createError from "../utils/createError.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const payment = async (req, res, next) => {
  try {

    // check user
    const cart = await prisma.cart.findFirst({
      where: {
        orderedById: req.user.id
      }
    })

    const amountTHB = cart.cartTotal * 100

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountTHB,
      currency: "thb",
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    next(error);
  }
};
