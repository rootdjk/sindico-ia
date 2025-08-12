import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { OccurrencesModule } from './occurrences/occurrences.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    // Configuração de variáveis de ambiente
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    
    // Módulos da aplicação
    DatabaseModule,
    AuthModule,
    UsersModule,
    OccurrencesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}