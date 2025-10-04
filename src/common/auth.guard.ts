import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import axios from 'axios';
import { AuthUser } from './interfaces/auth-user.interface';
import { Request } from 'express';

interface RequestWithUser extends Request {
  user?: AuthUser;
}

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<RequestWithUser>();
    const authHeader = req.headers.authorization;

    if (!authHeader) throw new UnauthorizedException('Missing token');

    if (!process.env.USERS_URL) throw new Error('USERS_URL not found');

    try {
      const { data } = await axios.post<AuthUser>(
        `${process.env.USERS_URL}/introspect`,
        { token: authHeader },
      );

      req.user = data;
      return true;
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
