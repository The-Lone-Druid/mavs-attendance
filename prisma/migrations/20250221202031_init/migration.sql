-- AlterTable
ALTER TABLE "Attendance" ADD COLUMN     "minutesLate" INTEGER,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'ON_TIME';
