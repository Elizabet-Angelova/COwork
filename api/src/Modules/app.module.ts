import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Row } from 'src/Entities/row.entity';
import { Square } from 'src/Entities/square.entity';
import { Office } from 'src/Entities/office.entity';
import { OfficesService } from 'src/Services/office.service';
import { OfficeController } from '../Controllers/office.controller'
import { ScheduleModule } from '@nestjs/schedule';
import { CronService } from 'src/Services/cron/cron.service';
import { Record } from 'src/Entities/record.entity';
import { RecordController } from 'src/Controllers/record.controller';
import { UsersController } from 'src/Controllers/user.controller';
import { UserService } from 'src/Services/user.service';
import { User } from 'src/Entities/user.entity';
import { TransformerService } from 'src/Services/transformer.service';
import { Token } from 'src/Entities/token.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from 'src/Constant/secret';
import { AuthController } from 'src/Controllers/auth.controller';
import { AuthService } from 'src/services/authentication.service';
import {JwtStrategy} from 'src/Services/Strategy/jwt-strategy'
import { ProjectsController } from 'src/Controllers/project.controller';
import { ProjectService } from 'src/Services/project.service';
import { Project } from 'src/Entities/project.entity';
import { VacationController } from 'src/Controllers/vacation.controller';
import { VacationService } from 'src/Services/vacation.service';
import { Vacation } from 'src/Entities/vacation.entity';
import { AdminController } from '../Controllers/admin.controller'
import { AdminService } from 'src/Services/admin.service';

@Module({
  controllers: [ OfficeController, RecordController, UsersController, AuthController, ProjectsController, VacationController, AdminController],
  providers: [ OfficesService, CronService, UserService, TransformerService, AuthService, JwtStrategy, ProjectService, VacationService, AdminService],
  imports: [TypeOrmModule.forRoot({
    type: 'mariadb',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: '1234',
    database: 'coworkdb',
    entities: ['dist/**/*.entity{.ts,.js}'],
    synchronize: true
  }),
  TypeOrmModule.forFeature([Row, Square, Office, Record, User, Token, Project, Vacation]),
  PassportModule,
  JwtModule.register({
    secret: jwtConstants.secret,
    signOptions: {
      expiresIn: '7d',
    },
  }),
  ScheduleModule.forRoot()
  ],

})
export class AppModule {}
