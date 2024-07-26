import bcr from "bcryptjs";

export class EncryptionService {
  
  static hash = (pass: string): string => {
    return bcr.hashSync(pass, bcr.genSaltSync(10));
  }
  static verify = (pass: string, hash: string): boolean => {
    return bcr.compareSync(pass, hash);
  }

}