/*
  Warnings:

  - The values [PENDING,RUNNING,SUCCESS,FAILED,STOPPED] on the enum `ExecStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [MANUAL,TRIGGER,WEBHOOK,CRON] on the enum `ExecutionMode` will be removed. If these variants are still used in the database, this will fail.
  - The values [GET,POST,PUT] on the enum `Method` will be removed. If these variants are still used in the database, this will fail.
  - The values [ResendEmail,Telegram,Gemini] on the enum `Platform` will be removed. If these variants are still used in the database, this will fail.
  - The values [MANUAL,WEBHOOK,CRON] on the enum `TriggerType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ExecStatus_new" AS ENUM ('pending', 'running', 'success', 'failed', 'stopped');
ALTER TABLE "Execution" ALTER COLUMN "status" TYPE "ExecStatus_new" USING ("status"::text::"ExecStatus_new");
ALTER TYPE "ExecStatus" RENAME TO "ExecStatus_old";
ALTER TYPE "ExecStatus_new" RENAME TO "ExecStatus";
DROP TYPE "public"."ExecStatus_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "ExecutionMode_new" AS ENUM ('manual', 'webhook', 'cron');
ALTER TABLE "Execution" ALTER COLUMN "mode" TYPE "ExecutionMode_new" USING ("mode"::text::"ExecutionMode_new");
ALTER TYPE "ExecutionMode" RENAME TO "ExecutionMode_old";
ALTER TYPE "ExecutionMode_new" RENAME TO "ExecutionMode";
DROP TYPE "public"."ExecutionMode_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "Method_new" AS ENUM ('get', 'post', 'put');
ALTER TYPE "Method" RENAME TO "Method_old";
ALTER TYPE "Method_new" RENAME TO "Method";
DROP TYPE "public"."Method_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "Platform_new" AS ENUM ('resendemail', 'telegram', 'gemini');
ALTER TABLE "Credentials" ALTER COLUMN "platform" TYPE "Platform_new" USING ("platform"::text::"Platform_new");
ALTER TYPE "Platform" RENAME TO "Platform_old";
ALTER TYPE "Platform_new" RENAME TO "Platform";
DROP TYPE "public"."Platform_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "TriggerType_new" AS ENUM ('manual', 'webhook', 'cron');
ALTER TABLE "Workflow" ALTER COLUMN "triggerType" TYPE "TriggerType_new" USING ("triggerType"::text::"TriggerType_new");
ALTER TYPE "TriggerType" RENAME TO "TriggerType_old";
ALTER TYPE "TriggerType_new" RENAME TO "TriggerType";
DROP TYPE "public"."TriggerType_old";
COMMIT;
