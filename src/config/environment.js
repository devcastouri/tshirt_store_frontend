const config = {
  apiUrl: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  environment: process.env.REACT_APP_ENVIRONMENT || 'development',
  stripePublicKey: process.env.REACT_APP_STRIPE_PUBLIC_KEY,
  cloudinaryUploadPreset: process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET,
  isDevelopment: process.env.REACT_APP_ENVIRONMENT === 'development',
  isProduction: process.env.REACT_APP_ENVIRONMENT === 'production',
};

export default config;