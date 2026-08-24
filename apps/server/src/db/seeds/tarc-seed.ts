/**
 * @file apps/server/src/db/seeds/tarc-seed.ts
 * @description Deterministic database seeder for Tepi Agricultural Research Center (TARC).
 * Populates realistic domain entities: Users, Departments (Spices, Coffee, Protection),
 * Staff Directory, Research Programs, Experimental Trials/Projects, Publications with Authors,
 * News Articles, Field Day Events, Media Gallery, Fleet Vehicles, Contact Messages, and Settings.
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
  vehicleAssignments,
  vehicles,
} from '../schema/index.js';

/**
 * Main database seeder execution function.
 */
export async function seedDatabase() {
  console.log('🌱 Starting TARCMS database seeding with realistic agricultural data...');

  try {
    // 1. Hash standard passwords with bcrypt
    const superAdminPasswordHash = await bcrypt.hash('admin123456', 10);
    const researcherPasswordHash = await bcrypt.hash('researcher123456', 10);

    // 2. Seed System Settings (Singleton Profile)
    console.log('  -> Seeding System Settings...');
    await db
      .insert(systemSettings)
      .values({
        id: 'primary',
        institutionName: 'Tepi Agricultural Research Center',
        tagline: 'Pioneering Spice, Coffee & Horticultural Excellence in Southwest Ethiopia',
        aboutText:
          'Tepi Agricultural Research Center (TARC) was established to serve as the national excellence center for spice research and development in Ethiopia, alongside advancing Arabica coffee productivity and sustainable agroforestry in the Sheka Biosphere zone.',
        missionText:
          'To generate and disseminate demand-driven agricultural technologies in spices, coffee, and horticultural crops that enhance food security, agro-industrial raw material supply, and export earnings.',
        visionText:
          'To see technologically transformed, competitive, and climate-resilient farming communities in Southwest Ethiopia by 2035.',
        directorName: 'Dr. Girma Bekele',
        directorTitle: 'Center Director & Lead Agronomist',
        directorMessage:
          'Welcome to TARCMS. Our research teams in Tepi are dedicated to developing high-yielding, disease-resistant spice varieties, optimizing coffee cup quality, and training local smallholders.',
        officialEmail: 'info@tarc.gov.et',
        officialPhone: '+251 47 556 0123',
        physicalAddress: 'Tepi, Yeki Woreda, Sheka Zone, Southwest Ethiopia Regional State',
        gpsCoordinates: '7.1997° N, 35.4244° E',
        socialLinks: {
          telegram: 'https://t.me/tarc_ethiopia',
          facebook: 'https://facebook.com/tepiaresearch',
        },
      })
      .onDuplicateKeyUpdate({
        set: { institutionName: 'Tepi Agricultural Research Center' },
      });

    // 3. Seed Users
    console.log('  -> Seeding User Accounts...');
    const userSuperAdminId = 'u0000000-0000-0000-0000-000000000001';
    const userResearcher1Id = 'u0000000-0000-0000-0000-000000000002';
    const userResearcher2Id = 'u0000000-0000-0000-0000-000000000003';

    await db
      .insert(users)
      .values([
        {
          id: userSuperAdminId,
          name: 'Dr. Girma Bekele',
          email: 'admin@tarc.gov.et',
          passwordHash: superAdminPasswordHash,
          role: 'SUPER_ADMIN',
          phone: '+251 91 123 4567',
          isActive: true,
        },
        {
          id: userResearcher1Id,
          name: 'Abebe Tadesse',
          email: 'abebe.tadesse@tarc.gov.et',
          passwordHash: researcherPasswordHash,
          role: 'RESEARCHER',
          phone: '+251 92 234 5678',
          isActive: true,
        },
        {
          id: userResearcher2Id,
          name: 'Dr. Tigist Hailu',
          email: 'tigist.hailu@tarc.gov.et',
          passwordHash: researcherPasswordHash,
          role: 'RESEARCHER',
          phone: '+251 93 345 6789',
          isActive: true,
        },
      ])
      .onDuplicateKeyUpdate({
        set: { isActive: true },
      });

    // 4. Seed Departments
    console.log('  -> Seeding Research Departments...');
    const deptSpiceId = 'd0000000-0000-0000-0000-000000000001';
    const deptCoffeeId = 'd0000000-0000-0000-0000-000000000002';
    const deptProtectionId = 'd0000000-0000-0000-0000-000000000003';
    const deptSoilId = 'd0000000-0000-0000-0000-000000000004';
    const deptExtensionId = 'd0000000-0000-0000-0000-000000000005';

    await db
      .insert(departments)
      .values([
        {
          id: deptSpiceId,
          name: 'Spices & Essential Oils Research Department',
          code: 'DEPT-SPICE',
          description:
            'National excellence center for large cardamom (Korerima), black pepper, ginger, turmeric, and vanilla breeding and agronomy.',
          establishedYear: 1998,
          sortOrder: 1,
        },
        {
          id: deptCoffeeId,
          name: 'Coffee & Beverage Crops Research Department',
          code: 'DEPT-COFFEE',
          description:
            'Dedicated to Arabica coffee genetic improvement, shade canopy management, cup quality profiling, and processing technology.',
          establishedYear: 2000,
          sortOrder: 2,
        },
        {
          id: deptProtectionId,
          name: 'Crop Protection & Plant Pathology Department',
          code: 'DEPT-PROT',
          description:
            'Focuses on diagnostic identification and integrated management of coffee berry disease (CBD), ginger bacterial wilt, and spice insect pests.',
          establishedYear: 2002,
          sortOrder: 3,
        },
        {
          id: deptSoilId,
          name: 'Natural Resources & Soil Science Department',
          code: 'DEPT-SOIL',
          description:
            'Soil fertility mapping, organic composting, agroforestry canopy conservation, and sustainable land management.',
          establishedYear: 2005,
          sortOrder: 4,
        },
        {
          id: deptExtensionId,
          name: 'Agricultural Economics & Farmer Extension',
          code: 'DEPT-EXT',
          description:
            'Technology transfer, farmer field schools, gender-inclusive adoption studies, and agricultural market linkage research.',
          establishedYear: 2006,
          sortOrder: 5,
        },
      ])
      .onDuplicateKeyUpdate({
        set: { sortOrder: 1 },
      });

    // 5. Seed Staff Members
    console.log('  -> Seeding Staff Directory...');
    const staffDirectorId = 's0000000-0000-0000-0000-000000000001';
    const staffSpiceLeadId = 's0000000-0000-0000-0000-000000000002';
    const staffCoffeeLeadId = 's0000000-0000-0000-0000-000000000003';

    await db
      .insert(staff)
      .values([
        {
          id: staffDirectorId,
          userId: userSuperAdminId,
          departmentId: deptSpiceId,
          firstName: 'Girma',
          lastName: 'Bekele',
          position: 'Center Director & Senior Agronomist',
          email: 'girma.bekele@tarc.gov.et',
          phone: '+251 91 123 4567',
          areasOfExpertise: ['Spice Agronomy', 'Cropping Systems', 'Korerima Breeding'],
          bio: 'Dr. Girma has over 18 years of experience leading national spice breeding and sustainable agroforestry initiatives in Ethiopia.',
          isActive: true,
          isFeatured: true,
          sortOrder: 1,
        },
        {
          id: staffSpiceLeadId,
          userId: userResearcher1Id,
          departmentId: deptSpiceId,
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
          id: staffCoffeeLeadId,
          userId: userResearcher2Id,
          departmentId: deptCoffeeId,
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
      ])
      .onDuplicateKeyUpdate({
        set: { isActive: true },
      });

    // 6. Seed Research Programs
    console.log('  -> Seeding Strategic Research Programs...');
    const programSpiceId = 'p0000000-0000-0000-0000-000000000001';
    const programCoffeeId = 'p0000000-0000-0000-0000-000000000002';

    await db
      .insert(researchPrograms)
      .values([
        {
          id: programSpiceId,
          departmentId: deptSpiceId,
          leadStaffId: staffSpiceLeadId,
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
          id: programCoffeeId,
          departmentId: deptCoffeeId,
          leadStaffId: staffCoffeeLeadId,
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
      ])
      .onDuplicateKeyUpdate({
        set: { status: 'ACTIVE' },
      });

    // 7. Seed Research Projects (Trials)
    console.log('  -> Seeding Research Trials & Projects...');
    const projectCardamomId = 'pr000000-0000-0000-0000-000000000001';
    const projectCoffeeShadeId = 'pr000000-0000-0000-0000-000000000002';

    await db
      .insert(researchProjects)
      .values([
        {
          id: projectCardamomId,
          programId: programSpiceId,
          departmentId: deptSpiceId,
          leadResearcherId: staffSpiceLeadId,
          title:
            'Adaptability and Capsule Yield Performance of Elite Korarima (Aframomum corrorima) Clones in Sheka',
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
          id: projectCoffeeShadeId,
          programId: programCoffeeId,
          departmentId: deptCoffeeId,
          leadResearcherId: staffCoffeeLeadId,
          title:
            'Influence of Albizia gummifera and Cordia africana Shade Canopy on Coffee Cup Quality in Tepi',
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
      ])
      .onDuplicateKeyUpdate({
        set: { status: 'ONGOING' },
      });

    // 8. Seed Publications & Author Mappings
    console.log('  -> Seeding Scientific Publications & Authors...');
    const pubKorarimaId = 'pub00000-0000-0000-0000-000000000001';
    const pubCoffeeId = 'pub00000-0000-0000-0000-000000000002';

    await db
      .insert(publications)
      .values([
        {
          id: pubKorarimaId,
          projectId: projectCardamomId,
          title:
            'Agronomic Characterization and Essential Oil Composition of Ethiopian Korarima (Aframomum corrorima) Accessions in Tepi',
          slug: 'agronomic-characterization-essential-oil-korarima-tepi',
          abstract:
            'Aframomum corrorima is an indigenous high-value spice in Ethiopia. This study evaluated twelve accessions collected across Sheka and Keffa for yield attributes and essential oil yield. Clones TAR-04 and TAR-07 demonstrated superior dry capsule yield exceeding 1.8 tons/ha with 4.8% essential oil content rich in 1,8-cineole.',
          publicationType: 'JOURNAL_ARTICLE',
          publisherOrJournal: 'Ethiopian Journal of Agricultural Sciences (EJAS)',
          publicationYear: 2025,
          doiUrl: 'https://doi.org/10.1234/ejas.2025.04.12',
          fileUrl: '/uploads/publications/korarima_accessions_tepi_2025.pdf',
          fileSizeBytes: 2450000,
          peerReviewed: true,
          isFeatured: true,
        },
        {
          id: pubCoffeeId,
          projectId: projectCoffeeShadeId,
          title:
            'Technical Guide for Agroforestry Shade Tree Management in Southwest Ethiopian Coffee Forests',
          slug: 'technical-guide-agroforestry-shade-tree-management-coffee',
          abstract:
            'A practical extension manual designed for development agents, smallholder coffee growers, and commercial farm managers outlining pruning regimes and density recommendations for Cordia africana, Millettia ferruginea, and Albizia gummifera.',
          publicationType: 'TECHNICAL_MANUAL',
          publisherOrJournal: 'Tepi Agricultural Research Center Technical Bulletin No. 14',
          publicationYear: 2026,
          fileUrl: '/uploads/publications/tarc_coffee_shade_manual_2026.pdf',
          fileSizeBytes: 3800000,
          peerReviewed: true,
          isFeatured: true,
        },
      ])
      .onDuplicateKeyUpdate({
        set: { isFeatured: true },
      });

    await db
      .insert(publicationAuthors)
      .values([
        {
          id: 'pa000000-0000-0000-0000-000000000001',
          publicationId: pubKorarimaId,
          staffId: staffSpiceLeadId,
          authorOrder: 1,
          isCorresponding: true,
        },
        {
          id: 'pa000000-0000-0000-0000-000000000002',
          publicationId: pubKorarimaId,
          staffId: staffDirectorId,
          authorOrder: 2,
          isCorresponding: false,
        },
        {
          id: 'pa000000-0000-0000-0000-000000000003',
          publicationId: pubCoffeeId,
          staffId: staffCoffeeLeadId,
          authorOrder: 1,
          isCorresponding: true,
        },
      ])
      .onDuplicateKeyUpdate({
        set: { authorOrder: 1 },
      });

    // 9. Seed News Articles
    console.log('  -> Seeding News & Farmer Advisories...');
    await db
      .insert(news)
      .values([
        {
          id: 'n0000000-0000-0000-0000-000000000001',
          authorId: userSuperAdminId,
          title:
            'TARC Releases High-Yielding Disease-Resistant Black Pepper Variety "Tepi-Pepper-1"',
          slug: 'tarc-releases-high-yield-black-pepper-variety',
          summary:
            'After six years of participatory varietal selection, the National Variety Release Standing Committee has officially approved "Tepi-Pepper-1" for wide distribution.',
          content:
            'Tepi Agricultural Research Center is proud to announce the formal release of "Tepi-Pepper-1". The variety exhibits strong resistance to Phytophthora foot rot and yields up to 3.2 tons of dried peppercorns per hectare under tree canopy.',
          category: 'RESEARCH_NEWS',
          coverImageUrl: '/images/news/black_pepper_release.jpg',
          isPublished: true,
          isFeatured: true,
        },
      ])
      .onDuplicateKeyUpdate({
        set: { isPublished: true },
      });

    // 10. Seed Events
    console.log('  -> Seeding Events Calendar...');
    await db
      .insert(events)
      .values([
        {
          id: 'e0000000-0000-0000-0000-000000000001',
          title: 'Annual Tepi Spice & Coffee Farmers Field Day 2026',
          slug: 'annual-tepi-spice-coffee-farmers-field-day-2026',
          eventType: 'FIELD_DAY',
          description:
            'Join over 400 smallholder spice farmers, coffee union representatives, and agronomists at the TARC Experimental Station for live demonstration of Korarima seedling transplanting and organic pest management.',
          location: 'TARC Main Demonstration Farm, Tepi Station',
          startTime: new Date('2026-10-15 08:30:00'),
          endTime: new Date('2026-10-15 16:30:00'),
          isAllDay: false,
          isPublished: true,
        },
      ])
      .onDuplicateKeyUpdate({
        set: { isPublished: true },
      });

    // 11. Seed Vehicles & Fleet Log
    console.log('  -> Seeding Operational Fleet Vehicles...');
    const vehicle1Id = 'v0000000-0000-0000-0000-000000000001';
    const vehicle2Id = 'v0000000-0000-0000-0000-000000000002';

    await db
      .insert(vehicles)
      .values([
        {
          id: vehicle1Id,
          registrationPlate: '3-ET-14258',
          make: 'Toyota',
          model: 'Land Cruiser HZJ79 4WD',
          year: 2022,
          vehicleType: 'PICKUP_4WD',
          departmentId: deptSpiceId,
          assignedDriver: 'Mulugeta Assefa',
          status: 'AVAILABLE',
          fuelType: 'DIESEL',
          mileageKm: 48200,
          notes:
            'Regular 45k service completed. Equipped with winch and heavy terrain tires for Sheka trial plots.',
        },
        {
          id: vehicle2Id,
          registrationPlate: '3-ET-19874',
          make: 'Toyota',
          model: 'Hilux Double Cabin 4WD',
          year: 2023,
          vehicleType: 'PICKUP_4WD',
          departmentId: deptCoffeeId,
          assignedDriver: 'Dawit Mengistu',
          status: 'IN_USE',
          fuelType: 'DIESEL',
          mileageKm: 29150,
          notes: 'Assigned for coffee sample collection in Yeki woreda kebeles.',
        },
      ])
      .onDuplicateKeyUpdate({
        set: { status: 'AVAILABLE' },
      });

    // 12. Seed Contact Inquiries
    console.log('  -> Seeding Visitor Inquiries...');
    await db
      .insert(contactMessages)
      .values([
        {
          id: 'cm000000-0000-0000-0000-000000000001',
          senderName: 'Kassahun Alemayehu',
          senderEmail: 'kassahun.agri@gmail.com',
          senderPhone: '+251 91 765 4321',
          subject: 'Request for Improved Large Cardamom Seedlings for 2026 Planting Season',
          message:
            'Dear TARC Team, our farmers cooperative in Anderacha Woreda is preparing 15 hectares for Korarima agroforestry. How can we place an order for certified nursery seedlings?',
          status: 'UNREAD',
        },
      ])
      .onDuplicateKeyUpdate({
        set: { status: 'UNREAD' },
      });

    console.log('✅ TARCMS database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error during database seeding:', error);
    process.exit(1);
  } finally {
    await poolConnection.end();
  }
}

// Execute directly if run via CLI
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase();
}
