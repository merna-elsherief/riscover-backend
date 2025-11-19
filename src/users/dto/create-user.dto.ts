export class CreateUserDto {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  role: string;
  department: string;
  // provider مش بنحطها هنا لأنها هتكون 'local' أوتوماتيك واحنا بنعمل create
}