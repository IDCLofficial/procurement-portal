import { Injectable, HttpException, HttpStatus, Logger, NotFoundException, ConflictException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

// Interface for CAC company data
export interface CacCompanyData {
  classification_id: number;
  delisting_status: string | null;
  company_type_name: string | null;
  nature_of_business_name: string | null;
  id: number;
  active: boolean;
  business_commencement_date: string | null;
  registration_approved: boolean;
  approved_name: string;
  head_office_address: string;
  objectives: string;
  registration_date: string;
  classification: string;
  branch_address: string;
  email: string;
  rc_number: string;
  city: string;
  lga: string;
  address: string;
  state: string;
}

// Interface for API response
export interface CacLookupResponse {
  status: string;
  message: string;
  timestamp: string;
  data: CacCompanyData[];
}

// Interface for verification result
export interface CacVerificationResult {
  isValid: boolean;
  isActive: boolean;
  company: CacCompanyData | null;
  message: string;
}

@Injectable()
export class CacLookupService {
  private readonly logger = new Logger(CacLookupService.name);
  private readonly apiUrl = 'https://api.withmono.com/v3/lookup/cac';
  private readonly secretKey: string;

  constructor(private readonly configService: ConfigService) {
    this.secretKey = this.configService.get<string>('MONO_SECRET_KEY') || 'monoSecret';

    if (!this.secretKey) {
      this.logger.error('MONO_SECRET_KEY is not configured in environment variables');
      throw new Error('MONO_SECRET_KEY is required for CAC lookup service');
    }
  }

  /**
   * Check/Verify a company's CAC by RC number or company name
   * @param search - RC number (e.g., "RC200004") or company name
   * @returns CacVerificationResult with company details and validation status
   */
  async checkCac(search: string): Promise<CacVerificationResult> {
    try {
      this.logger.log(`Checking CAC for: ${search}`);

      // Validate input
      if (!search || search.trim().length === 0) {
        throw new HttpException(
          'Search parameter cannot be empty',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Build URL with query parameter
      const url = new URL(this.apiUrl);
      url.searchParams.append('search', search.trim());

      // Make API request using fetch
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'mono-sec-key': this.secretKey,
          'Content-Type': 'application/json',
        },
      });

      // Check if response is ok
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new HttpException(
          {
            success: false,
            message: 'CAC lookup failed',
            error: errorData.message || response.statusText,
            statusCode: response.status,
          },
          response.status,
        );
      }

      // Parse response
      const data: CacLookupResponse = await response.json();

      // Check if company was found
      if (!data.data || data.data.length === 0) {
        this.logger.warn(`No CAC record found for: ${search}`);
        throw new NotFoundException({
          success: false,
          message: 'No company found with the provided search term',
          statusCode: HttpStatus.NOT_FOUND,
        })
      }

      // Get the first result (most relevant match)
      const company = data.data[0];

      // Determine if company is valid and active
      const isValid = company.registration_approved === true;
      const isActive = company.active === true;

      this.logger.log(
        `CAC check successful for ${search} - Valid: ${isValid}, Active: ${isActive}`,
      );

      return {
        isValid,
        isActive,
        company,
        message: this.getStatusMessage(isValid, isActive),
      };
    } catch (error) {
      this.logger.error(`CAC check failed for: ${search}`, error.stack);

      // If it's already an HttpException, rethrow it
      if (error instanceof HttpException) {
        throw error;
      }

      // Handle fetch errors
      throw new HttpException(
        {
          success: false,
          message: 'CAC lookup service error',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Check if a CAC number is valid and active
   * Simplified method that returns boolean
   * @param cacNumber - RC number (e.g., "RC200004")
   * @returns true if valid and active, false otherwise
   */
  async isCacValid(cacNumber: string): Promise<boolean> {
    try {
      const result = await this.checkCac(cacNumber);
      return result.isValid && result.isActive;
    } catch (error) {
      this.logger.error(`CAC validation failed for: ${cacNumber}`, error.stack);
      throw new NotFoundException('CAC validation failed');
    }
  }

  /**
   * Verify if company name matches CAC records
   * @param cacNumber - RC number
   * @param companyName - Company name to verify
   * @returns true if names match, false otherwise
   */
  async verifyCompanyName(
    cacNumber: string,
    companyName: string,
  ): Promise<boolean> {
    try {
      const result = await this.checkCac(cacNumber);

      if (!result.isValid || !result.company) {
        return false;
      }

      const cacName = result.company.approved_name.toLowerCase().trim();
      const providedName = companyName.toLowerCase().trim();

      // Check for exact match or if one contains the other
      return (
        cacName === providedName ||
        cacName.includes(providedName) ||
        providedName.includes(cacName)
      );
    } catch (error) {
      this.logger.error(
        `Company name verification failed for CAC: ${cacNumber}`,
        error.stack,
      );
      return false;
    }
  }

  /**
   * Get detailed company information by CAC number
   * @param cacNumber - RC number
   * @returns Company details or null if not found
   */
  async getCompanyDetails(cacNumber: string): Promise<CacCompanyData | null> {
    try {
      const result = await this.checkCac(cacNumber);
      return result.company;
    } catch (error) {
      this.logger.error(
        `Failed to get company details for: ${cacNumber}`,
        error.stack,
      );
      throw new ConflictException('Failed to get company details');
    }
  }

  /**
   * Generate appropriate status message based on validation results
   */
  private getStatusMessage(isValid: boolean, isActive: boolean): string {
    if (isValid && isActive) {
      return 'Company is registered, approved, and active';
    }
    if (isValid && !isActive) {
      return 'Company is registered and approved but not active';
    }
    if (!isValid && isActive) {
      return 'Company is active but registration not approved';
    }
    return 'Company registration is not approved and not active';
  }
}