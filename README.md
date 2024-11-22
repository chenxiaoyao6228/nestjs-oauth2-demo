# NestJS OAuth2 Demo

NestJS OAuth2 Demo with and without Passportjs

## Setquence diagram

### Without passportjs

```mermaid

sequenceDiagram
    participant User
    participant Browser
    participant AppController
    participant AuthController
    participant AuthService
    participant GitHub
    participant Database

    User->>Browser: Access homepage
    Browser->>AppController: GET / (getHello)
    AppController->>Browser: Return login page HTML

    User->>Browser: Click "Login with GitHub"
    Browser->>AuthController: GET /auth/github/login (githubAuth)
    AuthController->>AuthService: getGithubAuthUrl()
    AuthService->>GitHub: Generate auth URL
    AuthController->>Browser: Redirect to GitHub auth page

    GitHub->>Browser: Show authorization page
    User->>GitHub: Confirm authorization
    GitHub->>AuthController: GET /auth/github/callback (githubCallback)

    AuthController->>AuthService: getGithubToken(code)
    AuthService->>GitHub: POST /login/oauth/access_token
    GitHub->>AuthService: Return access_token

    AuthController->>AuthService: getGithubUser(access_token)
    AuthService->>GitHub: GET /user
    GitHub->>AuthService: Return user info

    AuthController->>AuthService: findOrCreateUser(githubUser)
    AuthService->>Database: Find/Create user

    AuthController->>AuthService: generateJwtToken(user)
    AuthService->>AuthService: JwtService.sign(payload)

    AuthController->>Browser: Redirect to /auth-success.html
    Browser->>Browser: localStorage.setItem('auth_token', token)
```

### with passportjs

```mermaid
sequenceDiagram
    participant User
    participant Browser
    participant AppController
    participant AuthGuard
    participant AuthController
    participant PassportStrategy
    participant AuthService
    participant GitHub
    participant Database

    User->>Browser: Access homepage
    Browser->>AppController: GET / (getHello)
    AppController->>Browser: Return login page HTML

    User->>Browser: Click "Login with GitHub"
    Browser->>AuthGuard: GET /auth-passport/github (GithubGuard)
    AuthGuard->>PassportStrategy: Passport GitHub Strategy
    PassportStrategy->>GitHub: Redirect to GitHub auth page

    GitHub->>Browser: Show authorization page
    User->>GitHub: Confirm authorization
    GitHub->>AuthGuard: GET /auth/github/callback (GithubGuard)

    AuthGuard->>PassportStrategy: Validate callback
    PassportStrategy->>GitHub: Exchange code for token
    GitHub->>PassportStrategy: Return access_token

    PassportStrategy->>GitHub: GET user profile
    GitHub->>PassportStrategy: Return user info
    PassportStrategy->>AuthService: validate(profile)
    AuthService->>Database: findOrCreate user

    AuthController->>AuthService: login(user)
    AuthService->>AuthService: Generate JWT
    AuthController->>Browser: Redirect to success page with token
    Browser->>Browser: Store token in localStorage

    %% Protected Route Flow
    Note over Browser,AuthGuard: Protected Route Flow
    Browser->>AppController: Request Protected Resource
    AppController->>AuthGuard: Check JWT Token
    AuthGuard->>AuthService: Validate Token
    alt Valid Token
        AuthService->>AuthGuard: Token Valid
        AuthGuard->>AppController: Allow Request
        AppController->>Browser: Return Protected Resource
    else Invalid Token
        AuthService->>AuthGuard: Token Invalid
        AuthGuard->>Browser: 401 Unauthorized
    end
```

## Passport Implementation Analysis

Using Passport.js in OAuth2.0 flow simplifies the implementation in several ways:

1. **Standardized Authentication Flow**:

   - Passport abstracts the OAuth2.0 flow into strategies
   - Handles the complexity of token exchange and user profile fetching

2. **Built-in Middleware**:

   - Provides Guards and Decorators for easy integration
   - Automatic session handling if needed

3. **Simplified Code Structure**:

   - Reduces boilerplate code
   - Centralizes authentication logic in strategies

4. **Security Benefits**:
   - Battle-tested implementations
   - Built-in protection against common vulnerabilities

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

### Project setup

```bash
$ pnpm install
```

### Compile and run the project

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

### Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

### Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

### License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
