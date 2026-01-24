import { InjectModel } from '@m8a/nestjs-typegoose';
import { HttpException, Injectable } from '@nestjs/common';
import type { ReturnModelType } from '@typegoose/typegoose';
import { GoogleProfile } from '../auth/interfaces/auth.interface';
import { User } from './models/user.model';

@Injectable()
export class UserService {
  constructor(@InjectModel(User) private readonly userModel: ReturnModelType<typeof User>) {}

  async findOrCreateByGoogle(profile: GoogleProfile) {
    const email = profile.emails?.[0]?.value;
    if (!email) {
      throw new HttpException('No email found in Google profile', 400);
    }

    let user = await this.userModel.findOne({ email });

    if (!user) {
      user = await this.userModel.create({
        email,
        firstName: profile.name?.givenName || '',
        lastName: profile.name?.familyName || '',
        picture: profile.photos?.[0]?.value,
        googleId: profile.id,
      });
    } else if (!user.googleId) {
      user.googleId = profile.id;
      await user.save();
    }
    return user;
  }

  async findById(id: string) {
    return this.userModel.findById(id).exec();
  }
}
