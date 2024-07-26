import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  AllowNull,
  Default,
  BeforeBulkCreate
} from 'sequelize-typescript';

import { v4 as uuidv4 } from 'uuid';

import { User } from '../user.entity';

@Table({
  tableName: 'user_detail',
})
export class UserDetail extends Model<UserDetail> {

  @Column({
    type: DataType.UUID,
    allowNull: false,
    primaryKey: true,
    defaultValue: DataType.UUIDV4, // Sequelize will automatically generate a UUID for this field
  })
  id: string;

  @BeforeBulkCreate
  static generateUUID(instances: UserDetail[]) {
    instances.forEach((instance) => {
      if (!instance.id) {
        instance.id = uuidv4();
      }
    });
  }

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  user_id: string;
  @BelongsTo(() => User)
  user: User;

  @AllowNull(false)
  @Column({
    type: DataType.STRING,
    validate: { notEmpty: { msg: 'nama tidak boleh kosong' } }
  })
  name!: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING,
    validate: { notEmpty: { msg: 'tempat lahir tidak boleh kosong' } }
  })
  placeOfBirth!: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING,
    validate: { notEmpty: { msg: 'tanggal lahir tidak boleh kosong' } }
  })
  dateOfBirth!: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING,
    validate: { notEmpty: { msg: 'gender tidak boleh kosong' } }
  })
  gender!: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING,
    validate: { notEmpty: { msg: 'jalan tidak boleh kosong' } }
  })
  street!: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING,
    validate: { notEmpty: { msg: 'provinsi tidak boleh kosong' } }
  })
  provinces!: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING,
    validate: { notEmpty: { msg: 'kabupaten/kota tidak boleh kosong' } }
  })
  districtOrCity!: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING,
    validate: { notEmpty: { msg: 'code pos tidak boleh kosong' } }
  })
  zipcode!: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING,
    validate: { notEmpty: { msg: 'nomor identitas tidak boleh kosong' } }
  })
  id_number!: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING,
    validate: { notEmpty: { msg: 'tanggal kadaluarsa tidak boleh kosong' } }
  })
  id_ex!: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING,
    validate: { notEmpty: { msg: 'pekerjaan tidak boleh kosong' } }
  })
  job!: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING,
    validate: { notEmpty: { msg: 'nama keluarga tidak boleh kosong' } }
  })
  familyName!: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING,
    validate: { notEmpty: { msg: 'relasi tidak boleh kosong' } }
  })
  familyRelation!: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING,
    validate: { notEmpty: { msg: 'kontak darurat tidak boleh kosong' } }
  })
  familyNumber!: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING,
    validate: { notEmpty: { msg: 'negara tidak boleh kosong' } }
  })
  nation!: string;

  @Default(0)
  @Column(DataType.INTEGER)
  step!: number;

  @Default(false)
  @Column(DataType.BOOLEAN)
  isFinish!: boolean;

  @Default("")
  @Column(DataType.STRING)
  document_image!: string;

  @Default("")
  @Column(DataType.STRING)
  document_imageSelfieSide!: string;

  @Default("")
  @Column(DataType.STRING)
  typeid!: string;

  @Default(false)
  @Column(DataType.BOOLEAN)
  approved_status!: boolean;

  @Default(false)
  @Column(DataType.BOOLEAN)
  review!: boolean;

  @Default(true)
  @Column(DataType.BOOLEAN)
  lock_status!: boolean;
}

