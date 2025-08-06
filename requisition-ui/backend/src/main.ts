import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  try {
    console.log('Starting NestJS application...');
    
    const app = await NestFactory.create(AppModule);

    // ✅ Enable CORS
    app.enableCors({
       origin: [
        'http://localhost:3001',
        'https://jade-gelato-2c27ab.netlify.app',
      ],
      methods: 'GET,POST,PUT,DELETE',
      credentials: true,
    });

    console.log('CORS enabled');
    console.log('Starting server on port 3000...');
    
    await app.listen(3000);
    
    console.log('Server started successfully on port 3000');
  } catch (error) {
    console.error('Failed to start application:', error);
    process.exit(1);
  }
}

bootstrap().catch((error) => {
  console.error('Bootstrap failed:', error);
  process.exit(1);
});
