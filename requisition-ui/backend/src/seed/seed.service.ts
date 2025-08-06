import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class SeedService {
  async seedData() {
    try {
      // Clear existing data
      await prisma.message.deleteMany();
      await prisma.conversation.deleteMany();
      await prisma.contract.deleteMany();
      await prisma.service.deleteMany();
      await prisma.consultant.deleteMany();
      await prisma.rateCard.deleteMany();
      await prisma.vendor.deleteMany();

      // Create Vendor 1: TechCorp Solutions
      const vendor1 = await prisma.vendor.create({
        data: {
          name: "TechCorp Solutions",
          email: "contact@techcorp.com",
          company: "TechCorp Solutions Inc.",
          skills: ["React", "Node.js", "Python", "AWS", "DevOps", "Machine Learning"],
          rating: 4.8,
          description: "Leading technology consulting firm specializing in custom software development, cloud solutions, and digital transformation. We help businesses modernize their technology stack and accelerate digital innovation.",
          website: "https://techcorp-solutions.com",
          location: "San Francisco, CA",
          foundedYear: 2015,
          employeeCount: 150,
        },
      });

      // Create Vendor 2: InnovateIT Services
      const vendor2 = await prisma.vendor.create({
        data: {
          name: "InnovateIT Services",
          email: "hello@innovateit.com",
          company: "InnovateIT Services LLC",
          skills: ["Java", "Spring Boot", "Angular", "Azure", "Kubernetes", "Data Engineering"],
          rating: 4.6,
          description: "Enterprise-grade IT services provider with expertise in Java development, cloud architecture, and data engineering. We deliver scalable solutions for Fortune 500 companies.",
          website: "https://innovateit-services.com",
          location: "New York, NY",
          foundedYear: 2012,
          employeeCount: 200,
        },
      });

      // Rate Cards for TechCorp
      await prisma.rateCard.createMany({
        data: [
          {
            title: "Senior Full Stack Developer",
            hourlyRate: 85,
            dailyRate: 680,
            monthlyRate: 13600,
            currency: "USD",
            experience: "5-8 years",
            skills: ["React", "Node.js", "TypeScript", "MongoDB", "AWS"],
            vendorId: vendor1.id,
          },
          {
            title: "DevOps Engineer",
            hourlyRate: 95,
            dailyRate: 760,
            monthlyRate: 15200,
            currency: "USD",
            experience: "3-5 years",
            skills: ["Docker", "Kubernetes", "AWS", "Terraform", "Jenkins"],
            vendorId: vendor1.id,
          },
          {
            title: "Data Scientist",
            hourlyRate: 110,
            dailyRate: 880,
            monthlyRate: 17600,
            currency: "USD",
            experience: "4-7 years",
            skills: ["Python", "TensorFlow", "PyTorch", "SQL", "Machine Learning"],
            vendorId: vendor1.id,
          },
        ],
      });

      // Rate Cards for InnovateIT
      await prisma.rateCard.createMany({
        data: [
          {
            title: "Senior Java Developer",
            hourlyRate: 90,
            dailyRate: 720,
            monthlyRate: 14400,
            currency: "USD",
            experience: "6-10 years",
            skills: ["Java", "Spring Boot", "Microservices", "Oracle", "Maven"],
            vendorId: vendor2.id,
          },
          {
            title: "Cloud Architect",
            hourlyRate: 120,
            dailyRate: 960,
            monthlyRate: 19200,
            currency: "USD",
            experience: "7-12 years",
            skills: ["Azure", "AWS", "Kubernetes", "Terraform", "Microservices"],
            vendorId: vendor2.id,
          },
          {
            title: "Data Engineer",
            hourlyRate: 100,
            dailyRate: 800,
            monthlyRate: 16000,
            currency: "USD",
            experience: "4-8 years",
            skills: ["Python", "Spark", "Kafka", "Airflow", "Data Lakes"],
            vendorId: vendor2.id,
          },
        ],
      });

      // Consultants for TechCorp
      await prisma.consultant.createMany({
        data: [
          {
            name: "Sarah Johnson",
            title: "Senior Full Stack Developer",
            experience: 7,
            skills: ["React", "Node.js", "TypeScript", "GraphQL", "MongoDB"],
            hourlyRate: 85,
            availability: "Available",
            bio: "Experienced full-stack developer with expertise in modern JavaScript frameworks and cloud-native applications.",
            vendorId: vendor1.id,
          },
          {
            name: "Mike Chen",
            title: "DevOps Engineer",
            experience: 5,
            skills: ["Docker", "Kubernetes", "AWS", "Terraform", "CI/CD"],
            hourlyRate: 95,
            availability: "Available",
            bio: "DevOps specialist with strong background in cloud infrastructure and automation.",
            vendorId: vendor1.id,
          },
          {
            name: "Emily Rodriguez",
            title: "Data Scientist",
            experience: 6,
            skills: ["Python", "TensorFlow", "SQL", "Machine Learning", "NLP"],
            hourlyRate: 110,
            availability: "Part-time",
            bio: "Data scientist with expertise in machine learning and predictive analytics.",
            vendorId: vendor1.id,
          },
        ],
      });

      // Consultants for InnovateIT
      await prisma.consultant.createMany({
        data: [
          {
            name: "David Kim",
            title: "Senior Java Developer",
            experience: 9,
            skills: ["Java", "Spring Boot", "Microservices", "Oracle", "Kafka"],
            hourlyRate: 90,
            availability: "Available",
            bio: "Senior Java developer with extensive experience in enterprise applications and microservices architecture.",
            vendorId: vendor2.id,
          },
          {
            name: "Lisa Wang",
            title: "Cloud Architect",
            experience: 11,
            skills: ["Azure", "AWS", "Kubernetes", "Terraform", "Microservices"],
            hourlyRate: 120,
            availability: "Available",
            bio: "Cloud architect with deep expertise in designing scalable cloud solutions for enterprise clients.",
            vendorId: vendor2.id,
          },
          {
            name: "Alex Thompson",
            title: "Data Engineer",
            experience: 6,
            skills: ["Python", "Spark", "Kafka", "Airflow", "Data Lakes"],
            hourlyRate: 100,
            availability: "Available",
            bio: "Data engineer specializing in building robust data pipelines and ETL processes.",
            vendorId: vendor2.id,
          },
        ],
      });

      // Contracts for TechCorp
      await prisma.contract.createMany({
        data: [
          {
            title: "E-commerce Platform Development",
            description: "Full-stack development of a modern e-commerce platform with React frontend and Node.js backend",
            type: "Fixed Price",
            startDate: new Date("2024-01-15"),
            endDate: new Date("2024-06-15"),
            value: 150000,
            currency: "USD",
            status: "Active",
            vendorId: vendor1.id,
          },
          {
            title: "DevOps Infrastructure Setup",
            description: "Setting up CI/CD pipelines and cloud infrastructure for a fintech startup",
            type: "Time & Material",
            startDate: new Date("2024-03-01"),
            endDate: new Date("2024-08-01"),
            value: 75000,
            currency: "USD",
            status: "Active",
            vendorId: vendor1.id,
          },
        ],
      });

      // Contracts for InnovateIT
      await prisma.contract.createMany({
        data: [
          {
            title: "Banking System Modernization",
            description: "Legacy system modernization for a regional bank using Java microservices",
            type: "Fixed Price",
            startDate: new Date("2024-02-01"),
            endDate: new Date("2024-12-01"),
            value: 300000,
            currency: "USD",
            status: "Active",
            vendorId: vendor2.id,
          },
          {
            title: "Data Lake Implementation",
            description: "Building a comprehensive data lake solution for analytics and reporting",
            type: "Time & Material",
            startDate: new Date("2024-04-01"),
            endDate: new Date("2024-10-01"),
            value: 120000,
            currency: "USD",
            status: "Active",
            vendorId: vendor2.id,
          },
        ],
      });

      // Services for TechCorp
      await prisma.service.createMany({
        data: [
          {
            name: "Custom Web Application Development",
            description: "End-to-end development of custom web applications using modern technologies",
            category: "Development",
            minDuration: 30,
            maxDuration: 180,
            basePrice: 25000,
            currency: "USD",
            vendorId: vendor1.id,
          },
          {
            name: "Cloud Migration Services",
            description: "Complete cloud migration strategy and implementation",
            category: "Consulting",
            minDuration: 60,
            maxDuration: 120,
            basePrice: 50000,
            currency: "USD",
            vendorId: vendor1.id,
          },
          {
            name: "Machine Learning Model Development",
            description: "Custom ML model development and deployment",
            category: "Development",
            minDuration: 45,
            maxDuration: 90,
            basePrice: 35000,
            currency: "USD",
            vendorId: vendor1.id,
          },
        ],
      });

      // Services for InnovateIT
      await prisma.service.createMany({
        data: [
          {
            name: "Enterprise Java Development",
            description: "Large-scale Java application development with microservices architecture",
            category: "Development",
            minDuration: 60,
            maxDuration: 240,
            basePrice: 40000,
            currency: "USD",
            vendorId: vendor2.id,
          },
          {
            name: "Cloud Architecture Design",
            description: "Comprehensive cloud architecture design and implementation",
            category: "Consulting",
            minDuration: 30,
            maxDuration: 90,
            basePrice: 35000,
            currency: "USD",
            vendorId: vendor2.id,
          },
          {
            name: "Data Engineering Solutions",
            description: "End-to-end data engineering including ETL, data lakes, and analytics",
            category: "Development",
            minDuration: 45,
            maxDuration: 120,
            basePrice: 30000,
            currency: "USD",
            vendorId: vendor2.id,
          },
        ],
      });

      console.log('Database seeded successfully!');
      return { message: 'Database seeded successfully!' };
    } catch (error) {
      console.error('Error seeding database:', error);
      throw error;
    }
  }
} 