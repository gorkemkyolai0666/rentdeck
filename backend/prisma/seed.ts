import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const demoEmail = 'demo@uludagkayak.com';

  const existingUser = await prisma.user.findUnique({
    where: { email: demoEmail },
  });

  if (existingUser) {
    console.log('Demo kullanıcı zaten mevcut.');
    return;
  }

  const shop = await prisma.rentShop.create({
    data: {
      name: 'Uludağ Kayak Kiralama',
      address: '1. Oteller Bölgesi, Kayak Merkezi',
      city: 'Bursa',
      region: 'Uludağ',
      phone: '0224 555 12 34',
      email: 'info@uludagkayak.com',
      season: 'winter',
    },
  });

  const passwordHash = await bcrypt.hash('demo123456', 12);

  await prisma.user.create({
    data: {
      email: demoEmail,
      passwordHash,
      firstName: 'Deniz',
      lastName: 'Arslan',
      role: 'admin',
      specialty: 'Mağaza Müdürü',
      shopId: shop.id,
    },
  });

  const renter1 = await prisma.renter.create({
    data: {
      fullName: 'Mehmet Yılmaz',
      phone: '0532 111 22 33',
      email: 'mehmet.yilmaz@email.com',
      bootSize: '42',
      skillLevel: 'intermediate',
      notes: 'Haftalık kayakçı, genelde orta zorluk pistleri tercih eder',
      shopId: shop.id,
    },
  });

  const renter2 = await prisma.renter.create({
    data: {
      fullName: 'Ayşe Kaya',
      phone: '0533 444 55 66',
      email: 'ayse.kaya@email.com',
      bootSize: '38',
      skillLevel: 'beginner',
      shopId: shop.id,
    },
  });

  const renter3 = await prisma.renter.create({
    data: {
      fullName: 'Can Öztürk',
      phone: '0535 777 88 99',
      email: 'can.ozturk@email.com',
      bootSize: '44',
      skillLevel: 'advanced',
      notes: 'Freestyle snowboard tercih ediyor',
      shopId: shop.id,
    },
  });

  const pkg1 = await prisma.rentalPackage.create({
    data: {
      name: 'Yarım Gün Paketi',
      duration: 'half_day',
      price: 350,
      depositAmount: 500,
      description: '4 saatlik kayak/snowboard kiralama',
      shopId: shop.id,
    },
  });

  const pkg2 = await prisma.rentalPackage.create({
    data: {
      name: 'Tam Gün Paketi',
      duration: 'full_day',
      price: 550,
      depositAmount: 750,
      description: 'Gün boyu ekipman kiralama + kask dahil',
      shopId: shop.id,
    },
  });

  const ski1 = await prisma.equipment.create({
    data: {
      name: 'Rossignol Experience 86 Ti',
      type: 'ski',
      brand: 'Rossignol',
      size: '170cm',
      condition: 'excellent',
      status: 'available',
      dailyRate: 200,
      shopId: shop.id,
    },
  });

  const ski2 = await prisma.equipment.create({
    data: {
      name: 'Atomic Vantage 90 Ti',
      type: 'ski',
      brand: 'Atomic',
      size: '165cm',
      condition: 'good',
      status: 'rented',
      dailyRate: 180,
      shopId: shop.id,
    },
  });

  const board1 = await prisma.equipment.create({
    data: {
      name: 'Burton Custom Flying V',
      type: 'snowboard',
      brand: 'Burton',
      size: '156cm',
      condition: 'good',
      status: 'available',
      dailyRate: 220,
      shopId: shop.id,
    },
  });

  await prisma.equipment.createMany({
    data: [
      { name: 'Salomon S/Pro 100 Bot', type: 'boots', brand: 'Salomon', size: '42', condition: 'good', status: 'available', dailyRate: 80, shopId: shop.id },
      { name: 'POC Obex SPIN Kask', type: 'helmet', brand: 'POC', size: 'M', condition: 'excellent', status: 'available', dailyRate: 50, shopId: shop.id },
      { name: 'Leki Carbon Bot', type: 'poles', brand: 'Leki', size: '120cm', condition: 'fair', status: 'maintenance', dailyRate: 30, notes: 'Kayış değişimi gerekiyor', shopId: shop.id },
      { name: 'Head Supershape i.Rally', type: 'ski', brand: 'Head', size: '160cm', condition: 'needs_service', status: 'maintenance', dailyRate: 150, notes: 'Kenar bileme bekliyor', shopId: shop.id },
    ],
  });

  const now = new Date();
  const tomorrow = new Date(now.getTime() + 86400000);

  await prisma.rental.create({
    data: {
      startDate: now,
      endDate: tomorrow,
      status: 'active',
      totalPrice: 550,
      depositPaid: 750,
      renterId: renter1.id,
      equipmentId: ski2.id,
      packageId: pkg2.id,
      shopId: shop.id,
      notes: 'Kask dahil tam gün paketi',
    },
  });

  await prisma.rental.create({
    data: {
      startDate: new Date(now.getTime() - 2 * 86400000),
      endDate: now,
      status: 'returned',
      totalPrice: 350,
      depositPaid: 500,
      renterId: renter2.id,
      equipmentId: ski1.id,
      packageId: pkg1.id,
      shopId: shop.id,
    },
  });

  await prisma.tuneJob.create({
    data: {
      scheduledAt: tomorrow,
      type: 'edge_tune',
      status: 'scheduled',
      technician: 'Burak Tekin',
      renterId: renter3.id,
      equipmentId: board1.id,
      shopId: shop.id,
      notes: 'Kenar bileme + wax',
    },
  });

  await prisma.tuneJob.create({
    data: {
      scheduledAt: now,
      type: 'wax',
      status: 'in_progress',
      technician: 'Burak Tekin',
      renterId: renter1.id,
      shopId: shop.id,
    },
  });

  console.log('RentDeck demo verisi oluşturuldu.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
