import {Injectable} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Square } from 'src/Entities/square.entity';
import { Row } from 'src/Entities/row.entity';
import { Office } from 'src/Entities/office.entity';
import { User } from 'src/Entities/user.entity';
import { WorksFrom } from 'src/Enums/works-from';
import { Record } from 'src/Entities/record.entity';
import { Project } from 'src/Entities/project.entity';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CronService } from './cron/cron.service';


@Injectable()
export class OfficesService {
    public constructor(
        private readonly recordService: CronService,
        @InjectRepository(Square) private readonly squareRepository: Repository<Square>,
        @InjectRepository(Row) private readonly rowRepository: Repository<Row>,
        @InjectRepository(Office) private readonly officeRepository: Repository<Office>,
        @InjectRepository(Record) private readonly recordRepository: Repository<Record>,
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        @InjectRepository(Project) private readonly projectRepository: Repository<Project>,

    ) { }

    public async allSquares(): Promise<Square[]> {
        return await this.squareRepository.find({
            relations: ['row']
        })
    }

    public async allRows(): Promise<Row[]> {
        return await this.rowRepository.find({
            relations: ['desks']
        })
    }

    public async getOfficeByName(country): Promise<Office[]> {
        return await this.officeRepository.find({
            where: { country: country },
            relations: ['rows', 'rows.squares', 'rows.squares.user', 'users']
        })
    }

    public async getAllOffices(): Promise<Office[]> {
        return await this.officeRepository.find()
    }

    public async createVirtualOffice(body) {
        let rows = []
        let positions = body.positions
        let isDesk
        for (let i = 0; i < body.matrix.length; i++) {
            let newRow = {
                rowNumber: i + 1,
            }
            let thisRow = await this.rowRepository.save(newRow)
            rows.push(thisRow)

            for (let j = 0; j < body.matrix[i].length; j++) {
                if (positions.includes(body.matrix[i][j])) {
                    isDesk = true
                } else {
                    isDesk = false
                }
                let square = {
                    row: thisRow,
                    squareNumber: body.matrix[i][j],
                    isDesk: isDesk,
                }
                await this.squareRepository.save(square)
            }
        }
        let office = {
            country: body.country,
            rows: rows,
            desks: body.desks,
        }
        await this.officeRepository.save(office)
    }


    public async getOfficeAvg() {
        let weekRecords = await this.recordRepository.find()
        let index = 7
        if (weekRecords.length < 7) {
            index = weekRecords.length
        }
        weekRecords = weekRecords.reverse().slice(0, index)
        let data = weekRecords.map(record => JSON.parse(record.countries))
        let countries = Object.keys(data[0])
        let result = []
        let j
        for (let i = 0; i < countries.length; i++) {
            let sum = 0
            for (j = 0; j < 7; j++) {
                if (data[j][countries[i]]) {
                    sum += Number(data[j][countries[i]])
                } else {
                    sum += 0
                    break;
                }
            }
            let avg = (sum / j).toFixed(2)
            result.push({ country: countries[i], weeklyAverage: avg })
        }
        return result
    }

    public async getOfficeCapacity(country): Promise<number> {
        let office = await this.getOfficeByName(country)
        let totalEmployees = office[0].users.length
        let officeData = (await this.getOfficeAvg()).filter(data => data.country === country)[0]
        let rate = officeData.weeklyAverage
        if (rate > 10) {
            return +(totalEmployees / 2).toFixed(0)
        } else if (rate > 5 && rate < 10) {
            return +(totalEmployees * 0.75).toFixed(0)
        } else if (rate < 5) {
            return totalEmployees
        }

    }


    public async getAvailableDesks(country): Promise<number> {
        let office = await this.officeRepository.findOne({ where: { country: country }, relations: ['rows', 'rows.squares', 'rows.squares.user'] })
        let desks = []
        office.rows.map(row => row.squares.map(square => square.isDesk && desks.push(square)))
        let available = desks.filter(desk => !desk.forbidden && !desk.user)
        return available.length
    }

    public async getOccupiedDesks(country): Promise<number> {
        let office = await this.officeRepository.findOne({ where: { country: country }, relations: ['rows', 'rows.squares', 'rows.squares.user'] })
        let desks = []
        office.rows.map(row => row.squares.map(square => square.isDesk && desks.push(square)))
        let available = desks.filter(desk => !desk.forbidden && desk.user)
        return available.length
    }

    public async produceReport() {
        let reports = []
        let offices = await this.officeRepository.find({ relations: ['users'] })
        for (let i = 0; i < offices.length; i++) {
            let today = await this.recordService.getRecord()
            today = JSON.parse(today)[offices[i].country]
            let week = await this.getOfficeAvg()
            week = week.filter(record => record.country === offices[i].country)[0].weeklyAverage
            
            let available = await this.getAvailableDesks(offices[i].country)
            let occupied = await this.getOccupiedDesks(offices[i].country)

            let report = {
                country: offices[i].country,
                desks: offices[i].desks,
                employees: offices[i].users.length,
                todaysRate: today,
                weeklyRate: week,
                availableDesks: available,
                occupiedDesks: occupied,
            }
            reports.push(report)
        }
        return reports
    }

    
    @Cron('0 1 * * 6')
    public async assign() {
        console.log('called')
        const offices = await this.getAllOffices()
        for (let i = 0; i < offices.length; i++) {
            let country = offices[i]

            let users = await this.userRepository.find({ where: { office: country, isOnVacation: false }, relations: ['desk'] })

            for (let i = 0; i < users.length; i++) {
                await this.userRepository.save({ ...users[i], desk: null })
            }

            let officeArray = await this.getOfficeByName(country.country)
            let office = officeArray[0]
            let capacity = await this.getOfficeCapacity(country.country)
            let projects = await this.projectRepository.find({ where: { office: country }, relations: ['workers'] })

            let projectsToBeInOffice = projects.filter(project => project.worksFrom === WorksFrom.Home)
            let projectsToBeInHome = projects.filter(project => project.worksFrom === WorksFrom.Office)

            let usersToBeInOffice = []
            projectsToBeInOffice.map(project => usersToBeInOffice.push(...project.workers))

            let usersToBeInHome = []
            projectsToBeInHome.map(project => usersToBeInOffice.push(...project.workers))

            if (usersToBeInOffice.length > capacity) {
                usersToBeInOffice = usersToBeInOffice.slice(0, capacity)
            } else if (usersToBeInOffice.length < capacity) {
                let difference = usersToBeInOffice.length - capacity
                let usersToAdd = usersToBeInHome.slice(0, difference)
                usersToBeInOffice = [...usersToBeInOffice, ...usersToAdd]
            }

            let desks = []
            office.rows.map(row => {
                let rowArray = []
                row.squares.filter(square => {
                    return square.isDesk === true && rowArray.push(square)

                })
                if (rowArray.length > 0) {
                    desks.push(rowArray)
                }
            })

            for (let i = 0; i < desks.length; i++) {
                let row = desks[i]
                for (let j = 0; j < row.length; j++) {
                    if (i % 2 === 0) {
                        if (j % 2 === 0) {
                            await this.squareRepository.save({ ...row[j], forbidden: true })
                        } else {
                            await this.squareRepository.save({ ...row[j], forbidden: false })

                        }
                    } else if (i % 2 !== 0) {
                        if (j % 2 !== 0) {
                            await this.squareRepository.save({ ...row[j], forbidden: true })
                        } else {
                            await this.squareRepository.save({ ...row[j], forbidden: false })

                        }
                    }
                }

            }

            let allDesks = []
            for (let i = 0; i < desks.length; i++) {
                for (let j = 0; j < desks[i].length; j++) {
                    allDesks.push(desks[i][j])
                }
            }

            let dontSwitchUser = false
            let user
            for (let i = 0; i < allDesks.length; i++) {
                let desk = allDesks[i]
                if (!dontSwitchUser) {
                    i === 0 ? user = usersToBeInOffice[i] : user = usersToBeInOffice[(usersToBeInOffice.indexOf(user)) + 1]
                }
                if (user && desk.forbidden === false) {
                    await this.squareRepository.save({ ...desk, user: user })
                    dontSwitchUser = false
                } else if (user && desk.forbidden === true) {
                    dontSwitchUser = true
                } else if (!user) {
                    break;
                }

            }


            for (let i = 0; i < projectsToBeInHome.length; i++) {
                await this.projectRepository.save({ ...projectsToBeInHome[i], worksFrom: WorksFrom.Home })
            }

            for (let i = 0; i < projectsToBeInOffice.length; i++) {
                await this.projectRepository.save({ ...projectsToBeInOffice[i], worksFrom: WorksFrom.Office })
            }

        }
    }
}
