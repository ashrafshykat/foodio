import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, OrderStatus } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, items: { menuItemId: number; quantity: number }[]) {
    let totalAmount = 0;
    const orderItemsData = [];

    for (const item of items) {
      const menuItem = await this.prisma.menuItem.findUnique({
        where: { id: item.menuItemId },
      });

      if (!menuItem) {
        throw new BadRequestException(`Menu item with ID ${item.menuItemId} not found`);
      }

      if (!menuItem.isAvailable) {
        throw new BadRequestException(`Menu item ${menuItem.name} is currently unavailable`);
      }

      const price = Number(menuItem.price);
      totalAmount += price * item.quantity;

      orderItemsData.push({
        menuItemId: item.menuItemId,
        quantity: item.quantity,
        priceAtTime: price,
      });
    }

    return this.prisma.order.create({
      data: {
        userId,
        totalAmount,
        status: OrderStatus.PENDING,
        items: {
          create: orderItemsData,
        },
      },
      include: {
        items: { include: { menuItem: true } },
      },
    });
  }

  findAll() {
    return this.prisma.order.findMany({
      include: {
        user: { select: { id: true, name: true, email: true } },
        items: { include: { menuItem: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  findUserOrders(userId: number) {
    return this.prisma.order.findMany({
      where: { userId },
      include: {
        items: { include: { menuItem: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  findOne(id: number) {
    return this.prisma.order.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true, email: true } },
        items: { include: { menuItem: true } },
      },
    });
  }

  updateStatus(id: number, status: OrderStatus) {
    return this.prisma.order.update({
      where: { id },
      data: { status },
      include: {
        user: { select: { id: true, name: true, email: true } },
        items: { include: { menuItem: true } },
      },
    });
  }
}
