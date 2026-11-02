export * from './company.service';
import { CompanyService } from './company.service';
export * from './companyStructure.service';
import { CompanyStructureService } from './companyStructure.service';
export const APIS = [CompanyService, CompanyStructureService];
