// import {
//   Inject,
//   Injectable,
//   Logger,
//   UnauthorizedException,
// } from '@nestjs/common';
// import { ConfigType } from '@nestjs/config';
// import { PassportStrategy } from '@nestjs/passport';
// import { Request } from 'express';
// import { ExtractJwt, Strategy } from 'passport-jwt';
// import { appConfig } from 'src/configuration';
// import { COOKIE_NAME } from 'src/utils/constants';
// import { isAuthInfo } from './dto/auth.info';

// /**
//  * JwtStrategy is the Passport strategy responsible for validating incoming JWTs.
//  * It extracts the token (from cookies in this case), verifies it using the configured public key,
//  * and returns the decoded payload (if valid) to be attached to `request.user`.
//  */

// @Injectable()
// export class JwtStrategy extends PassportStrategy(Strategy) {
//   private readonly logger = new Logger(JwtStrategy.name);

//   constructor(@Inject(appConfig.KEY) config: ConfigType<typeof appConfig>) {
//     console.log('jwt strategy 26');
//     /**
//      * Custom extractor to get the JWT from the specified cookie.
//      * This is used instead of the default header-based extraction.
//      */
//     const cookieExt = (req: Request) => {
//       if (req.cookies) return req.cookies[COOKIE_NAME];
//       return null;
//     };

//     /**
//      * Combines custom extractors to allow flexibility in token retrieval.
//      * You could extend this to support Authorization headers, etc.
//      */
//     const tokenExtractor = (req: Request) => {
//       let token = null;

//       if (!token && req.headers.authorization) {
//         token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
//       } else if (!token && req.cookies[COOKIE_NAME]) {
//         token = ExtractJwt.fromExtractors([cookieExt])(req);
//       }

//       return token;
//     };

//     super({
//       jwtFromRequest: tokenExtractor, // Custom token extraction logic
//       ignoreExpiration: false, // Reject expired tokens
//       secretOrKey: config.jwt.publicKey, // Public key used to verify the token (RS256)
//     });
//   }

//   /**
//    * The validate() method is automatically called by Passport after token verification.
//    * You can use it to further verify payload contents or transform it before attaching to `request.user`.
//    *
//    * @param payload - The decoded JWT payload
//    * @returns An object that will be assigned to `request.user` if validation succeeds
//    */
//   async validate(payload: unknown) {
//     // Type guard to ensure payload matches expected AuthInfo shape
//     console.log('payload ', payload);
//     if (isAuthInfo(payload)) {
//       return {
//         userId: payload.userId,
//         email: payload.email,
//         tokenType: payload.tokenType,
//       };
//     } else {
//       // If the payload is invalid or malformed, reject the request
//       // console.log('error from jwt strategy');
//       throw new UnauthorizedException();
//     }
//   }
// }

import {
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { appConfig } from 'src/configuration';
import { isAuthInfo } from './dto/auth.info';
import { COOKIE_NAME } from 'src/utils/constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor(@Inject(appConfig.KEY) config: ConfigType<typeof appConfig>) {
    const cookieExt = (req: Request) => {
      if (req.cookies) {
        return req.cookies[COOKIE_NAME];
      }
      return null;
    };

    const tokenExtractor = (req: Request) => {
      let token = null;
      if (!token && req.cookies[COOKIE_NAME]) {
        token = ExtractJwt.fromExtractors([cookieExt])(req);
      } else if (!token && req.headers.authorization) {
        token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
      } else if (!token && req.query && req.query.token) {
        token = ExtractJwt.fromUrlQueryParameter('token')(req);
      }
      return token;
    };

    super({
      jwtFromRequest: tokenExtractor,
      ignoreExpiration: false,
      secretOrKey: config.jwt.publicKey,
    });
  }

  validate(payload: unknown) {
    if (isAuthInfo(payload)) {
      return {
        userId: payload.userId,
        email: payload.email,
      };
    } else {
      throw new UnauthorizedException();
    }
  }
}
