import prisma from '../config/prisma.js'

export const create = async (req, res, next) => {
  try {
    const { name } = req.body;
    const category = await prisma.category.create({
      data: {
        name: name,
      }
    })
    res.send(category)
  } catch (error) {
    next(error)
  }
};

export const list = async (req, res, next) => {
  try {
    const category = await prisma.category.findMany();
    res.send(category)
  } catch (error) {
    next(error)
  }
};

export const update = async (req, res, next) => {
  try {
    const { id, name } = req.body;

    const category = await prisma.category.update({
      where: {
        id: Number(id),
      },
      data: {
        name: name,
      },
    })

    res.send(category)

  } catch (error) {
    next(error);
  }
};

export const remove = async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await prisma.category.delete({
      where: {
        id: Number(id)
      }
    })
    res.send(category)
  } catch (error) {
    next(error)
  }
};
