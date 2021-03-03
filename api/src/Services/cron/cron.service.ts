import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Record } from 'src/Entities/record.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import fetch from 'node-fetch'
import { Office } from 'src/Entities/office.entity';


@Injectable()
export class CronService {

    public constructor(
        @InjectRepository(Record) private readonly recordRepository: Repository<Record>,
        @InjectRepository(Office) private readonly officeRepository: Repository<Office>,

    ) { }

    @Cron(CronExpression.EVERY_DAY_AT_2PM)
    async createRecord() {

        const offices = await this.officeRepository.find()
        const countries = offices.map(office => office.country)
        if (!countries) {
            return;
        }

        let newRecord = {
            date: new Date().toLocaleDateString(),
            globalCases: 0,
            countries: '',
        };

        let countriesToRecord = {}
        const promises = countries.map(country => {
            return fetch(` https://coronavirus-19-api.herokuapp.com/countries/${country}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
            })
        });

        try {
            const resolved = await Promise.all(promises);
            const finalArray = await Promise.all(resolved.map(result => result.json()));
            finalArray.forEach((result) => {
                const country = result.country;
                const percentage = ((result.casesPerOneMillion * 100) / result.testsPerOneMillion).toFixed(2)
                countriesToRecord = { ...countriesToRecord, [country]: percentage }
                newRecord = { ...newRecord, countries: JSON.stringify(countriesToRecord) }
            })
        } catch (error) {
            console.log(error)
        }

        try {
            const response = await fetch(` https://coronavirus-19-api.herokuapp.com/all`, {
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            const result = await response.json()
            newRecord = { ...newRecord, globalCases: result.cases }
        } catch (error) {
            console.log(error)
        }

        try {
            await this.recordRepository.save(newRecord)
        } catch (error) {
            console.log(error)
        }

    }

    public async getAllRecords(): Promise<Record[]> {
        return await this.recordRepository.find({})
    }

    public async getRecord() {
        const records = await this.recordRepository.find()
        return records[records.length-1].countries

    }

    // public async getLastWeekRecord(): Promise<Record[]> {
    //     const records = await (await this.recordRepository.find()).reverse()
    //     return records.slice(0, 7)
    // }

    // public async getDateRecord(date): Promise<Record> {
    //     const records = await this.recordRepository.find({ where: { date: date } })
    //     return records[0]
    // }

    public async compareTwo(): Promise<Object[]> {
        let records = await (await this.recordRepository.find()).reverse()
        if (records.length < 2){
            throw new Error('not enough records')
        }
        let twoDays = records.slice(0, 2)
        let data = twoDays.map(record => JSON.parse(record.countries))
        let countries = Object.keys(data[0])
        let response = []
        response.push({
            country: 'Global',
            dailyRate: twoDays[0].globalCases - twoDays[1].globalCases,
            total: twoDays[0].globalCases,
        })
        for (let i = 0; i < countries.length; i++) {
            response.push({
                country: countries[i],
                dailyRate: Number((data[0][countries[i]] - data[1][countries[i]]).toFixed(2)),
            })
        }
        return response
    }


}
