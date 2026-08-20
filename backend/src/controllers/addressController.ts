import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { prisma } from '../config/db';

export const getAddresses = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const addresses = await prisma.address.findMany({
      where: { userId },
      orderBy: { isDefault: 'desc' },
    });

    return res.status(200).json({
      success: true,
      addresses,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error fetching addresses',
    });
  }
};

export const createAddress = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.userId!;
    const {
      fullName,
      phone,
      houseBuilding,
      street,
      area,
      city,
      state,
      pincode,
      landmark,
      type,
      latitude,
      longitude,
      isDefault,
    } = req.body;

    if (isDefault) {
      // Unset previous default address
      await prisma.address.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false },
      });
    }

    const address = await prisma.address.create({
      data: {
        userId,
        fullName: fullName || 'Customer',
        phone: phone || '0000000000',
        houseBuilding: houseBuilding || 'House',
        street: street || area || 'Main Street',
        area: area || 'Area',
        city: city || 'Pune',
        state: state || 'Maharashtra',
        pincode: pincode || '411001',
        landmark: landmark || '',
        type: type || 'HOME',
        latitude: latitude ? parseFloat(latitude) : undefined,
        longitude: longitude ? parseFloat(longitude) : undefined,
        isDefault: isDefault || false,
      },
    });

    return res.status(201).json({
      success: true,
      message: 'Address added successfully',
      address,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error creating address',
    });
  }
};

export const updateAddress = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;
    const { isDefault } = req.body;

    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false },
      });
    }

    const address = await prisma.address.update({
      where: { id },
      data: req.body,
    });

    return res.status(200).json({
      success: true,
      message: 'Address updated successfully',
      address,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error updating address',
    });
  }
};

export const deleteAddress = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.address.delete({
      where: { id },
    });

    return res.status(200).json({
      success: true,
      message: 'Address deleted successfully',
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error deleting address',
    });
  }
};
