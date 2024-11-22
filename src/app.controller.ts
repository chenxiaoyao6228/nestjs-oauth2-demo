import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello() {
    return `<!DOCTYPE html>
        <html lang="en">
          <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>GitHub Login</title>
              <style>
                  .login-btn {
                      display: block;
                      padding: 10px 20px;
                      background-color: #24292e;
                      color: white;
                      text-decoration: none;
                      border-radius: 6px;
                      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
                  }

                  .login-btn-passport {
                    margin-top: 30px;
                  }
                  .login-btn:hover {
                      background-color: #2f363d;
                  }
                  .container {
                      display: flex;
                      flex-direction: column; 
                      justify-content: center;
                      align-items: center;
                      height: 100vh;
                  }
              </style>
          </head>
          <body>
              <div class="container">
                  <a href="/auth/github/login" class="login-btn">
                      Login with GitHub
                  </a>

                  <a href="/auth-passport/github" class="login-btn login-btn-passport">
                      Login with GitHub (passportjs)
                  </a>
              </div>
          </body>
        </html>`;
  }
}
