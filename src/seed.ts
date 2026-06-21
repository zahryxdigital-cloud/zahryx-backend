import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { Admin } from './models/Admin';
import { Blog } from './models/Blog';
import { Project } from './models/Project';
import { Testimonial } from './models/Testimonial';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://mdfaisalansari:grantmeaccess@cluster0.vypmgdq.mongodb.net/zahryx';

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding process...');
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB.');

    // Clear existing data
    await Admin.deleteMany({});
    await Blog.deleteMany({});
    await Project.deleteMany({});
    await Testimonial.deleteMany({});
    console.log('Cleared existing records.');

    // 1. Seed Admin
    const hashedPassword = await bcrypt.hash('zahryxadminpassword', 12);
    const admin = await Admin.create({
      name: 'Zahryx Administrator',
      email: 'admin@zahryxdigital.com',
      password: hashedPassword,
      role: 'admin'
    });
    console.log('✅ Default Admin created: admin@zahryxdigital.com / zahryxadminpassword');

    // 2. Seed Testimonials
    const testimonials = await Testimonial.create([
      {
        name: 'Sarah Jenkins',
        role: 'Founder',
        company: 'Pulse Gym & Fitness',
        review: 'Zahryx Digital completely transformed our local gym. Our online booking rate grew by 140% in just two months. The mobile interface is absolutely stunning!',
        rating: 5,
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
        businessType: 'Gym & Fitness'
      },
      {
        name: 'Rahul Mehta',
        role: 'Lead Artist',
        company: 'Mehta Mehendi Creations',
        review: 'Having a luxury-focused portfolio website changed how clients value my work. Zahryx built a dynamic showcase that highlights the intricate details of my mehendi designs.',
        rating: 5,
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
        businessType: 'Mehendi/Henna Artists'
      },
      {
        name: 'Chef Marco Rossi',
        role: 'Owner & Executive Chef',
        company: 'Bella Italia Bistro',
        review: 'Our new menu reservation system has been flawless. Customers constantly compliment how clean and professional the design looks on their iPhones. Highly recommended!',
        rating: 5,
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
        businessType: 'Cafes & Restaurants'
      },
      {
        name: 'Elena Rostova',
        role: 'Director of Marketing',
        company: 'Apex Real Estate',
        review: 'We needed a highly responsive layout with quick filters for our home listings. Zahryx delivered a fast, optimized, and gorgeous platform that integrates perfectly with our leads database.',
        rating: 5,
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
        businessType: 'Real Estate'
      }
    ]);
    console.log(`✅ Seeded ${testimonials.length} client testimonials.`);

    // 3. Seed Projects (Case studies with mockups & redesign highlights)
    const projects = await Project.create([
      {
        title: 'Pulse Gym Redesign',
        description: 'A premium transformation of a local boutique gym website, incorporating class schedules, coach portals, and integrated subscription payments that drove high membership conversions.',
        client: 'Pulse Gym',
        category: 'Gyms & Fitness',
        tags: ['Web Design', 'GSAP Animations', 'Booking Integration'],
        coverImage: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=600',
        beforeImage: 'https://images.unsplash.com/photo-1594882645126-14020914d58d?auto=format&fit=crop&q=80&w=600', // Mock representation of an old website view
        afterImage: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=600',
        projectUrl: 'https://pulse-gym.zahryx.com',
        growth: '+140% Member Signups',
        featured: true
      },
      {
        title: 'Mehta Mehendi Luxury Portfolio',
        description: 'High-end visual showcase for an elite mehendi artist. Created a high-density image layout with responsive slider galleries that capture high-resolution design details.',
        client: 'Mehta Mehendi',
        category: 'Mehendi/Henna Artists',
        tags: ['Portfolio', 'Image Compression', 'SEO Optimization'],
        coverImage: 'https://images.unsplash.com/photo-1590004953392-5aba2e72269a?auto=format&fit=crop&q=80&w=600',
        beforeImage: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=600',
        afterImage: 'https://images.unsplash.com/photo-1590004953392-5aba2e72269a?auto=format&fit=crop&q=80&w=600',
        projectUrl: 'https://mehta-mehendi.zahryx.com',
        growth: '+85% Inquiries',
        featured: true
      },
      {
        title: 'Bella Italia Digital Reservation',
        description: 'Interactive and mobile-responsive website featuring online table booking, interactive menu views, and optimized speed loading under 0.8 seconds.',
        client: 'Bella Italia Restaurant',
        category: 'Cafes & Restaurants',
        tags: ['Next.js', 'Online Reservation', 'Custom Typography'],
        coverImage: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=600',
        beforeImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=600',
        afterImage: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=600',
        projectUrl: 'https://bella-italia.zahryx.com',
        growth: '+92% Direct Bookings',
        featured: true
      }
    ]);
    console.log(`✅ Seeded ${projects.length} digital agency projects.`);

    // 4. Seed Blogs (SEO optimized)
    const blogs = await Blog.create([
      {
        title: '5 Crucial Secrets to Rank Your Local Gym Website on Google',
        slug: 'local-gym-seo-secrets',
        excerpt: 'Discover the exact Local SEO setup strategies that bring fresh gym memberships through organic search queries.',
        content: `## Why Local SEO is the Secret Weapon for Gym Owners

For small, local fitness centers and gyms, showing up in Google's **"Map Pack"** or "Gym near me" searches represents 80% of new monthly visitors.

### 1. Optimize Your Google Business Profile
First things first. You must register and claim your Google Business Profile (GBP).
- Fill out your description using relevant keywords like "Boutique Strength Gym".
- Upload high-resolution images of your equipment, locker rooms, and coaches weekly.
- Gather feedback from your members directly using dynamic short links.

### 2. Fast Loading Speeds & Core Web Vitals
If a user searches for a local gym on their mobile phone and your site takes longer than **3 seconds** to load, they will swipe back to search results.
- Implement lazy-loading for images.
- Reduce font size variations.
- Avoid large, blocking JS script loads.

### 3. Local Citations & Business Schema
Make sure you include your precise **Name, Address, and Phone Number (NAP)** in the footer of your website. Embed JSON-LD LocalBusiness schemas inside the header to declare your operating hours and coordinates clearly to web crawling robots.
`,
        category: 'Local SEO',
        tags: ['SEO', 'Gyms', 'Small Business'],
        coverImage: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=600',
        readTime: '6 min read',
        published: true,
        seoTitle: 'Local Gym SEO Guide | Step-by-Step Membership Growth',
        seoDescription: 'Boost your boutique fitness studio membership with these five highly effective local SEO secrets tailored specifically for gym owners.'
      },
      {
        title: 'Why a Premium Menu Beats a PDF Menu for Local Restaurants',
        slug: 'pdf-versus-interactive-restaurant-menu',
        excerpt: 'Stop forcing customers to download slow PDFs on their smartphones. Learn how responsive interactive menus increase average order values.',
        content: `## The Modern Diner is Mobile-First

We have all done it: sitting at a beautiful restaurant table, trying to scan a QR code, only to wait 15 seconds for a 12MB PDF of the drink menu to download on our phone. 

PDF menus are terrible for user experience, mobile styling, and Google crawlers.

### The Downside of PDF Menus
- **Terrible Scaling**: Diners have to constantly zoom in and scroll left-to-right to read font sizes of appetizers.
- **No Search Discoverability**: Google cannot parse menu items dynamically to serve queries like "best lasagna near me."
- **Slow Performance**: Large files strain local LTE and 4G connections inside historic brick buildings.

### The Interactive Alternative
An interactive, lightweight, built-in website menu allows instant loading, smooth categorization (Appetizers, Mains, Cocktails), CSS-styled elegant fonts, beautiful high-quality picture previews, and direct table-side ordering integrations.
`,
        category: 'Web Design',
        tags: ['Restaurants', 'UX Design', 'Local Business'],
        coverImage: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80&w=600',
        readTime: '4 min read',
        published: true,
        seoTitle: 'Interactive Restaurant Web Menus vs PDF Menus | Zahryx',
        seoDescription: 'Discover why switching from slow PDF menus to premium responsive web menus increases diner conversion and elevates branding.'
      }
    ]);
    console.log(`✅ Seeded ${blogs.length} SEO optimized blogs.`);

    console.log('🎉 Database seeding successfully completed.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding process encountered an error:', error);
    process.exit(1);
  }
};

seedDatabase();
