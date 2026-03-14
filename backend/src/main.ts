import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. Configure CORS
  // While app.enableCors() works, it's safer to be explicit for production.
  // This ensures your Vercel frontend won't get blocked by browser security.
  app.enableCors({
    origin: '*', // For the test, this ensures connectivity. 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // 2. Global Validation
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true, // Bonus: Throws error if extra fields are sent
    transform: true, // Bonus: Automatically converts payloads to DTO instances
  }));

  // 3. Port Configuration
  // Render (and most hosts) inject a PORT variable. 
  // We use 0.0.0.0 to ensure it's accessible within the container network.
  const port = process.env.PORT || 3001;
  await app.listen(port, '0.0.0.0');

  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();