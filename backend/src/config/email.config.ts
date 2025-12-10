import { registerAs } from '@nestjs/config';

export default registerAs('email', () => {
  // Validate required environment variables
  const requiredVars = ['RESEND_API_KEY'];
  const missingVars = requiredVars.filter((varName) => !process.env[varName]);

  if (missingVars.length > 0) {
    console.warn(
      `Missing required email configuration: ${missingVars.join(', ')}`,
    );
  }

  return {
    provider: 'resend',
    apiKey: process.env.RESEND_API_KEY,
    from: process.env.EMAIL_FROM || 'noreply@ezconadvisory.com',
  };
});
