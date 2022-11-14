import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClipsModule } from './clips/clips.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AnalyzeModule } from './analyze/analyze.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import * as Joi from 'joi';
import {
  ADMIN_PASSWORD,
  ADMIN_USERNAME,
  API_URL,
  DATABASE_URL,
  ENV,
  JWT_SECRET,
  JWT_TOKEN_EXPIRATION,
  PORT,
  TEST_DATABASE_URL,
} from './env.default';

const environmentValidationSchema = Joi.object({
  PORT: Joi.number().default(PORT),
  ENV: Joi.string().valid('development', 'production', 'test').default(ENV),
  API_URL: Joi.string().default(API_URL),
  DATABASE_URL: Joi.string().default(DATABASE_URL),
  TEST_DATABASE_URL: Joi.string().default(TEST_DATABASE_URL),
  JWT_TOKEN_EXPIRATION: Joi.number().default(JWT_TOKEN_EXPIRATION), // seconds
  JWT_SECRET: Joi.string().default(JWT_SECRET),
  ADMIN_USERNAME: Joi.string().default(ADMIN_USERNAME),
  ADMIN_PASSWORD: Joi.string().default(ADMIN_PASSWORD),
});

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: environmentValidationSchema,
    }), // for .env files
    EventEmitterModule.forRoot(),
    MongooseModule.forRoot(process.env.DATABASE_URL || DATABASE_URL),
    AnalyzeModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/',
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'videos'),
      exclude: ['/'],
    }),
    ClipsModule,
    AuthModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
