# Deployment Guide

**Date**: December 30, 2025  
**Status**: ✅ COMPLETE  
**Version**: 1.0

---

## Overview

This guide provides step-by-step instructions for deploying the Rupiya application to production using various hosting platforms.

---

## 📚 Table of Contents

1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Environment Configuration](#environment-configuration)
3. [Vercel Deployment](#vercel-deployment)
4. [Firebase Hosting Deployment](#firebase-hosting-deployment)
5. [Docker Deployment](#docker-deployment)
6. [Post-Deployment Verification](#post-deployment-verification)
7. [Monitoring & Maintenance](#monitoring--maintenance)

---

## Pre-Deployment Checklist

Before deploying to production, ensure:

- ✅ All features are implemented and tested
- ✅ No TypeScript compilation errors
- ✅ Environment variables are configured
- ✅ Firebase project is set up
- ✅ Security rules are configured
- ✅ Database backups are enabled
- ✅ Error tracking is configured
- ✅ Analytics is enabled
- ✅ Performance monitoring is enabled
- ✅ SSL certificate is valid
- ✅ Domain is configured
- ✅ Email service is configured (for password reset)

---

## Environment Configuration

### Required Environment Variables

Create `.env.local` file in the project root:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Application Configuration
NEXT_PUBLIC_APP_URL=https://your-domain.com
NEXT_PUBLIC_APP_NAME=Rupiya

# Analytics (Optional)
NEXT_PUBLIC_ANALYTICS_ID=your_analytics_id

# API Configuration (Optional)
NEXT_PUBLIC_API_URL=https://api.your-domain.com
```

### Environment Variable Reference

| Variable | Type | Required | Description |
|----------|------|----------|-------------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | string | Yes | Firebase API key |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | string | Yes | Firebase auth domain |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | string | Yes | Firebase project ID |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | string | Yes | Firebase storage bucket |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | string | Yes | Firebase messaging sender ID |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | string | Yes | Firebase app ID |
| `NEXT_PUBLIC_APP_URL` | string | Yes | Application URL |
| `NEXT_PUBLIC_APP_NAME` | string | No | Application name |

---

## Vercel Deployment

### Option 1: Using Vercel CLI

**Step 1: Install Vercel CLI**
```bash
npm install -g vercel
```

**Step 2: Login to Vercel**
```bash
vercel login
```

**Step 3: Deploy**
```bash
vercel
```

**Step 4: Configure Environment Variables**
- Go to Vercel dashboard
- Select your project
- Go to Settings → Environment Variables
- Add all required environment variables

**Step 5: Redeploy**
```bash
vercel --prod
```

### Option 2: Using GitHub Integration

**Step 1: Push to GitHub**
```bash
git push origin main
```

**Step 2: Connect to Vercel**
- Go to https://vercel.com
- Click "New Project"
- Select your GitHub repository
- Configure environment variables
- Click "Deploy"

**Step 3: Configure Domain**
- Go to project settings
- Add custom domain
- Update DNS records

### Vercel Configuration

Create `vercel.json` in project root:

```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "env": {
    "NEXT_PUBLIC_FIREBASE_API_KEY": "@firebase_api_key",
    "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN": "@firebase_auth_domain",
    "NEXT_PUBLIC_FIREBASE_PROJECT_ID": "@firebase_project_id",
    "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET": "@firebase_storage_bucket",
    "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID": "@firebase_messaging_sender_id",
    "NEXT_PUBLIC_FIREBASE_APP_ID": "@firebase_app_id"
  }
}
```

### Vercel Best Practices

- ✅ Enable automatic deployments on push
- ✅ Set up preview deployments for PRs
- ✅ Configure custom domain
- ✅ Enable HTTPS
- ✅ Set up monitoring
- ✅ Configure error tracking
- ✅ Enable analytics

---

## Firebase Hosting Deployment

### Step 1: Install Firebase CLI

```bash
npm install -g firebase-tools
```

### Step 2: Login to Firebase

```bash
firebase login
```

### Step 3: Initialize Firebase Project

```bash
firebase init hosting
```

**Select options**:
- Project: Select your Firebase project
- Public directory: `.next` (or `out` for static export)
- Single-page app: No
- Automatic builds: Yes (if using GitHub integration)

### Step 4: Build Application

```bash
npm run build
```

### Step 5: Deploy

```bash
firebase deploy --only hosting
```

### Firebase Configuration

Create `firebase.json` in project root:

```json
{
  "hosting": {
    "public": ".next",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "**/*.@(js|css)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "public, max-age=31536000, immutable"
          }
        ]
      }
    ]
  }
}
```

### Firebase Best Practices

- ✅ Enable automatic deployments
- ✅ Configure custom domain
- ✅ Enable HTTPS
- ✅ Set up monitoring
- ✅ Configure security rules
- ✅ Enable backups
- ✅ Set up error tracking

---

## Docker Deployment

### Step 1: Build Docker Image

```bash
docker build -t rupiya:latest .
```

### Step 2: Run Docker Container

```bash
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key \
  -e NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain \
  -e NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id \
  -e NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket \
  -e NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id \
  -e NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id \
  rupiya:latest
```

### Step 3: Using Docker Compose

```bash
docker-compose up -d
```

### Docker Configuration

**Dockerfile** (already included):
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

**docker-compose.yml** (already included):
```yaml
version: '3.8'

services:
  rupiya:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_FIREBASE_API_KEY=${NEXT_PUBLIC_FIREBASE_API_KEY}
      - NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=${NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN}
      - NEXT_PUBLIC_FIREBASE_PROJECT_ID=${NEXT_PUBLIC_FIREBASE_PROJECT_ID}
      - NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=${NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET}
      - NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=${NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID}
      - NEXT_PUBLIC_FIREBASE_APP_ID=${NEXT_PUBLIC_FIREBASE_APP_ID}
    restart: unless-stopped
```

### Docker Best Practices

- ✅ Use Alpine Linux for smaller images
- ✅ Multi-stage builds for optimization
- ✅ Use environment variables
- ✅ Set resource limits
- ✅ Enable health checks
- ✅ Use restart policies
- ✅ Monitor container logs

---

## Post-Deployment Verification

### Step 1: Verify Application

- [ ] Application loads without errors
- [ ] Authentication works (login/signup)
- [ ] All pages are accessible
- [ ] Database operations work
- [ ] File uploads work
- [ ] Charts render correctly
- [ ] Responsive design works on mobile
- [ ] Performance is acceptable

### Step 2: Verify Security

- [ ] HTTPS is enabled
- [ ] Security headers are set
- [ ] CORS is configured
- [ ] Authentication is working
- [ ] User data is isolated
- [ ] No sensitive data in logs

### Step 3: Verify Monitoring

- [ ] Error tracking is working
- [ ] Analytics is tracking events
- [ ] Performance monitoring is active
- [ ] Logs are being collected
- [ ] Alerts are configured

### Step 4: Verify Backups

- [ ] Database backups are enabled
- [ ] Backup schedule is configured
- [ ] Backup retention is set
- [ ] Restore process is tested

---

## Monitoring & Maintenance

### Daily Monitoring

- Check error logs
- Monitor performance metrics
- Check user activity
- Verify backups completed

### Weekly Maintenance

- Review analytics
- Check security alerts
- Update dependencies
- Review performance trends

### Monthly Maintenance

- Security audit
- Performance optimization
- Database maintenance
- Backup verification

### Quarterly Maintenance

- Full security review
- Performance benchmarking
- Capacity planning
- Disaster recovery testing

---

## Troubleshooting

### Application Won't Start

**Issue**: Application fails to start after deployment

**Solution**:
1. Check environment variables are set
2. Check Firebase credentials are valid
3. Check database connectivity
4. Review application logs
5. Check for TypeScript errors

### Database Connection Issues

**Issue**: Cannot connect to Firestore

**Solution**:
1. Verify Firebase project ID
2. Check security rules
3. Verify network connectivity
4. Check Firebase quota
5. Review error logs

### Performance Issues

**Issue**: Application is slow

**Solution**:
1. Check performance metrics
2. Optimize database queries
3. Enable caching
4. Reduce bundle size
5. Optimize images

### Authentication Issues

**Issue**: Users cannot login

**Solution**:
1. Verify Firebase Auth is enabled
2. Check authentication methods
3. Verify email configuration
4. Check security rules
5. Review error logs

---

## Rollback Procedure

### Vercel Rollback

```bash
vercel rollback
```

### Firebase Rollback

```bash
firebase hosting:channel:deploy previous
```

### Docker Rollback

```bash
docker run -p 3000:3000 rupiya:previous
```

---

## Performance Optimization

### Before Deployment

- [ ] Run `npm run build` and check bundle size
- [ ] Run performance tests
- [ ] Optimize images
- [ ] Enable code splitting
- [ ] Configure caching headers

### After Deployment

- [ ] Monitor Core Web Vitals
- [ ] Check page load times
- [ ] Monitor API response times
- [ ] Check error rates
- [ ] Monitor user experience

---

## Security Hardening

### Before Deployment

- [ ] Enable HTTPS
- [ ] Configure security headers
- [ ] Set up rate limiting
- [ ] Configure CORS
- [ ] Enable authentication

### After Deployment

- [ ] Monitor security alerts
- [ ] Review access logs
- [ ] Check for vulnerabilities
- [ ] Monitor failed login attempts
- [ ] Review user permissions

---

## Scaling Considerations

### Horizontal Scaling

- Use load balancer
- Deploy multiple instances
- Use CDN for static assets
- Configure auto-scaling

### Vertical Scaling

- Increase server resources
- Optimize database queries
- Enable caching
- Reduce payload size

---

## Cost Optimization

### Vercel

- Use free tier for development
- Pay-as-you-go for production
- Monitor usage
- Optimize builds

### Firebase

- Use free tier for development
- Monitor Firestore usage
- Optimize queries
- Enable auto-scaling

### Docker

- Use container registry
- Optimize image size
- Monitor resource usage
- Use auto-scaling

---

## Disaster Recovery

### Backup Strategy

- Daily automated backups
- Weekly manual backups
- Monthly archive backups
- Test restore process monthly

### Recovery Procedure

1. Identify issue
2. Restore from backup
3. Verify data integrity
4. Test application
5. Notify users if needed

---

## Support & Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Docker Documentation](https://docs.docker.com)

---

**Last Updated**: December 30, 2025  
**Version**: 1.0  
**Status**: ✅ Complete

