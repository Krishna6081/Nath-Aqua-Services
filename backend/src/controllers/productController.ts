import { Request, Response } from 'express';
import { prisma } from '../config/db';

export const getProducts = async (req: Request, res: Response) => {
  try {
    const { unit, isAvailable } = req.query;

    const where: any = {};
    if (unit) where.unit = unit as string;
    if (isAvailable !== undefined) where.isAvailable = isAvailable === 'true';

    const products = await prisma.product.findMany({
      where,
      orderBy: { createdAt: 'asc' },
    });

    return res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error fetching products',
    });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({
      where: { id },
      include: { inventory: true },
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    return res.status(200).json({
      success: true,
      product,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error fetching product details',
    });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, description, capacity, price, deliveryCharge, unit, stock, isAvailable, image } = req.body;

    const product = await prisma.product.create({
      data: {
        name,
        description,
        capacity,
        price: parseFloat(price),
        deliveryCharge: deliveryCharge ? parseFloat(deliveryCharge) : 0,
        unit,
        stock: stock ? parseInt(stock) : 100,
        isAvailable: isAvailable ?? true,
        image,
      },
    });

    // Create corresponding inventory entry
    await prisma.inventory.create({
      data: {
        productId: product.id,
        totalStock: product.stock,
        availableStock: product.stock,
      },
    });

    return res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error creating product',
    });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (updateData.price) updateData.price = parseFloat(updateData.price);
    if (updateData.deliveryCharge) updateData.deliveryCharge = parseFloat(updateData.deliveryCharge);
    if (updateData.stock) updateData.stock = parseInt(updateData.stock);

    const product = await prisma.product.update({
      where: { id },
      data: updateData,
    });

    return res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      product,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error updating product',
    });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.product.delete({
      where: { id },
    });

    return res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error deleting product',
    });
  }
};
