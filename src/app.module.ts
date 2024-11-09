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
      host: String(process.env.POSTGRES_HOST),
      port: Number(process.env.POSTGRES_PORT),
      username: String(process.env.POSTGRES_USERNAME),
      password: String(process.env.POSTGRES_PASSWORD),
      database: String(process.env.POSTGRES_DATABASE),
      entities: [__dirname + '/../**/*.entity.{js,ts}'],
      autoLoadEntities: true,
      synchronize: !prodEnvironment,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
