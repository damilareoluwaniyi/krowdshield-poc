# KrowdShield

A community-powered safety reporting platform.

## Environment Setup

1. Create a `.env` file from the template:
   ```bash
   # Using the setup script
   chmod +x scripts/setup-env.sh
   ./scripts/setup-env.sh

   # Or manually
   cp .env.example .env
   ```

2. Update the `.env` file with your actual values:
   - `VITE_SUPABASE_URL`: Your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key

## Environment Variables

Different environments use different .env files:

- Development: `.env.development`
- Testing: `.env.test`
- Production: `.env.production`

## Secrets Management

This project uses the following approach for managing secrets:

1. Local Development:
   - Use `.env` file locally (git-ignored)
   - Never commit actual secrets to version control

2. CI/CD:
   - Use GitHub Secrets or similar CI platform secrets
   - Access secrets through environment variables

3. Production:
   - Use environment variables in Docker containers
   - Pass secrets through Docker Compose or Kubernetes secrets

## Security Best Practices

1. Never commit secrets to version control
2. Use environment variables for configuration
3. Keep different secrets for different environments
4. Rotate secrets regularly
5. Use secret management services in production

## Docker Deployment

When deploying with Docker, pass environment variables securely:

```bash
# Development
docker compose --env-file .env.development up dev

# Testing
docker compose --env-file .env.test up test

# Production
docker compose --env-file .env.production up prod
```

## GitHub Actions (if using)

Store secrets in GitHub repository settings:
1. Go to Settings > Secrets and Variables > Actions
2. Add your secrets:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - Other deployment secrets

Then use them in your workflows:

```yaml
env:
  VITE_SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
  VITE_SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_ANON_KEY }}
```