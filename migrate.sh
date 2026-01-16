#!/bin/sh
cd /app/packages/db/prisma
/app/node_modules/.bin/prisma migrate deploy
