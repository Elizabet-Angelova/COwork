import { Controller, Body, Post, Param, Delete, Header, ValidationPipe, UseGuards, ParseIntPipe, Put, Get } from "@nestjs/common";
import { OfficesService } from "src/Services/office.service";
import { Row } from "src/Entities/row.entity";

@Controller('office')
export class OfficeController {

    constructor(
        private readonly officeService: OfficesService,
    ) { }

    @Get()
    public async offices() {
        return await this.officeService.getAllOffices();
    }

    @Get('/avg')
    public async avg() {
        return await this.officeService.getOfficeAvg();
    }

    @Get('/capacity/:office')
    public async capacity(@Param('office') office: string) {
        return await this.officeService.getOfficeCapacity(office)
    }

    @Get('/rows')
    public async getRows(): Promise<Row[]> {
        return await this.officeService.allRows();
    }

    @Post('/create')
    public async plan(@Body() body) {
        return await this.officeService.createVirtualOffice(body);
    }

    @Get(':name')
    public async office(@Param('name') name) {
        return await this.officeService.getOfficeByName(name);
    }

    @Get('/offices/assign')
    public async assign() {
        return await this.officeService.assign();
    }

    @Get('/desks/available/:country')
    public async getAvailableDesks(@Param('country') country: string) {
        return await this.officeService.getAvailableDesks(country);
    }


    @Get('/report/full')
    public async getReport() {
        return await this.officeService.produceReport();
    }

}
