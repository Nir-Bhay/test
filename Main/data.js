/**
 * Sinha Library Website Data
 * This file contains all the data used across the Sinha Library website
 * Created by: Dipu Kumar
 * Last updated: May 23, 2025
 */

const sinhaLibraryData = {
    // General Information
    general: {
        name: "Sinha Library",
        tagline: "Your Perfect Study Sanctuary",
        description: "A modern space designed for focused learning, collaboration, and academic excellence.",
        establishedDate: "July 21, 2023",
        email: "sinhalibrary9700@gmail.com",
        phone: "+91 7319692439",
        address: "Dhaiya Rd, opp. to CMRI gate, near Hotel SG International, Surya Vihar Colony, Dhanbad, Jharkhand 826001",
        mapLink: "https://maps.app.goo.gl/FPFaqKvu8oLaMqrm9",
        socialMedia: {
            instagram: "https://www.instagram.com/sinhalibrary?utm_source=qr&igsh=a2diYWV2d200NzRw",
            facebook: "#",
            whatsapp: "#"
        }
    },
    
    // Stats Information
    stats: [
        {
            icon: "fas fa-users",
            count: 560,
            label: "Happy Members"
        },
        {
            icon: "fas fa-clock",
            count: "24/7",
            label: "Open Hours"
        },
        {
            icon: "fas fa-briefcase",
            count: "Many",
            label: "Government Jobs"
        },
        {
            icon: "fas fa-user-graduate",
            count: 69,
            label: "Active Students"
        }
    ],
    
    // About Section
    about: {
        title: "About Us",
        subtitle: "Empowering students with knowledge since 2023",
        image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
        mission: {
            title: "Our Mission",
            icon: "fas fa-bullseye",
            description: "To provide students with a quiet and comfortable environment to study and access a vast collection of resources. Our library is equipped with modern facilities and a friendly staff ready to assist you."
        },
        achievements: {
            title: "Our Achievements",
            icon: "fas fa-trophy",
            description: "Since our opening, many of our students have successfully secured positions in various competitive exams, including banking, SSC, railways, and other government jobs."
        },
        values: {
            title: "Our Values",
            icon: "fas fa-book-reader",
            description: "We take pride in providing a conducive environment for serious study, equipped with all necessary resources including books, newspapers, journals, and digital resources."
        },
        features: [
            {
                icon: "fas fa-wifi",
                title: "Free WiFi",
                description: "High-speed internet for research"
            },
            {
                icon: "fas fa-coffee",
                title: "Coffee Corner",
                description: "Stay refreshed while studying"
            },
            {
                icon: "fas fa-laptop",
                title: "Digital Resources",
                description: "Access to online databases"
            },
            {
                icon: "fas fa-chalkboard-teacher",
                title: "Expert Guidance",
                description: "Mentoring from professionals"
            }
        ]
    },
    
    // Services Section
    services: [
        {
            icon: "https://cdn-icons-png.flaticon.com/512/2641/2641409.png",
            title: "Personal Study Desk",
            description: "Individual study desks designed for maximum comfort and focus, with ergonomic seating and proper lighting."
        },
        {
            icon: "https://cdn-icons-png.flaticon.com/512/2280/2280532.png",
            title: "CCTV Surveillance",
            description: "24/7 security monitoring to ensure a safe and secure environment for all our members."
        },
        {
            icon: "https://cdn-icons-png.flaticon.com/512/1584/1584892.png",
            title: "Air Conditioning",
            description: "Climate-controlled environment for comfortable studying regardless of outside weather conditions."
        },
        {
            icon: "https://cdn-icons-png.flaticon.com/512/2830/2830312.png",
            title: "Dedicated Charging Points",
            description: "Individual charging points and lighting for each study desk to ensure uninterrupted study sessions."
        },
        {
            icon: "https://cdn-icons-png.flaticon.com/512/708/708949.png",
            title: "Parking Area",
            description: "Spacious parking area with clear signage for convenient and safe parking of your vehicles."
        },
        {
            icon: "https://cdn-icons-png.flaticon.com/512/2794/2794229.png",
            title: "High-Speed Wi-Fi",
            description: "Reliable internet connectivity for research and online study materials access."
        },
        {
            icon: "https://cdn-icons-png.flaticon.com/512/3145/3145765.png",
            title: "Reference Materials",
            description: "Extensive collection of reference books and study materials for competitive exams."
        },
        {
            icon: "https://cdn-icons-png.flaticon.com/512/2935/2935441.png",
            title: "Refreshment Area",
            description: "Dedicated space for breaks with refreshment facilities to recharge during long study sessions."
        }
    ],
    
    // Contact Section
    contact: {
        title: "Contact Us",
        subtitle: "Get in touch with us for any inquiries or to schedule a visit",
        cards: [
            {
                icon: "fas fa-map-marker-alt",
                title: "Visit Us",
                content: "Dhaiya Rd, opp. to CMRI gate, near Hotel SG International, Surya Vihar Colony, Dhanbad, Jharkhand 826001",
                action: {
                    text: "Get Directions",
                    icon: "fas fa-directions",
                    link: "https://maps.app.goo.gl/FPFaqKvu8oLaMqrm9"
                }
            },
            {
                icon: "fas fa-phone-alt",
                title: "Call Us",
                content: "+91 7319692439",
                action: {
                    text: "Call Now",
                    icon: "fas fa-phone-alt",
                    link: "tel:+917319692439"
                }
            },
            {
                icon: "fas fa-envelope",
                title: "Email Us",
                content: "sinhalibrary9700@gmail.com",
                action: {
                    text: "Send Email",
                    icon: "fas fa-envelope",
                    link: "mailto:sinhalibrary9700@gmail.com"
                }
            }
        ],
        openingHours: [
            { day: "Monday", hours: "8:00 AM - 10:00 PM" },
            { day: "Tuesday", hours: "8:00 AM - 10:00 PM" },
            { day: "Wednesday", hours: "8:00 AM - 10:00 PM" },
            { day: "Thursday", hours: "8:00 AM - 10:00 PM" },
            { day: "Friday", hours: "8:00 AM - 10:00 PM" },
            { day: "Saturday", hours: "8:00 AM - 10:00 PM" },
            { day: "Sunday", hours: "8:00 AM - 10:00 PM" }
        ],
        formSubjects: [
            { value: "membership", label: "Membership Inquiry" },
            { value: "facilities", label: "Facilities Information" },
            { value: "feedback", label: "Feedback" },
            { value: "other", label: "Other" }
        ]
    },
    
    // Developer Information
    developer: {
        name: "Dipu Kumar",
        role: "Full-stack developer managing both frontend and backend of Sinha Library website.",
        description: "Passionate about creating user-friendly digital experiences that help students succeed.",
        email: "dipukumardevcod@gmail.com",
        github: "#"
    },
    
    // Hero Carousel Images
    heroImages: [
        {
            src: "./image/Student_image/image 2.jpg",
            alt: "Modern Library Study Area"
        },
        {
            src: "./image/Student_image/image 3.jpg",
            alt: "Library Books"
        },
        {
            src: "./image/Student_image/image 5.jpg",
            alt: "Modern Study Space"
        },
        {
            src: "./image/Student_image/image 6.jpg",
            alt: "Students Collaborating"
        }
    ]
};

// API URL Configuration
// Define the API URL for the backend
const getApiUrl = () => {
    return 'https://test-gcwv.onrender.com'; // Backend URL
};

// Export the data for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { getApiUrl, sinhaLibraryData };
} else {
    // For browser usage
    window.getApiUrl = getApiUrl;
    window.sinhaLibraryData = sinhaLibraryData;
}