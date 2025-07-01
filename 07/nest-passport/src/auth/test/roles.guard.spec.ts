import { Reflector } from '@nestjs/core';
import { ExecutionContext } from '@nestjs/common';
import { RolesGuard } from '../roles.guard';
import { Role } from '../../users/entities/user.entity';

describe('roles.guard', () => {
  let reflector: Reflector;
  let guard: RolesGuard;
  let context: ExecutionContext;

  beforeEach(() => {
    reflector = new Reflector();
    guard = new RolesGuard(reflector);
    context = {
      getClass: jest.fn(),
      getHandler: jest.fn(),
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({ user: { role: Role.USER } }),
      }),
    } as unknown as ExecutionContext;
  });

  it('user has required role', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([Role.USER]);
    expect(guard.canActivate(context)).toBe(true);
  });

  it('user has no required role', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([Role.ADMIN]);
    expect(guard.canActivate(context)).toBe(false);
  });

  it('roles are not set', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(undefined);
    expect(guard.canActivate(context)).toBe(true);
  });
});
