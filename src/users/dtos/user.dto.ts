/* eslint-disable prettier/prettier */
import { Expose } from 'class-transformer';

export class UserDto {
  @Expose()
  id: number;
  
  @Expose()
  email: string;
}
