import { Contractor } from '@/components/ContractorTable';

// Extended contractor interface for detail pages
export interface ContractorDetail extends Contractor {
    tinNumber: string;
    category: string;
    address: string;
    phone: string;
    email: string;
    website: string;
    approvedSectors: string[];
}

// Mock data - in production, this would fetch from an API
const mockContractors: ContractorDetail[] = [
    // APPROVED CONTRACTORS
    {
        id: 'IMO-CONT-AA9A-20FFB6510267',
        name: 'ABC Construction Ltd',
        rcbnNumber: 'RC1234567',
        tinNumber: 'TIN-98765432',
        sector: 'WORKS',
        category: 'Building Construction',
        grade: 'A',
        lga: 'Owerri Municipal',
        status: 'approved',
        expiryDate: '31 December 2025',
        address: '123 Owerri Road, Owerri',
        phone: '+234 803 123 4567',
        email: 'info@abcconstruction.com',
        website: 'www.abcconstruction.com',
        approvedSectors: ['WORKS'],
    },
    {
        id: 'IMO-CONT-BCF8-A1226BF1184C',
        name: 'XYZ Supplies Nigeria',
        rcbnNumber: 'RC7654321',
        tinNumber: 'TIN-12345678',
        sector: 'SUPPLIES',
        category: 'General Supplies',
        grade: 'B',
        lga: 'Orlu',
        status: 'approved',
        expiryDate: '30 November 2025',
        address: '456 Orlu Road, Orlu',
        phone: '+234 805 234 5678',
        email: 'contact@xyzsupplies.com',
        website: 'www.xyzsupplies.com',
        approvedSectors: ['SUPPLIES'],
    },
    {
        id: 'IMO-CONT-BD3A-F2BAD442B539',
        name: 'Prime Services International',
        rcbnNumber: 'RC3456789',
        tinNumber: 'TIN-87654321',
        sector: 'SERVICES',
        category: 'Professional Services',
        grade: 'A',
        lga: 'Owerri North',
        status: 'approved',
        expiryDate: '15 October 2025',
        address: '789 Owerri North Road, Owerri',
        phone: '+234 807 345 6789',
        email: 'info@primeservices.com',
        website: 'www.primeservices.com',
        approvedSectors: ['SERVICES'],
    },
    {
        id: 'IMO-CONT-8264-B2C6C8B355E9',
        name: 'Elite Engineering Solutions',
        rcbnNumber: 'RC2468135',
        tinNumber: 'TIN-24681357',
        sector: 'WORKS',
        category: 'Civil Engineering',
        grade: 'A',
        lga: 'Owerri West',
        status: 'approved',
        expiryDate: '20 March 2026',
        address: '45 Wetheral Road, Owerri',
        phone: '+234 809 876 5432',
        email: 'contact@eliteeng.com',
        website: 'www.eliteengineering.com',
        approvedSectors: ['WORKS'],
    },
    {
        id: 'IMO-CONT-818D-B8D5706395BA',
        name: 'Global Tech Supplies Ltd',
        rcbnNumber: 'RC9876543',
        tinNumber: 'TIN-98765123',
        sector: 'SUPPLIES',
        category: 'ICT Equipment',
        grade: 'B',
        lga: 'Owerri Municipal',
        status: 'approved',
        expiryDate: '10 August 2025',
        address: '12 Douglas Road, Owerri',
        phone: '+234 806 543 2109',
        email: 'sales@globaltech.com',
        website: 'www.globaltechsupplies.com',
        approvedSectors: ['SUPPLIES'],
    },
    
    // PENDING CONTRACTORS
    {
        id: 'IMO-CONT-A237-48C8E0A64917',
        name: 'NewBuild Contractors',
        rcbnNumber: 'RC5555555',
        tinNumber: 'TIN-55555555',
        sector: 'WORKS',
        category: 'Building Construction',
        grade: 'C',
        lga: 'Mbaitoli',
        status: 'pending',
        expiryDate: '01 January 2026',
        address: '78 Ikenegbu Layout, Owerri',
        phone: '+234 813 456 7890',
        email: 'info@newbuild.com',
        website: 'www.newbuildcontractors.com',
        approvedSectors: ['WORKS'],
    },
    {
        id: 'IMO-CONT-B5B1-670518733D34',
        name: 'Fresh Supplies Co',
        rcbnNumber: 'RC6666666',
        tinNumber: 'TIN-66666666',
        sector: 'SUPPLIES',
        category: 'Office Supplies',
        grade: 'C',
        lga: 'Owerri North',
        status: 'pending',
        expiryDate: '15 February 2026',
        address: '23 Tetlow Road, Owerri',
        phone: '+234 814 567 8901',
        email: 'contact@freshsupplies.com',
        website: 'www.freshsupplies.ng',
        approvedSectors: ['SUPPLIES'],
    },
    {
        id: 'IMO-CONT-8EEB-3DBE9A02CF21',
        name: 'Innovative Services Hub',
        rcbnNumber: 'RC7777777',
        tinNumber: 'TIN-77777777',
        sector: 'SERVICES',
        category: 'Consulting Services',
        grade: 'B',
        lga: 'Owerri Municipal',
        status: 'pending',
        expiryDate: '05 April 2026',
        address: '56 Bank Road, Owerri',
        phone: '+234 815 678 9012',
        email: 'hello@innovativehub.com',
        website: 'www.innovativeservices.ng',
        approvedSectors: ['SERVICES'],
    },
    
    // SUSPENDED CONTRACTORS
    {
        id: 'IMO-CONT-AAD2-9884437BC2AE',
        name: 'Blacklisted Builders Ltd',
        rcbnNumber: 'RC8888888',
        tinNumber: 'TIN-88888888',
        sector: 'WORKS',
        category: 'Road Construction',
        grade: 'B',
        lga: 'Orlu',
        status: 'suspended',
        expiryDate: '30 June 2024',
        address: '90 Orlu Road, Orlu',
        phone: '+234 816 789 0123',
        email: 'info@blacklistedbuilders.com',
        website: 'www.blacklistedbuilders.com',
        approvedSectors: ['WORKS'],
    },
    {
        id: 'IMO-CONT-9A09-9DD0C14441F30',
        name: 'Dodgy Supplies Inc',
        rcbnNumber: 'RC9999999',
        tinNumber: 'TIN-99999999',
        sector: 'SUPPLIES',
        category: 'Medical Supplies',
        grade: 'C',
        lga: 'Owerri West',
        status: 'suspended',
        expiryDate: '15 May 2024',
        address: '34 Hospital Road, Owerri',
        phone: '+234 817 890 1234',
        email: 'contact@dodgysupplies.com',
        website: 'www.dodgysupplies.ng',
        approvedSectors: ['SUPPLIES'],
    },
    
    // MORE APPROVED WITH DIFFERENT GRADES
    {
        id: 'IMO-CONT-A1D8-37117C27BEA61',
        name: 'Premium Construction Group',
        rcbnNumber: 'RC1111111',
        tinNumber: 'TIN-11111111',
        sector: 'WORKS',
        category: 'Heavy Construction',
        grade: 'A',
        lga: 'Owerri Municipal',
        status: 'approved',
        expiryDate: '25 December 2025',
        address: '100 Aba Road, Owerri',
        phone: '+234 818 901 2345',
        email: 'info@premiumconstruction.com',
        website: 'www.premiumconstruction.ng',
        approvedSectors: ['WORKS'],
    },
    {
        id: 'IMO-CONT-94AC-E0B0C9A6C9EE2',
        name: 'Budget Builders',
        rcbnNumber: 'RC2222222',
        tinNumber: 'TIN-22222222',
        sector: 'WORKS',
        category: 'Residential Construction',
        grade: 'C',
        lga: 'Mbaitoli',
        status: 'approved',
        expiryDate: '18 September 2025',
        address: '67 New Owerri Road, Owerri',
        phone: '+234 819 012 3456',
        email: 'contact@budgetbuilders.com',
        website: 'www.budgetbuilders.ng',
        approvedSectors: ['WORKS'],
    },
    {
        id: 'IMO-CONT-B689-B303F6F63F423',
        name: 'Professional Consultants Ltd',
        rcbnNumber: 'RC3333333',
        tinNumber: 'TIN-33333333',
        sector: 'SERVICES',
        category: 'Management Consulting',
        grade: 'A',
        lga: 'Owerri North',
        status: 'approved',
        expiryDate: '30 November 2025',
        address: '88 Control Post, Owerri',
        phone: '+234 820 123 4567',
        email: 'info@proconsultants.com',
        website: 'www.professionalconsultants.ng',
        approvedSectors: ['SERVICES'],
    },
    {
        id: 'IMO-CONT-8254-4FB905EED7184',
        name: 'Mega Supplies Network',
        rcbnNumber: 'RC4444444',
        tinNumber: 'TIN-44444444',
        sector: 'SUPPLIES',
        category: 'Industrial Supplies',
        grade: 'A',
        lga: 'Orlu',
        status: 'approved',
        expiryDate: '12 July 2026',
        address: '45 Industrial Layout, Orlu',
        phone: '+234 821 234 5678',
        email: 'sales@megasupplies.com',
        website: 'www.megasuppliesnetwork.ng',
        approvedSectors: ['SUPPLIES'],
    },
    {
        id: 'IMO-CONT-9E9B-50001A6302BB5',
        name: 'Quick Fix Services',
        rcbnNumber: 'RC5544332',
        tinNumber: 'TIN-55443322',
        sector: 'SERVICES',
        category: 'Maintenance Services',
        grade: 'B',
        lga: 'Owerri West',
        status: 'approved',
        expiryDate: '22 October 2025',
        address: '29 Relief Market Road, Owerri',
        phone: '+234 822 345 6789',
        email: 'support@quickfix.com',
        website: 'www.quickfixservices.ng',
        approvedSectors: ['SERVICES'],
    },
];

/**
 * Fetch all contractors (Server-side)
 * In production, this would call an API endpoint
 */
export async function getContractors(): Promise<Contractor[]> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 100));
    
    // In production, replace with:
    // const response = await fetch('https://api.example.com/contractors', {
    //     next: { revalidate: 3600 } // Revalidate every hour
    // });
    // return response.json();
    
    return mockContractors;
}

/**
 * Fetch a single contractor by ID (Server-side)
 * In production, this would call an API endpoint
 */
export async function getContractorById(id: string): Promise<ContractorDetail | null> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 100));
    
    // In production, replace with:
    // const response = await fetch(`https://api.example.com/contractors/${id}`, {
    //     next: { revalidate: 3600 } // Revalidate every hour
    // });
    // if (!response.ok) return null;
    // return response.json();
    
    return mockContractors.find((c) => c.id === id) || null;
}

/**
 * Generate static params for all contractors (for static generation)
 * This enables static generation of all contractor detail pages at build time
 */
export async function getAllContractorIds(): Promise<string[]> {
    const contractors = await getContractors();
    return contractors.map((c) => c.id);
}
