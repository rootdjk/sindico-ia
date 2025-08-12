import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuração de CORS
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Prefixo global para API
  app.setGlobalPrefix('api');

  // Pipe de validação global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Configuração do Swagger
  const config = new DocumentBuilder()
    .setTitle('Síndico Online API')
    .setDescription('API para gestão de condomínios - Sistema Síndico Online')
    .setVersion('1.0')
    .addTag('Ocorrências', 'Endpoints para gestão de ocorrências')
    .addTag('Usuários', 'Endpoints para gestão de usuários')
    .addTag('Autenticação', 'Endpoints para autenticação')
    .addBearerAuth()
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3001;
  await app.listen(port);
  
  console.log(`🚀 Síndico Online API rodando em: http://localhost:${port}`);
  console.log(`📚 Documentação disponível em: http://localhost:${port}/api/docs`);
}

bootstrap();