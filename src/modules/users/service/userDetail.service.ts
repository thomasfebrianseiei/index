// /* eslint-disable @typescript-eslint/no-unused-vars */
// import { Injectable, Inject, NotFoundException } from '@nestjs/common';
// import {User } from '../user.entity';
// import { USER_REPOSITORY } from '../../../core/constants';
// import { USER_DETAIL_REPOSITORY } from 'src/core/constants';
// import { UserDetail } from '../entity/userdetail.entity';
// import { EditContactDto, EditPersonalDataDto, UserDetailDto } from '../dto/userDetail.dto';
// import { DocumentTypeEnum, UserKycDto } from '../dto/userKyc.dto';

// @Injectable()
// export class UsersDetailService {
//   constructor(
//     @Inject(USER_DETAIL_REPOSITORY) private userDetailRepo: typeof UserDetail,
//     @Inject(USER_REPOSITORY) private userRepository: typeof User,
//     private awsStorageService: AwsStorageService,
//   ) {}

//   async create(payload: UserDetailDto) {
//     try {
//       const userDetail = await this.userDetailRepo.create(payload);
//       return userDetail;
//     } catch (err: any) {
//       throw err;
//     }
//   }

//   async changeProfileImage(file: Express.Multer.File, req: any) {
//     try {
//       let updatedUser;
//       const findUser = await this.userRepository.findByPk(req.user.id);

//       if (findUser) {
//         const findUserDetail = await this.userDetailRepo.findOne({
//           where: {
//             user_id: findUser.id,
//           },
//         });

//         if (findUserDetail) {
//           const payload = { ...findUserDetail };

//           const upload = await this.awsStorageService.uploadFile(file);
//           payload.profile_img = upload;

//           updatedUser = await this.userDetailRepo.update(payload, {
//             where: {
//               user_detail_id: findUserDetail.user_detail_id,
//             },
//             returning: true,
//           });
//         }

//         //remove image in aws storage
//         await this.awsStorageService.deleteFile(findUserDetail.profile_img)
//       }
//       return { message: 'Updated Success', data: updatedUser[1][0] };
//     } catch (err: any) {
//       throw err;
//     }
//   }

//   async uploadKycUser(file: Express.Multer.File, req: any, body: UserKycDto) {
//     try {
//       let updatedUser: UserDetail = null;
//       const findUser = await this.userRepository.findByPk(req.user.id);

//       if (findUser) {
//         const findUserDetail = await this.userDetailRepo.findOne({
//           where: {
//             user_id: findUser.id,
//           },
//         });

//         if (findUserDetail) {
//           const payload = { ...findUserDetail.dataValues };

//           const upload = await this.awsStorageService.uploadFile(file);

//           if (body.document_type === DocumentTypeEnum.id_card) {
//             payload.id_card_image = upload;
//             //remove image in aws storage
//             if(findUserDetail.id_card_image !== null) await this.awsStorageService.deleteFile(findUserDetail.id_card_image)
            
//           } else {
//             payload.selfie_img = upload;
//             //remove image in aws storage
//             if(findUserDetail.selfie_img !== null) await this.awsStorageService.deleteFile(findUserDetail.selfie_img)
//           }

//           const updateUser = await this.userDetailRepo.update(payload, {
//             where: {
//               user_detail_id: findUserDetail.user_detail_id,
//             },
//             returning: true,
//           });
//           updatedUser = updateUser[1][0];
//         }
//       }

//       if (
//         updatedUser.selfie_img !== null &&
//         updatedUser.id_card_image !== null
//       ) {
//         this.userRepository.update(
//           { ...findUser, kyc: KycStatus.PENDING },
//           {
//             where: { id: findUser.id },
//           },
//         );
//       }

//       return { message: 'Updated Success', data: updatedUser };
//     } catch (err: any) {
//       throw err;
//     }
//   }

//   async updatePersonalData(req: any, payload: EditPersonalDataDto) {
//     try {
//       const findUser = await this.userRepository.findByPk(req.user.id);
//       if (!findUser) {
//         throw new Error('User Tidak Ditemukan');
//       }

//       const findUserDetail = await this.userDetailRepo.findOne({
//         where: {
//           user_id: findUser.id,
//         },
//       });

//       if (!findUserDetail) {
//         throw new Error('User Detail Tidak Ditemukan');
//       }

//       if (payload.name) {
//         await this.userRepository.update(
//           { full_name: payload.name },
//           {
//             where: {
//               id: findUser.id,
//             },
//           },
//         );
//       }

//       const newPayload = {
//         dob: payload.dob ?? findUserDetail.dob,
//         place_of_birth: payload.place_of_birth ?? findUserDetail.place_of_birth,
//         gender: payload.gender ?? findUserDetail.gender,
//       };

//       const updatedUserDetail = await this.userDetailRepo.update(newPayload, {
//         where: { user_detail_id: findUserDetail.user_detail_id },
//         returning: true,
//       });

//       return { message: 'Updated Success', data: updatedUserDetail[1][0] };
//     } catch (err: any) {
//       throw err;
//     }
//   }

//   async updateContact(req: any, payload: EditContactDto) {
//     try {
//       const findUser = await this.userRepository.findByPk(req.user.id);
//       if (!findUser) {
//         throw new Error('User Tidak Ditemukan');
//       }

//       const newPayload = {
//         phone: payload.phone ?? findUser.phone,
//         email: payload.email ?? findUser.email
//       };

//       const updatedUser = await this.userRepository.update(newPayload, {
//         where: { id: findUser.id },
//         returning: true,
//       });
//       updatedUser[1][0].password = null

//       return { message: 'Updated Success', data: updatedUser[1][0] };
//     } catch (err: any) {
//       throw err;
//     }
//   }

//   async getPersonalData (req: any) {
//     try {
//       const findUser = await this.userRepository.findByPk(req.user.id, {
//         attributes: {exclude: ['password']}
//       });
//       if (!findUser) {
//         throw new NotFoundException('User Tidak Ditemukan');
//       }

//       const findUserDetail = await this.userDetailRepo.findOne({
//         where: {
//           user_id: findUser.id
//         }
//       })

//       const response = { ...findUser.dataValues, user_detail: findUserDetail.dataValues }

//       return {
//         message: "Success",
//         data: response
//       }

//     } catch (err: any) {
//       return err
//     }
//   }
// }
