import { Controller, Body, Post, Param, Delete, Header, ValidationPipe, UseGuards, ParseIntPipe, Put, Get } from "@nestjs/common";
import { CronService } from "src/Services/cron/cron.service";
import { Record } from "src/Entities/record.entity";
import { OfficesService } from "src/Services/office.service";


@Controller('records')
export class RecordController {

    constructor(
        private readonly recordService: CronService,
        private readonly officeService: OfficesService) { }


    @Get('/today')
    public async getDailyRecord() {
        return await this.recordService.getRecord();
    }

    @Get('/week')
    public async getAvgWeek(): Promise<Record[]> {
        return await this.officeService.getOfficeAvg();
    }


    @Get()
    public async getAll(): Promise<Record[]> {
        return await this.recordService.getAllRecords();
    }

    
    @Get('/compare/two')
    public async compareTwo(): Promise<Object[]> {
        return await this.recordService.compareTwo();
    }

    

}
