import { Injectable, NotFoundException } from "@nestjs/common";
import { Repository } from "typeorm";
import { User } from "src/Entities/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { UserDTO } from "src/DTOs/userDTO";
import { CreateUserDTO } from "src/DTOs/createUserDTO";
import * as bcrypt from 'bcryptjs';
import { responseMessage } from "src/Enums/response-message";
import { TransformerService } from "./transformer.service";
import { Project } from "src/Entities/project.entity";
import { Office } from "src/Entities/office.entity";
import { UserRole } from "src/Enums/user-role";




@Injectable()
export class UserService {

  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Project) private readonly projectRepository: Repository<Project>,
    @InjectRepository(Office) private readonly officeRepository: Repository<Office>,


    private readonly transformer: TransformerService,
  ) {
  }


  public async allUsers(): Promise<UserDTO[]> {
    return (await this.userRepository.find({
      where: { isDeleted: false, role: UserRole.Basic },
      relations: ['office', 'project']
    })).map(user => this.transformer.toUserDTO(user));
  }


  public async createUser(userInfo: CreateUserDTO): Promise<responseMessage> {
    const username = userInfo.username;
    const email = userInfo.email;
    const password = userInfo.password = await bcrypt.hash(userInfo.password, 10);
    const country = await this.officeRepository.findOne({ where: { country: userInfo.office } })
    const user = { ...new User, username, email, password, office: country, fullName: userInfo.fullName, worksFrom: userInfo.worksFrom }
    await this.userRepository.save(user)
    return responseMessage['3']
  }

  public async findUserById(id: number): Promise<UserDTO> {
    const foundUser = await this.userRepository.findOne({
      where: {
        id,
        isDeleted: false,
      },
      relations: ['office', 'project'],
    });
    if (foundUser === undefined || foundUser.isDeleted) {
      throw new NotFoundException('Invalid User ID');
    }
    return this.transformer.toUserDTO(foundUser);
  }


  public async findUserByName(searchString: string): Promise<UserDTO[]> {
    if (searchString) {
      const allUsers = await this.allUsers();
      const foundUsers: UserDTO[] = allUsers.filter(user => {
        if (user.fullName.toLowerCase().split(' ')[0].includes(searchString.toLowerCase())) {
          return true;
        } else if (!(user.fullName.toLowerCase().split(' ')[1].includes(searchString.toLowerCase())) && user.fullName.toLowerCase().includes(searchString.toLowerCase())) {
          return true;
        }
      })
      if (foundUsers) {
        return foundUsers.sort((a, b) => {
          let textA = a.fullName.indexOf(searchString.charAt(0).toUpperCase());
          let textB = b.fullName.indexOf(searchString.charAt(0).toUpperCase());;
          return (textA > textB) ? -1 : (textA < textB) ? 1 : 0;
        });;

      }
    } else {
      throw new NotFoundException('Invalid search parameter!');
    }

  }


  public async findUserByEmail(searchString: string): Promise<UserDTO[]> {
    if (searchString) {
      const allUsers = await this.allUsers();

      const foundUsers: UserDTO[] = allUsers.filter(user =>
        user.email.toLowerCase().includes(searchString.toLowerCase()))
      return foundUsers;
    } else {
      throw new NotFoundException('Invalid search parameter!');
    }

  }

  async findOneOrFail(userId: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('No such user!')
    }
    return user;
  }

  async userOffice(userId: number) {
    let user = await this.userRepository.findOne({ where: { id: userId, isDeleted: false }, relations: ['office'] })
    if (!user) {
      return 'No such user!'
    }
    if (!user.office.country) {
      return 'This user doesn\'t have an office'
    }
    return { country: user.office.country }
  }

  async deleteUser(userId: number) {
    const user = await this.userRepository.findOne({ where: { id: userId, isDeleted: false } });
    if (!user) {
      throw new Error('No such user!')
    } else {
      this.userRepository.save({ ...user, isDeleted: true })
    }
  }

}