import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class MenuItemsService {
  constructor(private prisma: PrismaService) {}

  create(data: Prisma.MenuItemUncheckedCreateInput) {
    return this.prisma.menuItem.create({ data });
  }

  findAll(query: any) {
    const where: Prisma.MenuItemWhereInput = {};
    if (query.categoryId) where.categoryId = +query.categoryId;
    if (query.isAvailable !== undefined) where.isAvailable = query.isAvailable === 'true';
    if (query.search) {
      where.name = { contains: query.search, mode: 'insensitive' };
    }
    return this.prisma.menuItem.findMany({ where, include: { category: true } });
  }

  findOne(id: number) {
    return this.prisma.menuItem.findUnique({ where: { id }, include: { category: true } });
  }

  update(id: number, data: Prisma.MenuItemUncheckedUpdateInput) {
    return this.prisma.menuItem.update({ where: { id }, data });
  }

  remove(id: number) {
    return this.prisma.menuItem.delete({ where: { id } });
  }
}
