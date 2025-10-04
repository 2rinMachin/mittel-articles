import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import axios from 'axios';
import { AuthUser } from './interfaces/auth-user.interface';

interface RequestWithUser extends Request {
  user?: AuthUser;
}

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<RequestWithUser>();
    const authHeader = req.headers.get('Authorization');

    if (!authHeader) throw new UnauthorizedException('Missing token');

    const token = authHeader.split(' ')[1];
    try {
      const { data } = await axios.post<{
        id: string;
        first_name: string;
        last_name: string;
        email: string;
      }>('http://users-api:3000/introspect', { token });

      req.user = {
        id: data.id,
        firstName: data.first_name,
        lastName: data.last_name,
        email: data.email,
      };
      return true;
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
