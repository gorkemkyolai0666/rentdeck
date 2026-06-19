-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('admin', 'counter_staff', 'technician', 'manager');

-- CreateEnum
CREATE TYPE "EquipmentType" AS ENUM ('ski', 'snowboard', 'boots', 'helmet', 'poles', 'bindings');

-- CreateEnum
CREATE TYPE "EquipmentCondition" AS ENUM ('excellent', 'good', 'fair', 'needs_service');

-- CreateEnum
CREATE TYPE "EquipmentStatus" AS ENUM ('available', 'rented', 'maintenance', 'retired');

-- CreateEnum
CREATE TYPE "PackageDuration" AS ENUM ('half_day', 'full_day', 'two_day', 'week', 'season');

-- CreateEnum
CREATE TYPE "RentalStatus" AS ENUM ('reserved', 'active', 'overdue', 'returned', 'cancelled');

-- CreateEnum
CREATE TYPE "TuneJobType" AS ENUM ('wax', 'edge_tune', 'binding_mount', 'full_tune', 'repair');

-- CreateEnum
CREATE TYPE "TuneJobStatus" AS ENUM ('scheduled', 'in_progress', 'completed', 'cancelled');

-- CreateTable
CREATE TABLE "RentShop" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL DEFAULT '',
    "city" TEXT NOT NULL DEFAULT '',
    "region" TEXT NOT NULL DEFAULT '',
    "phone" TEXT NOT NULL DEFAULT '',
    "email" TEXT NOT NULL DEFAULT '',
    "season" TEXT NOT NULL DEFAULT 'winter',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RentShop_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'counter_staff',
    "specialty" TEXT NOT NULL DEFAULT '',
    "shopId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Renter" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL DEFAULT '',
    "bootSize" TEXT NOT NULL DEFAULT '',
    "skillLevel" TEXT NOT NULL DEFAULT 'intermediate',
    "notes" TEXT NOT NULL DEFAULT '',
    "shopId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Renter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Equipment" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "EquipmentType" NOT NULL DEFAULT 'ski',
    "brand" TEXT NOT NULL DEFAULT '',
    "size" TEXT NOT NULL DEFAULT '',
    "condition" "EquipmentCondition" NOT NULL DEFAULT 'good',
    "status" "EquipmentStatus" NOT NULL DEFAULT 'available',
    "dailyRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "notes" TEXT NOT NULL DEFAULT '',
    "shopId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Equipment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RentalPackage" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "duration" "PackageDuration" NOT NULL DEFAULT 'full_day',
    "price" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "depositAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "description" TEXT NOT NULL DEFAULT '',
    "shopId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RentalPackage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rental" (
    "id" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "status" "RentalStatus" NOT NULL DEFAULT 'active',
    "totalPrice" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "depositPaid" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "notes" TEXT NOT NULL DEFAULT '',
    "renterId" TEXT NOT NULL,
    "equipmentId" TEXT,
    "packageId" TEXT,
    "shopId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Rental_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TuneJob" (
    "id" TEXT NOT NULL,
    "scheduledAt" TIMESTAMP(3) NOT NULL,
    "type" "TuneJobType" NOT NULL DEFAULT 'wax',
    "status" "TuneJobStatus" NOT NULL DEFAULT 'scheduled',
    "technician" TEXT NOT NULL DEFAULT '',
    "notes" TEXT NOT NULL DEFAULT '',
    "renterId" TEXT NOT NULL,
    "equipmentId" TEXT,
    "shopId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TuneJob_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "RentShop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Renter" ADD CONSTRAINT "Renter_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "RentShop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Equipment" ADD CONSTRAINT "Equipment_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "RentShop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RentalPackage" ADD CONSTRAINT "RentalPackage_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "RentShop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rental" ADD CONSTRAINT "Rental_renterId_fkey" FOREIGN KEY ("renterId") REFERENCES "Renter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rental" ADD CONSTRAINT "Rental_equipmentId_fkey" FOREIGN KEY ("equipmentId") REFERENCES "Equipment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rental" ADD CONSTRAINT "Rental_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "RentalPackage"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rental" ADD CONSTRAINT "Rental_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "RentShop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TuneJob" ADD CONSTRAINT "TuneJob_renterId_fkey" FOREIGN KEY ("renterId") REFERENCES "Renter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TuneJob" ADD CONSTRAINT "TuneJob_equipmentId_fkey" FOREIGN KEY ("equipmentId") REFERENCES "Equipment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TuneJob" ADD CONSTRAINT "TuneJob_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "RentShop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

