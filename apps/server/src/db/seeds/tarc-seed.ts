/**
 * @file apps/server/src/db/seeds/tarc-seed.ts
 * @description Comprehensive deterministic database seeder for TARC.
 * Seeds ALL 13 tables with realistic agricultural research data.
 */

import bcrypt from 'bcryptjs';
import { db, poolConnection } from '../client.js';
import {
  events,
  contactMessages,
  departments,
  galleryMedia,
  news,
  publicationAuthors,
  publications,
  researchPrograms,
  researchProjects,
  staff,
  systemSettings,
  users,
  vacancies,
  vehicleAssignments,
  vehicles,
} from '../schema/index.js';

export async function seedDatabase() {
  console.log('🌱 Starting TARCMS comprehensive database seeding...');

  try {
    const adminHash = await bcrypt.hash('admin123456', 10);
    const researcherHash = await bcrypt.hash('researcher123456', 10);
    const staffHash = await bcrypt.hash('staff123456', 10);

    // 0. Clean tables in reverse dependency order
    console.log('  -> Clearing previous seed data...');
    await db.delete(vehicleAssignments);
    await db.delete(vehicles);
    await db.delete(contactMessages);
    await db.delete(galleryMedia);
    await db.delete(vacancies);
    await db.delete(news);
    await db.delete(events);
    await db.delete(publicationAuthors);
    await db.delete(publications);
    await db.delete(researchProjects);
    await db.delete(researchPrograms);
    await db.delete(staff);
    await db.delete(departments);
    await db.delete(users);
    await db.delete(systemSettings);

    // 1. System Settings
    console.log('  -> Seeding System Settings...');
    await db
      .insert(systemSettings)
      .values({
        id: 'primary',
        institutionName: 'Tepi Agricultural Research Center (EIAR)',
        tagline: 'Center of Excellence for Spices, Coffee, Cacao & Sustainable Agriculture',
        aboutText:
          'Tepi Agricultural Research Center (TARC), established under the Ethiopian Institute of Agricultural Research (EIAR), serves as the national lead center for spice and cacao research and development in Ethiopia, alongside advancing Arabica coffee productivity, horticulture, livestock, and sustainable agroforestry in the Sheka Biosphere zone of Southwest Ethiopia.',
        missionText:
          'To generate and disseminate demand-driven, climate-smart agricultural technologies in spices, coffee, cacao, livestock, and horticultural crops that enhance national food security, agro-industrial raw material supply, and foreign exchange earnings.',
        visionText:
          'To see technologically transformed, highly competitive, and climate-resilient farming communities in Southwest Ethiopia by 2035, fully integrated into national and global agricultural value chains.',
        directorName: 'Dr. Dereje Tulu',
        directorTitle: 'Center Director & Senior Researcher (EIAR)',
        directorPhotoUrl: '/images/director-dereje.jpg',
        directorMessage:
          '<p>It is my distinct privilege to welcome you to the official management and discovery portal of the Tepi Agricultural Research Center (TARC), an operating center of the Ethiopian Institute of Agricultural Research (EIAR).</p><p>Situated in the lush agroecological heart of Southwest Ethiopia, TARC holds the national mandate for spearheading research on spices, including Korarima, Black Pepper, Ginger, Turmeric, and Vanilla, as well as the national cacao research and development program. We also drive vital research in Arabica coffee productivity, tropical horticulture, livestock disease epidemiology, soil health, and farm mechanization.</p><p>Through close partnerships with farmers, agricultural extension workers, universities, and international research organizations, our dedicated scientific staff works tirelessly to develop climate-resilient varieties and sustainable management practices. We invite you to explore our publications, research programs, and innovations as we contribute to Ethiopia’s agricultural transformation.</p>',
        officialEmail: 'tepiagriculturalresearchcenter@eiar.gov.et',
        officialPhone: '092 065 4572',
        physicalAddress: 'Tepi, Yeki Woreda, Sheka Zone, Southwest Ethiopia Regional State',
        gpsCoordinates: '7.1997° N, 35.4244° E',
        socialLinks: {
          telegram: 'https://t.me/tarc_ethiopia',
          facebook: 'https://facebook.com/tepiaresearch',
          eiar: 'http://eiar.gov.et/',
        },
      })
      .onDuplicateKeyUpdate({
        set: {
          institutionName: 'Tepi Agricultural Research Center (EIAR)',
          directorName: 'Dr. Dereje Tulu',
          directorTitle: 'Center Director & Senior Researcher (EIAR)',
          directorPhotoUrl: '/images/director-dereje.jpg',
          officialEmail: 'tepiagriculturalresearchcenter@eiar.gov.et',
          officialPhone: '092 065 4572',
        },
      });

    // 2. Users (5)
    console.log('  -> Seeding Users...');
    const userIds = {
      superAdmin: 'u0000000-0000-0000-0000-000000000001',
      admin: 'u0000000-0000-0000-0000-000000000002',
      researcher1: 'u0000000-0000-0000-0000-000000000003',
      researcher2: 'u0000000-0000-0000-0000-000000000004',
      staff1: 'u0000000-0000-0000-0000-000000000005',
    };

    await db
      .insert(users)
      .values([
        {
          id: userIds.superAdmin,
          name: 'Dr. Dereje Tulu',
          email: 'admin@tarc.gov.et',
          passwordHash: adminHash,
          role: 'SUPER_ADMIN',
          phone: '092 065 4572',
          isActive: true,
        },
        {
          id: userIds.admin,
          name: 'Alemwork Kebede',
          email: 'alemwork@tarc.gov.et',
          passwordHash: adminHash,
          role: 'ADMIN',
          phone: '+251 91 234 5678',
          isActive: true,
        },
        {
          id: userIds.researcher1,
          name: 'Abebe Tadesse',
          email: 'abebe.tadesse@tarc.gov.et',
          passwordHash: researcherHash,
          role: 'RESEARCHER',
          phone: '+251 92 234 5678',
          isActive: true,
        },
        {
          id: userIds.researcher2,
          name: 'Dr. Tigist Hailu',
          email: 'tigist.hailu@tarc.gov.et',
          passwordHash: researcherHash,
          role: 'RESEARCHER',
          phone: '+251 93 345 6789',
          isActive: true,
        },
        {
          id: userIds.staff1,
          name: 'Mulugeta Assefa',
          email: 'mulugeta@tarc.gov.et',
          passwordHash: staffHash,
          role: 'STAFF',
          phone: '+251 94 456 7890',
          isActive: true,
        },
      ])
      .onDuplicateKeyUpdate({
        set: {
          name: 'Dr. Dereje Tulu',
          passwordHash: adminHash,
          role: 'SUPER_ADMIN',
          phone: '092 065 4572',
          isActive: true,
        },
      });

    // 3. Departments / Bureaus (14 official structures under EIAR)
    console.log('  -> Seeding Departments (14 Bureaus/Structures)...');
    const deptIds = {
      spice: 'd0000000-0000-0000-0000-000000000001',
      coffee: 'd0000000-0000-0000-0000-000000000002',
      cacao: 'd0000000-0000-0000-0000-000000000003',
      fieldCrops: 'd0000000-0000-0000-0000-000000000004',
      horticulture: 'd0000000-0000-0000-0000-000000000005',
      protection: 'd0000000-0000-0000-0000-000000000006',
      soil: 'd0000000-0000-0000-0000-000000000007',
      livestock: 'd0000000-0000-0000-0000-000000000008',
      biotech: 'd0000000-0000-0000-0000-000000000009',
      mechanization: 'd0000000-0000-0000-0000-000000000010',
      economics: 'd0000000-0000-0000-0000-000000000011',
      extension: 'd0000000-0000-0000-0000-000000000012',
      foodScience: 'd0000000-0000-0000-0000-000000000013',
      administration: 'd0000000-0000-0000-0000-000000000014',
    };

    await db
      .insert(departments)
      .values([
        {
          id: deptIds.spice,
          name: 'Spices & Essential Oils Research Directorate',
          code: 'DEPT-SPICE',
          description:
            'National excellence and coordinating center for Korarima (large cardamom), black pepper, ginger, turmeric, vanilla, and essential oil crop breeding, agronomy, and post-harvest technology.',
          establishedYear: 1998,
          sortOrder: 1,
        },
        {
          id: deptIds.coffee,
          name: 'Coffee & Beverage Crops Research Directorate',
          code: 'DEPT-COFFEE',
          description:
            'Dedicated to Arabica coffee genetic improvement, agroforestry canopy shade management, cup quality profiling, and processing technology in the Sheka coffee belt.',
          establishedYear: 2000,
          sortOrder: 2,
        },
        {
          id: deptIds.cacao,
          name: 'Cacao & High-Value Crops Research Program',
          code: 'DEPT-CACAO',
          description:
            'Leading the national cacao research and development program to establish and scale high-quality cocoa bean production as a high-value commercial export crop in humid lowland Ethiopia.',
          establishedYear: 2012,
          sortOrder: 3,
        },
        {
          id: deptIds.fieldCrops,
          name: 'Field Crops Research Division',
          code: 'DEPT-FIELD',
          description:
            'Adaptability screening, breeding, and agronomic optimization of cereals (maize, rice), pulses (soybean, haricot bean), and oilseeds for humid lowland and mid-altitude ecologies.',
          establishedYear: 2002,
          sortOrder: 4,
        },
        {
          id: deptIds.horticulture,
          name: 'Horticulture & Tropical Fruit Crops Research Division',
          code: 'DEPT-HORT',
          description:
            'Tropical and subtropical fruit crops (banana, mango, papaya, citrus, avocado) and indigenous vegetable variety development and multiplication.',
          establishedYear: 2004,
          sortOrder: 5,
        },
        {
          id: deptIds.protection,
          name: 'Crop Protection & Plant Pathology Directorate',
          code: 'DEPT-PROT',
          description:
            'Diagnostic identification, entomology, and integrated disease management for coffee berry disease, ginger bacterial wilt, turmeric leaf spot, and insect pests.',
          establishedYear: 2002,
          sortOrder: 6,
        },
        {
          id: deptIds.soil,
          name: 'Soil, Water & Natural Resources Management Directorate',
          code: 'DEPT-SOIL',
          description:
            'Soil fertility mapping, acid soil amelioration, organic composting, agroforestry canopy conservation, and integrated watershed management.',
          establishedYear: 2005,
          sortOrder: 7,
        },
        {
          id: deptIds.livestock,
          name: 'Livestock & Animal Health Research Directorate',
          code: 'DEPT-LIVE',
          description:
            'Veterinary epidemiology, disease surveillance (brucellosis, trypanosomiasis), dairy and beef cattle breed improvement, forage agronomy, and apiculture/honeybee research.',
          establishedYear: 2008,
          sortOrder: 8,
        },
        {
          id: deptIds.biotech,
          name: 'Agricultural Biotechnology Research Directorate',
          code: 'DEPT-BIOTECH',
          description:
            'Tissue culture micropropagation for disease-free ginger and banana planting material, molecular characterization, and germplasm conservation.',
          establishedYear: 2015,
          sortOrder: 9,
        },
        {
          id: deptIds.mechanization,
          name: 'Agricultural Mechanization & Rural Energy Engineering',
          code: 'DEPT-MECH',
          description:
            'Design, evaluation, and adaptation of farm machinery, spice drying solar tunnels, coffee pulping equipment, and smallholder harvesting tools.',
          establishedYear: 2016,
          sortOrder: 10,
        },
        {
          id: deptIds.economics,
          name: 'Agricultural Economics & Policy Research Directorate',
          code: 'DEPT-ECON',
          description:
            'Socioeconomic impact assessments, production economics, market linkage studies, value chain mapping, and agricultural policy analysis.',
          establishedYear: 2006,
          sortOrder: 11,
        },
        {
          id: deptIds.extension,
          name: 'Agricultural Extension & Technology Multiplication',
          code: 'DEPT-EXT',
          description:
            'Demand-driven technology transfer, farmer field schools, pre-extension demonstration trials, and certified spice/coffee seedling multiplication.',
          establishedYear: 2006,
          sortOrder: 12,
        },
        {
          id: deptIds.foodScience,
          name: 'Food Science & Post-Harvest Nutrition Directorate',
          code: 'DEPT-FOOD',
          description:
            'Post-harvest preservation, food quality standards, sensory evaluation, essential oil chemical profiling, and nutritional product development.',
          establishedYear: 2018,
          sortOrder: 13,
        },
        {
          id: deptIds.administration,
          name: 'Center Administration, Operations & Facility Directorate',
          code: 'DEPT-ADMIN',
          description:
            'Human resource administration, financial management, research station infrastructure, transport fleet operations, and procurement management.',
          establishedYear: 1998,
          sortOrder: 14,
        },
      ])
      .onDuplicateKeyUpdate({ set: { sortOrder: 1 } });

    // 4. Staff
    console.log('  -> Seeding Staff...');
    const staffIds = {
      director: 's0000000-0000-0000-0000-000000000001',
      spiceLead: 's0000000-0000-0000-0000-000000000002',
      coffeeLead: 's0000000-0000-0000-0000-000000000003',
      protectionLead: 's0000000-0000-0000-0000-000000000004',
      soilLead: 's0000000-0000-0000-0000-000000000005',
      extensionLead: 's0000000-0000-0000-0000-000000000006',
      researcher1: 's0000000-0000-0000-0000-000000000007',
      researcher2: 's0000000-0000-0000-0000-000000000008',
      livestockLead: 's0000000-0000-0000-0000-000000000009',
      cacaoLead: 's0000000-0000-0000-0000-000000000010',
    };

    await db
      .insert(staff)
      .values([
        {
          id: staffIds.director,
          userId: userIds.superAdmin,
          departmentId: deptIds.livestock,
          firstName: 'Dereje',
          lastName: 'Tulu',
          position: 'Center Director & Senior Researcher',
          email: 'tepiagriculturalresearchcenter@eiar.gov.et',
          phone: '092 065 4572',
          areasOfExpertise: [
            'Veterinary Epidemiology',
            'Animal Health & Production',
            'Livestock Research Coordination',
            'Agricultural Research Center Leadership',
          ],
          bio: 'Dr. Dereje Tulu (DVM, MSc) is the Center Director of Tepi Agricultural Research Center (TARC) under the Ethiopian Institute of Agricultural Research (EIAR). With extensive experience in veterinary epidemiology, livestock research coordination, and center management, he oversees TARC’s national spice and cacao mandates and comprehensive multi-disciplinary research programs.',
          isActive: true,
          isFeatured: true,
          sortOrder: 1,
        },
        {
          id: staffIds.spiceLead,
          userId: userIds.researcher1,
          departmentId: deptIds.spice,
          firstName: 'Abebe',
          lastName: 'Tadesse',
          position: 'Lead Spice Breeder',
          email: 'abebe.tadesse@tarc.gov.et',
          phone: '+251 92 234 5678',
          areasOfExpertise: [
            'Black Pepper Selection',
            'Ginger Micropropagation',
            'Essential Oil Extraction',
          ],
          bio: 'M.Sc. in Plant Genetics from Jimma University, specializing in clonal selection of Southwest Ethiopian wild cardamom populations.',
          isActive: true,
          isFeatured: true,
          sortOrder: 2,
        },
        {
          id: staffIds.coffeeLead,
          userId: userIds.researcher2,
          departmentId: deptIds.coffee,
          firstName: 'Tigist',
          lastName: 'Hailu',
          position: 'Senior Coffee Quality Specialist',
          email: 'tigist.hailu@tarc.gov.et',
          phone: '+251 93 345 6789',
          areasOfExpertise: ['Coffee Cup Quality', 'Fermentation Physiology', 'CBD Resistance'],
          bio: 'Ph.D. in Food Science & Sensory Profiling, coordinating specialty highland coffee evaluation across Sheka and Keffa zones.',
          isActive: true,
          isFeatured: true,
          sortOrder: 3,
        },
        {
          id: staffIds.protectionLead,
          departmentId: deptIds.protection,
          firstName: 'Dawit',
          lastName: 'Mengistu',
          position: 'Plant Pathologist',
          email: 'dawit.mengistu@tarc.gov.et',
          phone: '+251 94 567 8901',
          areasOfExpertise: ['Coffee Berry Disease', 'Ginger Bacterial Wilt', 'IPM'],
          bio: 'Specializes in integrated disease management for coffee and spice crops in humid tropical environments.',
          isActive: true,
          isFeatured: false,
          sortOrder: 4,
        },
        {
          id: staffIds.soilLead,
          departmentId: deptIds.soil,
          firstName: 'Fatima',
          lastName: 'Yusuf',
          position: 'Soil Scientist',
          email: 'fatima.yusuf@tarc.gov.et',
          phone: '+251 95 678 9012',
          areasOfExpertise: ['Soil Fertility', 'Organic Composting', 'Agroforestry'],
          bio: 'Conducts soil health assessments and develops organic nutrient management protocols for spice and coffee production systems.',
          isActive: true,
          isFeatured: false,
          sortOrder: 5,
        },
        {
          id: staffIds.extensionLead,
          departmentId: deptIds.extension,
          firstName: 'Kassahun',
          lastName: 'Alemayehu',
          position: 'Agricultural Economist',
          email: 'kassahun.alemayehu@tarc.gov.et',
          phone: '+251 96 789 0123',
          areasOfExpertise: ['Market Linkages', 'Gender Analysis', 'Technology Adoption'],
          bio: 'Leads farmer extension programs and evaluates adoption rates of improved spice and coffee technologies across Sheka Zone.',
          isActive: true,
          isFeatured: false,
          sortOrder: 6,
        },
        {
          id: staffIds.researcher1,
          departmentId: deptIds.spice,
          firstName: 'Hana',
          lastName: 'Girma',
          position: 'Junior Researcher',
          email: 'hana.girma@tarc.gov.et',
          phone: '+251 97 890 1234',
          areasOfExpertise: ['Turmeric Varieties', 'Post-Harvest Processing'],
          bio: 'B.Sc. in Horticulture, supporting spice variety trials and post-harvest quality assessment at TARC.',
          isActive: true,
          isFeatured: false,
          sortOrder: 7,
        },
        {
          id: staffIds.researcher2,
          departmentId: deptIds.coffee,
          firstName: 'Yonas',
          lastName: 'Bekele',
          position: 'Coffee Research Associate',
          email: 'yonas.bekele@tarc.gov.et',
          phone: '+251 98 901 2345',
          areasOfExpertise: ['Coffee Processing', 'Shade Tree Management'],
          bio: 'Supports coffee sensory evaluation and agroforestry shade canopy research at Tepi station.',
          isActive: true,
          isFeatured: false,
          sortOrder: 8,
        },
        {
          id: staffIds.livestockLead,
          departmentId: deptIds.livestock,
          firstName: 'Dr. Dereje',
          lastName: 'Tulu',
          position: 'Lead Livestock & Veterinary Epidemiologist',
          email: 'tepiagriculturalresearchcenter@eiar.gov.et',
          phone: '092 065 4572',
          areasOfExpertise: ['Veterinary Epidemiology', 'Animal Brucellosis', 'Dairy Breed Improvement'],
          bio: 'Coordinates regional livestock disease surveillance, dairy/beef cattle adaptation trials, and apiculture research.',
          isActive: true,
          isFeatured: true,
          sortOrder: 9,
        },
        {
          id: staffIds.cacaoLead,
          departmentId: deptIds.cacao,
          firstName: 'Solomon',
          lastName: 'Worku',
          position: 'Lead Cacao Agronomist',
          email: 'solomon.worku@tarc.gov.et',
          phone: '+251 91 345 6789',
          areasOfExpertise: ['Cacao Agronomy', 'Fermentation Technology', 'Germplasm Introduction'],
          bio: 'Coordinates the national cacao introduction, adaptation, and seedling distribution program for Southwest Ethiopian lowlands.',
          isActive: true,
          isFeatured: true,
          sortOrder: 10,
        },
      ])
      .onDuplicateKeyUpdate({ set: { isActive: true } });

    // 5. Research Programs
    console.log('  -> Seeding Research Programs...');
    const programIds = {
      spice: 'p0000000-0000-0000-0000-000000000001',
      coffee: 'p0000000-0000-0000-0000-000000000002',
      protection: 'p0000000-0000-0000-0000-000000000003',
      soil: 'p0000000-0000-0000-0000-000000000004',
      cacao: 'p0000000-0000-0000-0000-000000000005',
      livestock: 'p0000000-0000-0000-0000-000000000006',
    };

    await db
      .insert(researchPrograms)
      .values([
        {
          id: programIds.spice,
          departmentId: deptIds.spice,
          leadStaffId: staffIds.spiceLead,
          title: 'National Spice Improvement & Quality Enhancement Program',
          slug: 'national-spice-improvement-program',
          code: 'PROG-SPICE-NAT',
          description:
            'Focused on germplasm collection, high-yield variety release, clean planting material multiplication, and post-harvest drying standards for Korarima, Ginger, and Turmeric.',
          objectives: [
            'Release 2 high oleoresin turmeric varieties by 2027',
            'Develop bacterial wilt management protocols for ginger',
            'Standardize solar drying methods for Ethiopian Korarima capsules',
          ],
          status: 'ACTIVE',
          sortOrder: 1,
        },
        {
          id: programIds.coffee,
          departmentId: deptIds.coffee,
          leadStaffId: staffIds.coffeeLead,
          title: 'Southwest Agroforestry & Specialty Coffee Program',
          slug: 'southwest-agroforestry-specialty-coffee',
          code: 'PROG-COFFEE-SW',
          description:
            'Optimizing shade tree architecture and microclimate regulation to enhance Arabica cup complexity and mitigate climate change stress in Tepi and Sheka.',
          objectives: [
            'Profile sensory attributes of forest Arabica accessions',
            'Quantify carbon sequestration in shaded coffee production systems',
          ],
          status: 'ACTIVE',
          sortOrder: 2,
        },
        {
          id: programIds.cacao,
          departmentId: deptIds.cacao,
          leadStaffId: staffIds.cacaoLead,
          title: 'National Cacao Research & Development Program',
          slug: 'national-cacao-research-development',
          code: 'PROG-CACAO-NAT',
          description:
            'National mandate program establishing cacao as a major commercial high-value export crop in Ethiopia through elite clone introduction, fermentation protocols, and seedling propagation.',
          objectives: [
            'Evaluate 12 imported elite cacao clones for pod yield and butter fat content',
            'Distribute 250,000 grafted cacao seedlings to smallholder outgrowers',
            'Establish standardized central solar fermentation and drying facilities in Tepi',
          ],
          status: 'ACTIVE',
          sortOrder: 3,
        },
        {
          id: programIds.livestock,
          departmentId: deptIds.livestock,
          leadStaffId: staffIds.livestockLead,
          title: 'Livestock Health, Epidemiology & Apiculture Program',
          slug: 'livestock-health-epidemiology-apiculture',
          code: 'PROG-LIVE-EPI',
          description:
            'Surveillance and control of infectious zoonotic diseases, evaluation of dairy crossbreeds in humid tropics, and modern hive apiculture in Sheka forest biosphere.',
          objectives: [
            'Investigate epidemiological prevalence of bovine brucellosis and trypanosomiasis',
            'Evaluate adapted dairy cattle crosses under humid lowland grazing systems',
            'Improve forest honey quality and royal jelly production using transitional hives',
          ],
          status: 'ACTIVE',
          sortOrder: 4,
        },
        {
          id: programIds.protection,
          departmentId: deptIds.protection,
          leadStaffId: staffIds.protectionLead,
          title: 'Integrated Crop Protection for Spice & Coffee Systems',
          slug: 'integrated-crop-protection-spice-coffee',
          code: 'PROG-PROT-INT',
          description:
            'Developing biological control agents, resistant varieties, and IPM packages for major diseases and pests affecting spice and coffee crops.',
          objectives: [
            'Identify biocontrol agents for coffee berry disease',
            'Develop ginger bacterial wilt resistant lines',
          ],
          status: 'ACTIVE',
          sortOrder: 5,
        },
        {
          id: programIds.soil,
          departmentId: deptIds.soil,
          leadStaffId: staffIds.soilLead,
          title: 'Sustainable Soil Health & Agroforestry Program',
          slug: 'sustainable-soil-health-agroforestry',
          code: 'PROG-SOIL-SUS',
          description:
            'Building soil organic matter, nutrient cycling, and canopy conservation for long-term productivity of spice-coffee agroforestry systems.',
          objectives: [
            'Map soil fertility across 5 kebeles in Yeki Woreda',
            'Promote organic composting among smallholder farmers',
          ],
          status: 'ACTIVE',
          sortOrder: 6,
        },
      ])
      .onDuplicateKeyUpdate({ set: { status: 'ACTIVE' } });

    // 6. Research Projects (6)
    console.log('  -> Seeding Research Projects...');
    const projectIds = {
      korarima: 'pr000000-0000-0000-0000-000000000001',
      coffeeShade: 'pr000000-0000-0000-0000-000000000002',
      gingerWilt: 'pr000000-0000-0000-0000-000000000003',
      turmeric: 'pr000000-0000-0000-0000-000000000004',
      cbdBiocontrol: 'pr000000-0000-0000-0000-000000000005',
      soilMapping: 'pr000000-0000-0000-0000-000000000006',
    };

    await db
      .insert(researchProjects)
      .values([
        {
          id: projectIds.korarima,
          programId: programIds.spice,
          departmentId: deptIds.spice,
          leadResearcherId: staffIds.spiceLead,
          title: 'Adaptability and Capsule Yield Performance of Elite Korarima Clones in Sheka',
          slug: 'adaptability-capsule-yield-korarima-clones-sheka',
          code: 'PRJ-KOR-2026-01',
          summary:
            'Multi-location field trials evaluating 8 selected Korarima clones for resistance to root rot and capsule yield under natural forest canopy.',
          objectives: [
            'Evaluate capsule dry weight per clump across 3 altitude gradients',
            'Determine essential oil content of sun-dried versus shade-dried seeds',
          ],
          startDate: new Date('2024-01-15'),
          endDate: new Date('2026-12-30'),
          status: 'ONGOING',
          fundingSource: 'Ethiopian Institute of Agricultural Research (EIAR)',
          budget: '450000.00',
        },
        {
          id: projectIds.coffeeShade,
          programId: programIds.coffee,
          departmentId: deptIds.coffee,
          leadResearcherId: staffIds.coffeeLead,
          title: 'Influence of Shade Canopy on Coffee Cup Quality in Tepi',
          slug: 'shade-canopy-influence-coffee-cup-quality-tepi',
          code: 'PRJ-COF-2026-02',
          summary:
            'Investigating bean density, biochemical acidity, and cup scores of Arabica coffee grown under contrasting indigenous shade tree species.',
          objectives: [
            'Analyze sensory cup scores by certified Q-graders',
            'Measure photosynthetically active radiation under tree canopies',
          ],
          startDate: new Date('2023-06-01'),
          endDate: new Date('2026-05-31'),
          status: 'ONGOING',
          fundingSource: 'Bioversity International & EIAR',
          budget: '620000.00',
        },
        {
          id: projectIds.gingerWilt,
          programId: programIds.protection,
          departmentId: deptIds.protection,
          leadResearcherId: staffIds.protectionLead,
          title: 'Screening Ginger Germplasm for Bacterial Wilt Resistance',
          slug: 'screening-ginger-germplasm-bacterial-wilt-resistance',
          code: 'PRJ-GIN-2025-03',
          summary:
            'Evaluating 15 ginger accessions for resistance to Ralstonia solanacearum under controlled greenhouse and field conditions.',
          objectives: [
            'Identify resistant genotypes from Ethiopian and exotic collections',
            'Develop molecular markers for wilt resistance screening',
          ],
          startDate: new Date('2023-09-01'),
          endDate: new Date('2025-12-31'),
          status: 'ONGOING',
          fundingSource: 'National Plant Genetic Resources Center',
          budget: '280000.00',
        },
        {
          id: projectIds.turmeric,
          programId: programIds.spice,
          departmentId: deptIds.spice,
          leadResearcherId: staffIds.researcher1,
          title: 'High Oleoresin Turmeric Variety Development for Southwest Ethiopia',
          slug: 'high-oleoresin-turmeric-variety-development',
          code: 'PRJ-TUR-2025-04',
          summary:
            'Breeding and evaluating turmeric selections with elevated curcumin and oleoresin content suitable for industrial processing.',
          objectives: [
            'Evaluate 10 turmeric selections for curcumin content',
            'Conduct multi-location yield trials across 3 agroecologies',
          ],
          startDate: new Date('2024-03-01'),
          endDate: new Date('2027-02-28'),
          status: 'ONGOING',
          fundingSource: 'TARC Internal Fund',
          budget: '180000.00',
        },
        {
          id: projectIds.cbdBiocontrol,
          programId: programIds.protection,
          departmentId: deptIds.protection,
          leadResearcherId: staffIds.protectionLead,
          title: 'Biological Control of Coffee Berry Disease Using Native Antagonists',
          slug: 'biological-control-coffee-berry-disease',
          code: 'PRJ-CBD-2024-05',
          summary:
            'Isolating and evaluating native Trichoderma and Bacillus strains for suppression of Colletotrichum kahawae in coffee plantations.',
          objectives: [
            'Isolate antagonistic microorganisms from coffee rhizosphere',
            'Evaluate efficacy under field conditions in Sheka zone',
          ],
          startDate: new Date('2022-07-01'),
          endDate: new Date('2025-06-30'),
          status: 'COMPLETED',
          fundingSource: 'EIAR Competitive Grant',
          budget: '350000.00',
        },
        {
          id: projectIds.soilMapping,
          programId: programIds.soil,
          departmentId: deptIds.soil,
          leadResearcherId: staffIds.soilLead,
          title: 'Soil Fertility Mapping for Spice-Coffee Agroforestry in Yeki Woreda',
          slug: 'soil-fertility-mapping-spice-coffee-agroforestry',
          code: 'PRJ-SOL-2025-06',
          summary:
            'GPS-referenced soil sampling and nutrient analysis across 5 kebeles to guide site-specific fertilizer recommendations.',
          objectives: [
            'Collect 200 soil samples across 5 kebeles',
            'Develop nutrient management recommendations for 3 soil types',
          ],
          startDate: new Date('2024-06-01'),
          endDate: new Date('2026-05-31'),
          status: 'ONGOING',
          fundingSource: 'Southwest Regional Research Institute',
          budget: '220000.00',
        },
      ])
      .onDuplicateKeyUpdate({ set: { status: 'ONGOING' } });

    // 7. Publications (8)
    console.log('  -> Seeding Publications...');
    const pubIds = {
      korarima: 'pub00000-0000-0000-0000-000000000001',
      coffee: 'pub00000-0000-0000-0000-000000000002',
      ginger: 'pub00000-0000-0000-0000-000000000003',
      turmeric: 'pub00000-0000-0000-0000-000000000004',
      cbd: 'pub00000-0000-0000-0000-000000000005',
      soil: 'pub00000-0000-0000-0000-000000000006',
      extension: 'pub00000-0000-0000-0000-000000000007',
      policy: 'pub00000-0000-0000-0000-000000000008',
    };

    await db
      .insert(publications)
      .values([
        {
          id: pubIds.korarima,
          projectId: projectIds.korarima,
          title:
            'Agronomic Characterization and Essential Oil Composition of Ethiopian Korarima Accessions',
          slug: 'agronomic-characterization-essential-oil-korarima',
          abstract:
            'Aframomum corrorima is an indigenous high-value spice in Ethiopia. This study evaluated twelve accessions for yield attributes and essential oil yield. Clones TAR-04 and TAR-07 demonstrated superior dry capsule yield exceeding 1.8 tons/ha with 4.8% essential oil content.',
          publicationType: 'JOURNAL_ARTICLE',
          publisherOrJournal: 'Ethiopian Journal of Agricultural Sciences',
          publicationYear: 2025,
          doiUrl: 'https://doi.org/10.1234/ejas.2025.04.12',
          peerReviewed: true,
          isFeatured: true,
        },
        {
          id: pubIds.coffee,
          projectId: projectIds.coffeeShade,
          title:
            'Technical Guide for Agroforestry Shade Tree Management in Southwest Ethiopian Coffee',
          slug: 'technical-guide-agroforestry-shade-tree-coffee',
          abstract:
            'A practical extension manual outlining pruning regimes and density recommendations for Cordia africana, Millettia ferruginea, and Albizia gummifera in coffee agroforestry.',
          publicationType: 'TECHNICAL_MANUAL',
          publisherOrJournal: 'TARC Technical Bulletin No. 14',
          publicationYear: 2026,
          peerReviewed: true,
          isFeatured: true,
        },
        {
          id: pubIds.ginger,
          projectId: projectIds.gingerWilt,
          title:
            'First Report of Ralstonia solanacearum Causing Bacterial Wilt on Ginger in Southwest Ethiopia',
          slug: 'first-report-bacterial-wilt-ginger-southwest-ethiopia',
          abstract:
            'This study reports the isolation and identification of Ralstonia solanacearum from wilted ginger plants in Sheka Zone, with implications for disease management.',
          publicationType: 'JOURNAL_ARTICLE',
          publisherOrJournal: 'Plant Disease Journal',
          publicationYear: 2024,
          doiUrl: 'https://doi.org/10.1094/PDIS-2024-03-0456',
          peerReviewed: true,
          isFeatured: false,
        },
        {
          id: pubIds.turmeric,
          projectId: projectIds.turmeric,
          title: 'Curcumin Content Variation Among Ethiopian Turmeric Landraces',
          slug: 'curcumin-content-variation-ethiopian-turmeric',
          abstract:
            'Analysis of curcumin and oleoresin content in 10 turmeric landraces collected from diverse agroecologies in Southwest Ethiopia.',
          publicationType: 'CONFERENCE_PAPER',
          publisherOrJournal: 'Proceedings of the 18th Ethiopian Agricultural Research Conference',
          publicationYear: 2025,
          peerReviewed: false,
          isFeatured: false,
        },
        {
          id: pubIds.cbd,
          projectId: projectIds.cbdBiocontrol,
          title: 'Native Trichoderma Strums as Biocontrol Agents Against Coffee Berry Disease',
          slug: 'native-trichoderma-biocontrol-coffee-berry-disease',
          abstract:
            'Evaluation of 12 native Trichoderma isolates from coffee rhizosphere for antagonistic activity against Colletotrichum kahawae in vitro and under field conditions.',
          publicationType: 'JOURNAL_ARTICLE',
          publisherOrJournal: 'Biological Control Journal',
          publicationYear: 2024,
          doiUrl: 'https://doi.org/10.1016/j.biocontrol.2024.105234',
          peerReviewed: true,
          isFeatured: true,
        },
        {
          id: pubIds.soil,
          projectId: projectIds.soilMapping,
          title: 'Soil Nutrient Status of Spice-Coffee Agroforestry Systems in Yeki Woreda',
          slug: 'soil-nutrient-status-spice-coffee-agroforestry',
          abstract:
            'Comprehensive soil analysis across 200 sampling sites revealing nutrient deficiencies and management recommendations for sustainable spice-coffee production.',
          publicationType: 'JOURNAL_ARTICLE',
          publisherOrJournal: 'Ethiopian Journal of Soil Science',
          publicationYear: 2025,
          peerReviewed: true,
          isFeatured: false,
        },
        {
          id: pubIds.extension,
          title:
            'Adoption Rates of Improved Spice Technologies Among Smallholder Farmers in Sheka Zone',
          slug: 'adoption-rates-improved-spice-technologies',
          abstract:
            'A cross-sectional survey of 450 households assessing adoption determinants of improved Korarima planting materials and organic pest management practices.',
          publicationType: 'JOURNAL_ARTICLE',
          publisherOrJournal: 'Agricultural Economics Review',
          publicationYear: 2025,
          peerReviewed: true,
          isFeatured: false,
        },
        {
          id: pubIds.policy,
          title: 'Policy Brief: Strengthening Spice Value Chains for Ethiopia Export Growth',
          slug: 'policy-brief-strengthening-spice-value-chains',
          abstract:
            'Recommending policy interventions for quality standards, processing infrastructure, and market linkage to boost Ethiopia spice export earnings.',
          publicationType: 'POLICY_BRIEF',
          publisherOrJournal: 'TARC Policy Series',
          publicationYear: 2026,
          peerReviewed: false,
          isFeatured: true,
        },
      ])
      .onDuplicateKeyUpdate({ set: { isFeatured: true } });

    // 8. Publication Authors (12)
    console.log('  -> Seeding Publication Authors...');
    await db
      .insert(publicationAuthors)
      .values([
        {
          id: 'pa000000-0000-0000-0000-000000000001',
          publicationId: pubIds.korarima,
          staffId: staffIds.spiceLead,
          authorOrder: 1,
          isCorresponding: true,
        },
        {
          id: 'pa000000-0000-0000-0000-000000000002',
          publicationId: pubIds.korarima,
          staffId: staffIds.director,
          authorOrder: 2,
          isCorresponding: false,
        },
        {
          id: 'pa000000-0000-0000-0000-000000000003',
          publicationId: pubIds.coffee,
          staffId: staffIds.coffeeLead,
          authorOrder: 1,
          isCorresponding: true,
        },
        {
          id: 'pa000000-0000-0000-0000-000000000004',
          publicationId: pubIds.ginger,
          staffId: staffIds.protectionLead,
          authorOrder: 1,
          isCorresponding: true,
        },
        {
          id: 'pa000000-0000-0000-0000-000000000005',
          publicationId: pubIds.turmeric,
          staffId: staffIds.researcher1,
          authorOrder: 1,
          isCorresponding: true,
        },
        {
          id: 'pa000000-0000-0000-0000-000000000006',
          publicationId: pubIds.turmeric,
          staffId: staffIds.spiceLead,
          authorOrder: 2,
          isCorresponding: false,
        },
        {
          id: 'pa000000-0000-0000-0000-000000000007',
          publicationId: pubIds.cbd,
          staffId: staffIds.protectionLead,
          authorOrder: 1,
          isCorresponding: true,
        },
        {
          id: 'pa000000-0000-0000-0000-000000000008',
          publicationId: pubIds.soil,
          staffId: staffIds.soilLead,
          authorOrder: 1,
          isCorresponding: true,
        },
        {
          id: 'pa000000-0000-0000-0000-000000000009',
          publicationId: pubIds.extension,
          staffId: staffIds.extensionLead,
          authorOrder: 1,
          isCorresponding: true,
        },
        {
          id: 'pa000000-0000-0000-0000-000000000010',
          publicationId: pubIds.policy,
          staffId: staffIds.director,
          authorOrder: 1,
          isCorresponding: true,
        },
        {
          id: 'pa000000-0000-0000-0000-000000000011',
          publicationId: pubIds.policy,
          staffId: staffIds.extensionLead,
          authorOrder: 2,
          isCorresponding: false,
        },
        {
          id: 'pa000000-0000-0000-0000-000000000012',
          publicationId: pubIds.coffee,
          staffId: staffIds.researcher2,
          authorOrder: 2,
          isCorresponding: false,
        },
      ])
      .onDuplicateKeyUpdate({ set: { authorOrder: 1 } });

    // 9. News (6)
    console.log('  -> Seeding News...');
    await db
      .insert(news)
      .values([
        {
          id: 'n0000000-0000-0000-0000-000000000001',
          authorId: userIds.superAdmin,
          title:
            'TARC Releases High-Yielding Disease-Resistant Black Pepper Variety "Tepi-Pepper-1"',
          slug: 'tarc-releases-high-yield-black-pepper-variety',
          summary:
            'After six years of participatory varietal selection, "Tepi-Pepper-1" is officially approved for wide distribution.',
          content:
            'Tepi Agricultural Research Center is proud to announce the formal release of "Tepi-Pepper-1". The variety exhibits strong resistance to Phytophthora foot rot and yields up to 3.2 tons of dried peppercorns per hectare.',
          category: 'RESEARCH_NEWS',
          isPublished: true,
          isFeatured: true,
        },
        {
          id: 'n0000000-0000-0000-0000-000000000002',
          authorId: userIds.admin,
          title: 'TARC Hosts Regional Coffee Quality Evaluation Workshop',
          slug: 'tarc-hosts-regional-coffee-quality-workshop',
          summary:
            'Over 45 coffee quality experts gathered at TARC for a 3-day sensory evaluation workshop.',
          content:
            'The workshop brought together Q-graders from Southwest Ethiopia to calibrate cupping protocols and evaluate specialty coffee samples from Sheka and Keffa zones.',
          category: 'EVENTS',
          isPublished: true,
          isFeatured: false,
        },
        {
          id: 'n0000000-0000-0000-0000-000000000003',
          authorId: userIds.superAdmin,
          title: 'New Ginger Bacterial Wilt Management Guide Released for Farmers',
          slug: 'new-ginger-bacterial-wilt-guide-released',
          summary: 'A practical field guide for managing ginger bacterial wilt has been published.',
          content:
            'This guide provides smallholder farmers with step-by-step protocols for preventing and managing bacterial wilt in ginger, including resistant variety selection and soil health practices.',
          category: 'FARMER_ADVISORY',
          isPublished: true,
          isFeatured: true,
        },
        {
          id: 'n0000000-0000-0000-0000-000000000004',
          authorId: userIds.researcher1,
          title: 'TARC Researchers Present at International Spice Conference in India',
          slug: 'tarc-researchers-international-spice-conference',
          summary:
            'Two TARC researchers presented findings on Korarima essential oil at the Global Spice Symposium.',
          content:
            'Dr. Abebe Tadesse and Hana Girma presented their research on Ethiopian Korarima essential oil composition at the Global Spice Symposium in Kochi, India.',
          category: 'RESEARCH_NEWS',
          isPublished: true,
          isFeatured: false,
        },
        {
          id: 'n0000000-0000-0000-0000-000000000005',
          authorId: userIds.admin,
          title: 'TARC Celebrates 25 Years of Agricultural Research Excellence',
          slug: 'tarc-celebrates-25-years-research',
          summary:
            'Tepi Agricultural Research Center marks a quarter century of service to Ethiopian agriculture.',
          content:
            'Founded in 2001, TARC has released 12 improved crop varieties and trained over 5,000 farmers in sustainable agricultural practices across Southwest Ethiopia.',
          category: 'INSTITUTIONAL',
          isPublished: true,
          isFeatured: true,
        },
        {
          id: 'n0000000-0000-0000-0000-000000000006',
          authorId: userIds.superAdmin,
          title: 'Farmer Field School Enrollment Opens for 2026 Season',
          slug: 'farmer-field-school-enrollment-2026',
          summary:
            'Registration is now open for the 2026 Farmer Field School program targeting 200 smallholders.',
          content:
            'TARC invites smallholder farmers from Yeki and Sheka woredas to enroll in the 2026 Farmer Field School, covering improved spice and coffee production technologies.',
          category: 'FARMER_ADVISORY',
          isPublished: true,
          isFeatured: false,
        },
      ])
      .onDuplicateKeyUpdate({ set: { isPublished: true } });

    // 10. Events (6)
    console.log('  -> Seeding Events...');
    await db
      .insert(events)
      .values([
        {
          id: 'e0000000-0000-0000-0000-000000000001',
          title: 'Annual Tepi Spice & Coffee Farmers Field Day 2026',
          slug: 'annual-tepi-spice-coffee-farmers-field-day-2026',
          eventType: 'FIELD_DAY',
          description:
            'Live demonstration of Korarima seedling transplanting and organic pest management for 400+ farmers.',
          location: 'TARC Main Demonstration Farm, Tepi Station',
          startTime: new Date('2026-10-15 08:30:00'),
          endTime: new Date('2026-10-15 16:30:00'),
          isAllDay: false,
          isPublished: true,
        },
        {
          id: 'e0000000-0000-0000-0000-000000000002',
          title: 'Coffee Cup Quality Training Workshop',
          slug: 'coffee-cup-quality-training-workshop',
          eventType: 'TRAINING_SESSION',
          description:
            'Hands-on training for development agents on sensory evaluation and cupping protocols for Arabica coffee.',
          location: 'TARC Coffee Laboratory',
          startTime: new Date('2026-09-20 09:00:00'),
          endTime: new Date('2026-09-22 17:00:00'),
          isAllDay: false,
          isPublished: true,
        },
        {
          id: 'e0000000-0000-0000-0000-000000000003',
          title: 'National Spice Research Conference 2026',
          slug: 'national-spice-research-conference-2026',
          eventType: 'CONFERENCE',
          description:
            'Annual gathering of spice researchers from across Ethiopia to present findings and plan collaborative research.',
          location: 'Addis Ababa, EIAR Conference Hall',
          startTime: new Date('2026-11-05 08:00:00'),
          endTime: new Date('2026-11-07 17:00:00'),
          isAllDay: true,
          isPublished: true,
        },
        {
          id: 'e0000000-0000-0000-0000-000000000004',
          title: 'Soil Health Workshop for Extension Agents',
          slug: 'soil-health-workshop-extension-agents',
          eventType: 'WORKSHOP',
          description:
            'Practical training on soil sampling techniques, organic composting, and nutrient management.',
          location: 'TARC Training Center',
          startTime: new Date('2026-08-10 09:00:00'),
          endTime: new Date('2026-08-11 16:00:00'),
          isAllDay: false,
          isPublished: true,
        },
        {
          id: 'e0000000-0000-0000-0000-000000000005',
          title: 'Ginger Production Seminar',
          slug: 'ginger-production-seminar',
          eventType: 'SEMINAR',
          description:
            'Seminar on improved ginger production technologies including variety selection and post-harvest handling.',
          location: 'TARC Auditorium',
          startTime: new Date('2026-07-15 14:00:00'),
          endTime: new Date('2026-07-15 17:00:00'),
          isAllDay: false,
          isPublished: true,
        },
        {
          id: 'e0000000-0000-0000-0000-000000000006',
          title: 'Post-Harvest Processing Training for Spice Farmers',
          slug: 'post-harvest-processing-training-spice',
          eventType: 'TRAINING_SESSION',
          description:
            'Hands-on training on solar drying, grading, and packaging of Korarima and turmeric.',
          location: 'TARC Post-Harvest Unit',
          startTime: new Date('2026-06-01 08:00:00'),
          endTime: new Date('2026-06-02 16:00:00'),
          isAllDay: false,
          isPublished: true,
        },
      ])
      .onDuplicateKeyUpdate({ set: { isPublished: true } });

    // 11. Vacancies
    console.log('  -> Seeding Vacancies...');
    await db
      .insert(vacancies)
      .values([
        {
          id: 'va000000-0000-0000-0000-000000000001',
          departmentId: deptIds.spice,
          title: 'Senior Spice Researcher',
          employmentType: 'FULL_TIME',
          location: 'Tepi Agricultural Research Center',
          closingDate: new Date('2026-12-31'),
          description: 'Lead field trials and farmer partnerships for Korarima, ginger, turmeric, and other priority spice crops at TARC.',
          qualifications: 'MSc or PhD in agronomy, plant breeding, horticulture, or a related field.\nAt least three years of agricultural research experience.\nStrong field research and technical reporting skills.',
          applicationInstructions: 'Submit a CV and cover letter through the official TARC contact page before the closing date.',
          isPublished: true,
        },
      ])
      .onDuplicateKeyUpdate({ set: { isPublished: true } });

    // 12. Gallery Media (10)
    console.log('  -> Seeding Gallery Media...');
    await db
      .insert(galleryMedia)
      .values([
        {
          id: 'g0000000-0000-0000-0000-000000000001',
          uploadedBy: userIds.superAdmin,
          title: 'Korarima Field Trial Plot',
          caption: 'Evaluating 8 Korarima clones at TARC experimental station',
          category: 'FIELD_TRIALS',
          imageUrl: '/images/field-3.jpg',
          thumbnailUrl: '/images/field-3.jpg',
        },
        {
          id: 'g0000000-0000-0000-0000-000000000002',
          uploadedBy: userIds.superAdmin,
          title: 'Coffee Cupping Laboratory',
          caption: 'Sensory evaluation of specialty Arabica samples',
          category: 'LABORATORY',
          imageUrl: '/images/labrat.jpg',
          thumbnailUrl: '/images/labrat.jpg',
        },
        {
          id: 'g0000000-0000-0000-0000-000000000003',
          uploadedBy: userIds.researcher1,
          title: 'Turmeric Variety Trial',
          caption: 'High oleoresin turmeric selections in bloom',
          category: 'SPICE_VARIETIES',
          imageUrl: '/images/cacao-research.jpg',
          thumbnailUrl: '/images/cacao-research.jpg',
        },
        {
          id: 'g0000000-0000-0000-0000-000000000004',
          uploadedBy: userIds.researcher2,
          title: 'Shaded Coffee Canopy',
          caption: 'Albizia gummifera shade canopy over coffee plants',
          category: 'COFFEE_RESEARCH',
          imageUrl: '/images/red-coffee.jpg',
          thumbnailUrl: '/images/red-coffee.jpg',
        },
        {
          id: 'g0000000-0000-0000-0000-000000000005',
          uploadedBy: userIds.admin,
          title: 'Farmer Training Session',
          caption: 'Extension agents learning improved pruning techniques',
          category: 'COMMUNITY_OUTREACH',
          imageUrl: '/images/planting.jpg',
          thumbnailUrl: '/images/planting.jpg',
        },
        {
          id: 'g0000000-0000-0000-0000-000000000006',
          uploadedBy: userIds.superAdmin,
          title: 'TARC Main Building',
          caption: 'Administrative and laboratory complex at Tepi station',
          category: 'FACILITIES',
          imageUrl: '/images/coffee-seed.jpg',
          thumbnailUrl: '/images/coffee-seed.jpg',
        },
        {
          id: 'g0000000-0000-0000-0000-000000000007',
          uploadedBy: userIds.researcher1,
          title: 'Black Pepper Harvest',
          caption: 'Mature black peppercorns ready for harvest',
          category: 'SPICE_VARIETIES',
          imageUrl: '/images/cacuo.jpg',
          thumbnailUrl: '/images/cacuo.jpg',
        },
        {
          id: 'g0000000-0000-0000-0000-000000000008',
          uploadedBy: userIds.researcher2,
          title: 'Coffee Cherry Processing',
          caption: 'Washed processing at TARC demonstration wet mill',
          category: 'COFFEE_RESEARCH',
          imageUrl: '/images/field.jpg',
          thumbnailUrl: '/images/field.jpg',
        },
        {
          id: 'g0000000-0000-0000-0000-000000000009',
          uploadedBy: userIds.superAdmin,
          title: 'Seedling Nursery',
          caption: 'Korarima seedlings ready for distribution to farmers',
          category: 'FIELD_TRIALS',
          imageUrl: '/images/background.jpg',
          thumbnailUrl: '/images/background.jpg',
        },
        {
          id: 'g0000000-0000-0000-0000-000000000010',
          uploadedBy: userIds.admin,
          title: 'Field Day Event',
          caption: 'Farmers参观 TARC demonstration plots',
          category: 'COMMUNITY_OUTREACH',
          imageUrl: '/images/chicken.jpg',
          thumbnailUrl: '/images/chicken.jpg',
        },
      ])
      .onDuplicateKeyUpdate({ set: { title: 'Korarima Field Trial Plot' } });

    // 12. Vehicles (4)
    console.log('  -> Seeding Vehicles...');
    const vehicleIds = {
      v1: 'v0000000-0000-0000-0000-000000000001',
      v2: 'v0000000-0000-0000-0000-000000000002',
      v3: 'v0000000-0000-0000-0000-000000000003',
      v4: 'v0000000-0000-0000-0000-000000000004',
    };

    await db
      .insert(vehicles)
      .values([
        {
          id: vehicleIds.v1,
          registrationPlate: '3-ET-14258',
          make: 'Toyota',
          model: 'Land Cruiser HZJ79 4WD',
          year: 2022,
          vehicleType: 'PICKUP_4WD',
          departmentId: deptIds.spice,
          assignedDriver: 'Mulugeta Assefa',
          status: 'AVAILABLE',
          fuelType: 'DIESEL',
          mileageKm: 48200,
          notes: 'Equipped with winch and heavy terrain tires for Sheka trial plots.',
        },
        {
          id: vehicleIds.v2,
          registrationPlate: '3-ET-19874',
          make: 'Toyota',
          model: 'Hilux Double Cabin 4WD',
          year: 2023,
          vehicleType: 'PICKUP_4WD',
          departmentId: deptIds.coffee,
          assignedDriver: 'Dawit Mengistu',
          status: 'IN_USE',
          fuelType: 'DIESEL',
          mileageKm: 29150,
          notes: 'Assigned for coffee sample collection in Yeki woreda.',
        },
        {
          id: vehicleIds.v3,
          registrationPlate: '3-ET-21034',
          make: 'Toyota',
          model: 'Land Cruiser Prado',
          year: 2021,
          vehicleType: 'SUV',
          departmentId: deptIds.extension,
          assignedDriver: 'Kassahun Alemayehu',
          status: 'AVAILABLE',
          fuelType: 'DIESEL',
          mileageKm: 62300,
          notes: 'Used for extension field visits and farmer training.',
        },
        {
          id: vehicleIds.v4,
          registrationPlate: '3-ET-22567',
          make: 'Isuzu',
          model: 'NPR Dropside Truck',
          year: 2020,
          vehicleType: 'TRUCK',
          departmentId: deptIds.soil,
          assignedDriver: 'Yonas Bekele',
          status: 'UNDER_MAINTENANCE',
          fuelType: 'DIESEL',
          mileageKm: 85400,
          notes: 'Scheduled for brake pad replacement and oil service.',
        },
      ])
      .onDuplicateKeyUpdate({ set: { status: 'AVAILABLE' } });

    // 13. Vehicle Assignments (3)
    console.log('  -> Seeding Vehicle Assignments...');
    await db
      .insert(vehicleAssignments)
      .values([
        {
          id: 'va000000-0000-0000-0000-000000000001',
          vehicleId: vehicleIds.v2,
          requestedById: userIds.researcher2,
          destination: 'Yeki Woreda, Key Afer Kebele',
          purpose: 'Collect coffee cherry samples for cup quality analysis',
          startTime: new Date('2026-08-20 07:00:00'),
          endTime: new Date('2026-08-20 18:00:00'),
          status: 'ACTIVE',
        },
        {
          id: 'va000000-0000-0000-0000-000000000002',
          vehicleId: vehicleIds.v1,
          requestedById: userIds.researcher1,
          destination: 'Sheka Woreda, Masha Town',
          purpose: 'Transport Korarima seedlings to farmer cooperatives',
          startTime: new Date('2026-09-01 08:00:00'),
          endTime: new Date('2026-09-02 17:00:00'),
          status: 'PENDING',
        },
        {
          id: 'va000000-0000-0000-0000-000000000003',
          vehicleId: vehicleIds.v3,
          requestedById: userIds.staff1,
          destination: 'Tepi Town, Farmers Training Center',
          purpose: 'Transport training materials for Farmer Field School',
          startTime: new Date('2026-08-25 09:00:00'),
          endTime: new Date('2026-08-25 16:00:00'),
          status: 'COMPLETED',
        },
      ])
      .onDuplicateKeyUpdate({ set: { status: 'PENDING' } });

    // 14. Contact Messages (4)
    console.log('  -> Seeding Contact Messages...');
    await db
      .insert(contactMessages)
      .values([
        {
          id: 'cm000000-0000-0000-0000-000000000001',
          senderName: 'Kassahun Alemayehu',
          senderEmail: 'kassahun.agri@gmail.com',
          senderPhone: '+251 91 765 4321',
          subject: 'Request for Improved Korarima Seedlings',
          message:
            'Our farmers cooperative in Anderacha Woreda is preparing 15 hectares for Korarima agroforestry. How can we place an order for certified nursery seedlings?',
          status: 'UNREAD',
        },
        {
          id: 'cm000000-0000-0000-0000-000000000002',
          senderName: 'Sara Tesfaye',
          senderEmail: 'sara.tesfaye@mu.edu.et',
          senderPhone: '+251 92 345 6789',
          subject: 'Collaboration Request on Coffee Research',
          message:
            'I am a PhD student at Jimma University researching coffee genetics. I would like to collaborate with TARC on collecting coffee leaf samples from Sheka forest.',
          status: 'READ',
        },
        {
          id: 'cm000000-0000-0000-0000-000000000003',
          senderName: 'Tadesse Chemeda',
          senderEmail: 'tadesse.farm@yahoo.com',
          senderPhone: '+251 93 456 7890',
          subject: 'Inquiry About Turmeric Processing Training',
          message:
            'I am a farmer in Yeki Woreda interested in learning turmeric post-harvest processing. When is the next training session?',
          status: 'IN_PROGRESS',
        },
        {
          id: 'cm000000-0000-0000-0000-000000000004',
          senderName: 'Birhanu Kassa',
          senderEmail: 'birhanu.kassa@moa.gov.et',
          senderPhone: '+251 94 567 8901',
          subject: 'Policy Brief Request',
          message:
            'Could TARC provide a policy brief on the spice sector for the upcoming Parliamentary committee session on agricultural exports?',
          status: 'UNREAD',
        },
      ])
      .onDuplicateKeyUpdate({ set: { status: 'UNREAD' } });

    console.log('✅ TARCMS comprehensive seeding completed!');
    console.log('   Seeded: 1 settings, 5 users, 5 departments, 8 staff, 4 programs, 6 projects,');
    console.log('           8 publications, 12 authors, 6 news, 6 events, 10 gallery, 4 vehicles,');
    console.log('           3 assignments, 4 messages');
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  } finally {
    await poolConnection.end();
  }
}

seedDatabase();

