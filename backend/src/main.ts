import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { StripTimestampsInterceptor } from './common/interceptors/strip-timestamps.interceptor';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from './modules/auth/guards/jwt.guard';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const reflector = app.get(Reflector);

  app.enableCors();

  app.useGlobalGuards(new JwtAuthGuard(reflector));

  app.useGlobalInterceptors(
    new StripTimestampsInterceptor(),
    new ClassSerializerInterceptor(reflector),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('KeeperMe API')
    .setDescription(
      'API completa para gerenciamento financeiro pessoal e em grupo.\n\n' +
        'Recursos principais:\n' +
        '- Autenticação via Google OAuth\n' +
        '- Gestão de transações individuais e em grupo\n' +
        '- Categorias personalizáveis\n' +
        '- Sistema de convites para grupos financeiros\n' +
        '- Chat com IA para registro de transações\n' +
        '- Controle de permissões em grupos',
    )
    .setVersion('1.0.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .addTag('Auth', 'Autenticação e autorização')
    .addTag('Users', 'Gerenciamento de usuários')
    .addTag('Categories', 'Categorias de transações')
    .addTag('Transactions', 'Transações financeiras individuais e de grupo')
    .addTag('Groups', 'Grupos financeiros compartilhados')
    .addTag('Invites', 'Convites para grupos')
    .addTag('Chat Sessions', 'Sessões de chat com IA')
    .addTag('Chat Messages', 'Mensagens de chat')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
  });

  await app.listen(process.env.PORT ?? 3001, '0.0.0.0');
}
bootstrap().catch((error) => {
  console.error(error);
  process.exit(1);
});
