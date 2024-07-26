import {
  Table,
  Column,
  Model,
  DataType,
  BeforeBulkCreate,
  HasMany,
  HasOne,
  AutoIncrement,
  Unique,
} from 'sequelize-typescript';
import { EncryptionService } from 'src/core/constants/encryption.service';
import { v4 as uuidv4 } from 'uuid';
import { UserDetail } from './entity/userdetail.entity';

@Table({
  tableName: 'user',
})
export class User extends Model<User> {
  @Column({
    type: DataType.UUID,
    allowNull: false,
    primaryKey: true,
    defaultValue: DataType.UUIDV4, // Sequelize will automatically generate a UUID for this field
  })
  id: string;

  @HasOne(() => UserDetail, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    hooks: true,
  })
  user_detail: UserDetail;


  // Other model properties...

  @BeforeBulkCreate
  static generateUUID(instances: User[]) {
    instances.forEach((instance) => {
      if (!instance.id) {
        instance.id = uuidv4();
        instance.password = EncryptionService.hash(instance.password);
      }
    });
  }

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  username: string;

  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  email: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  password: string;

  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: true,
  })
  phone: string;

  // Add boolean validation column
  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
    defaultValue: false,
  })
  is_valid: boolean;
}
