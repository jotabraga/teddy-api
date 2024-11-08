import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CustomersModule } from './customers/customers.module';
import { TypeOrmModule } from '@nestjs/typeorm';

const prodEnvironment = process.env.NODE_ENV === 'production';

@Module({
  imports: [
    CustomersModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5433,
      username: 'postgres',
      password: 'postgres',
      database: 'postgres',
      synchronize: prodEnvironment ? false : true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
