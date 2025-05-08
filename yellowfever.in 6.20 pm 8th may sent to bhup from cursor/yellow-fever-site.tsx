"use client"
import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  ChevronDown,
  Facebook,
  Search,
  Twitter,
  Upload,
  Download,
  Calendar,
  MapPin,
  Phone,
  Mail,
  ExternalLink,
  FileText,
  Book,
  Users,
  Globe,
  AlertCircle,
  FileQuestion,
  Shield,
  ClockIcon,
  AppleIcon,
  SmartphoneIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function YellowFeverVaccinationSite() {
  const [searchQuery, setSearchQuery] = useState("")
  const [openSections, setOpenSections] = useState({
    introduction: true,
    vaccineInfo: false,
    procedure: false,
    specifications: false,
    endemicCountries: false,
    vaccineBooster: false,
    noticeCircular: false,
  })
  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }
  const [openFAQSections, setOpenFAQSections] = useState({
    general: false,
    beforeVaccination: false,
    afterVaccination: false,
    travelRequirements: false,
    sideEffects: false,
    specialCases: false,
  })
  const toggleFAQSection = (section: keyof typeof openFAQSections) => {
    setOpenFAQSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }
  // State to track which page is currently active
  const [activePage, setActivePage] = useState("Home") // Default to Home
  // Handle navigation click
  const handleNavClick = (item: string) => {
    setActivePage(item)
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top blue bar */}
      <div className="bg-blue-600 text-white py-2 px-4 flex items-center justify-between">
        <div className="flex items-center">
          <Image src="/diverse-flags.png" alt="Flag" width={36} height={24} className="mr-2" />
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <Upload size={16} className="mr-1" />
            <span className="text-sm">Screen Access Reader</span>
          </div>
          <div className="flex items-center space-x-1">
            <Button variant="outline" size="sm" className="h-6 w-6 bg-white text-black font-bold p-0">A-</Button>
            <Button variant="outline" size="sm" className="h-6 w-6 bg-white text-black font-bold p-0">A</Button>
            <Button variant="outline" size="sm" className="h-6 w-6 bg-white text-black font-bold p-0">A+</Button>
          </div>
          <div className="flex items-center space-x-2">
            <Twitter size={16} />
            <Facebook size={16} />
          </div>
        </div>
      </div>
      {/* Header with logo and search */}
      <header className="bg-white py-4 px-6 border-b">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center">
            <Image src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/hope%20hospital%20youtube%20logo-PiORnz9bxpvolYsNVD1Vgtz7yDDirJ.png" alt="Hope Hospital Logo" width={200} height={60} className="mr-4" />
            <div className="text-sm max-w-xs">
              <p className="font-semibold">Hope International Medical Institute</p>
              <p>Center for Tropical Disease Prevention</p>
              <p>Global Health & Vaccination Services</p>
            </div>
          </div>
          {/* Search bar positioned at the top */}
          <div className="w-full md:w-1/3 order-first md:order-none">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border rounded-md"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
          </div>
          <Image src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/hope%20hospital%20youtube%20logo-PiORnz9bxpvolYsNVD1Vgtz7yDDirJ.png" alt="Hope Hospital Logo" width={80} height={30} className="bg-white p-1 rounded-md" />
        </div>
      </header>
      {/* Navigation */}
      <nav className="bg-white border-b">
        <div className="container mx-auto px-4">
          <ul className="flex flex-wrap">
            {[
              "Home",
              "About Us",
              "Point of Entries",
              "Yellow Fever",
              "FAQ",
              "Resources",
              "Patient Charter",
              "Gallery",
              "eServices",
            ].map((item) => (
              <li
                key={item}
                className={`relative ${item === activePage ? "border-b-2 border-blue-500" : ""}`}
              >
                <Link
                  href="#"
                  className="block px-4 py-4 text-sm hover:bg-gray-100 flex items-center"
                  onClick={() => handleNavClick(item)}
                >
                  {item}
                  {[
                    "About Us",
                    "Point of Entries",
                    "Yellow Fever",
                    "FAQ",
                    "Resources",
                    "Patient Charter",
                  ].includes(item) && <ChevronDown size={16} className="ml-1" />}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
      {/* Breadcrumb */}
      <div className="bg-gray-100 py-4">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold">{activePage}</h1>
            <div className="text-sm">
              <Link
                href="#"
                className="text-blue-500 hover:underline"
                onClick={() => handleNavClick("Home")}
              >
                Home
              </Link>
              <span className="mx-2">/</span>
              <span>{activePage}</span>
            </div>
          </div>
        </div>
      </div>
      {/* Main content */}
      <main className="container mx-auto px-4 py-6 flex-grow">
        {/* Home Page */}
        {activePage === "Home" && (
          <div className="space-y-8">
            <div className="relative rounded-xl overflow-hidden">
              <Image src="/placeholder.svg?key=hero-image&text=Global%20Health%20Initiative" alt="Global Health Initiative" width={1200} height={400} className="w-full h-[400px] object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-900/70 to-transparent flex items-center">
                <div className="p-8 max-w-xl">
                  <div className="bg-white/90 p-3 rounded-lg inline-block mb-6">
                    <Image src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/hope%20hospital%20youtube%20logo-PiORnz9bxpvolYsNVD1Vgtz7yDDirJ.png" alt="Hope Hospital Logo" width={200} height={70} />
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-4"> Protecting Global Health Through Prevention </h2>
                  <p className="text-white text-lg mb-6"> Hope International Medical Institute is dedicated to disease prevention, research, and healthcare services worldwide. </p>
                  <div className="flex flex-wrap gap-3">
                    <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => { const modal = document.getElementById('services-modal') as HTMLDialogElement; if (modal) modal.showModal(); }}>Learn About Our Services</Button>
                    <Button variant="outline" className="bg-white text-blue-600 hover:bg-blue-50" onClick={() => { const modal = document.getElementById('find-center-modal') as HTMLDialogElement; if (modal) modal.showModal(); }}> Find a Vaccination Center </Button>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                <div className="bg-blue-100 p-3 rounded-full w-fit mb-4">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Vaccination Services</h3>
                <p className="text-gray-600 mb-4"> Access international vaccination services including Yellow Fever, Typhoid, Hepatitis, and more at our certified centers. </p>
                <Link href="#" className="text-blue-600 font-medium flex items-center hover:underline" onClick={() => handleNavClick("Yellow Fever")} > Learn more <ChevronDown className="h-4 w-4 ml-1 rotate-[-90deg]" /> </Link>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                <div className="bg-blue-100 p-3 rounded-full w-fit mb-4">
                  <Globe className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Travel Health</h3>
                <p className="text-gray-600 mb-4"> Get expert advice on travel health requirements, vaccination certificates, and preventive measures for your destination. </p>
                <Link href="#" className="text-blue-600 font-medium flex items-center hover:underline" onClick={() => handleNavClick("Resources")} > Learn more <ChevronDown className="h-4 w-4 ml-1 rotate-[-90deg]" /> </Link>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                <div className="bg-blue-100 p-3 rounded-full w-fit mb-4">
                  <Book className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Research & Education</h3>
                <p className="text-gray-600 mb-4"> Explore our latest research findings, educational resources, and training programs in tropical medicine. </p>
                <Link href="#" className="text-blue-600 font-medium flex items-center hover:underline" onClick={() => handleNavClick("Resources")} > Learn more <ChevronDown className="h-4 w-4 ml-1 rotate-[-90deg]" /> </Link>
              </div>
            </div>
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="mb-4 md:mb-0 md:mr-6">
                  <h3 className="text-xl font-semibold text-blue-700 mb-2">Need Vaccination Certificates?</h3>
                  <p className="text-gray-600"> Schedule an appointment at one of our authorized vaccination centers for international travel requirements. </p>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700 whitespace-nowrap" onClick={() => {const modal = document.getElementById('book-appointment-modal') as HTMLDialogElement; if (modal) modal.showModal();}}>Book an Appointment</Button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <AlertCircle className="h-5 w-5 text-blue-600 mr-2" /> Latest Health Alerts
                </h3>
                <div className="space-y-4">
                  {[
                    { date: "May 1, 2025", title: "Yellow Fever Outbreak in Central Region", desc: "Health authorities report new cases of Yellow Fever in the Central Region. Travelers advised to ensure vaccination.", },
                    { date: "April 28, 2025", title: "Updated Travel Requirements for South America", desc: "Several South American countries have updated their vaccination requirements for international travelers.", },
                    { date: "April 15, 2025", title: "New Vaccination Center Opening", desc: "HIMI announces the opening of a new vaccination center in the Eastern District, expanding service availability.", },
                  ].map((alert, index) => (
                    <div key={index} className="border-b border-gray-200 pb-4 last:border-0 last:pb-0">
                      <p className="text-sm text-gray-500">{alert.date}</p>
                      <h4 className="font-medium text-blue-700">{alert.title}</h4>
                      <p className="text-sm text-gray-600">{alert.desc}</p>
                    </div>
                  ))}
                </div>
                <Link href="#" className="text-blue-600 font-medium flex items-center mt-4 hover:underline" onClick={() => handleNavClick("Resources")} > View all alerts <ChevronDown className="h-4 w-4 ml-1 rotate-[-90deg]" /> </Link>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <Calendar className="h-5 w-5 text-blue-600 mr-2" /> Upcoming Events
                </h3>
                <div className="space-y-4">
                  {[
                    { date: "May 15, 2025", title: "World Vaccination Awareness Day", desc: "Join our webinar on the importance of vaccination for global health security.", },
                    { date: "June 2-4, 2025", title: "International Tropical Medicine Conference", desc: "Annual conference featuring the latest research in tropical medicine and infectious diseases.", },
                    { date: "June 20, 2025", title: "Community Health Workshop", desc: "Free workshop on preventive health measures for community health workers.", },
                  ].map((event, index) => (
                    <div key={index} className="border-b border-gray-200 pb-4 last:border-0 last:pb-0">
                      <p className="text-sm text-gray-500">{event.date}</p>
                      <h4 className="font-medium text-blue-700">{event.title}</h4>
                      <p className="text-sm text-gray-600">{event.desc}</p>
                    </div>
                  ))}
                </div>
                <Link href="#" className="text-blue-600 font-medium flex items-center mt-4 hover:underline" onClick={() => handleNavClick("Resources")} > View all events <ChevronDown className="h-4 w-4 ml-1 rotate-[-90deg]" /> </Link>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 mt-8">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-2/3">
                  <h2 className="text-2xl font-bold text-blue-700 mb-4">Yellow Fever Vaccination in Nagpur</h2>
                  <p className="text-gray-700 mb-4"> Hope Hospital in Nagpur is a recognized center for yellow fever vaccination. We provide valid international vaccination certificates, which are essential for travelers to certain African and South American countries. </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-blue-700 mb-2">Why Choose Hope Hospital?</h3>
                      <ul className="space-y-2 text-gray-700">
                        <li className="flex items-start">
                          <div className="text-blue-500 mr-2">•</div>
                          <span>Internationally recognized vaccination certificates</span>
                        </li>
                        <li className="flex items-start">
                          <div className="text-blue-500 mr-2">•</div>
                          <span>Experienced medical professionals</span>
                        </li>
                        <li className="flex items-start">
                          <div className="text-blue-500 mr-2">•</div>
                          <span>Convenient appointment scheduling</span>
                        </li>
                        <li className="flex items-start">
                          <div className="text-blue-500 mr-2">•</div>
                          <span>Central location in Nagpur</span>
                        </li>
                      </ul>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-blue-700 mb-2">Important Information</h3>
                      <ul className="space-y-2 text-gray-700">
                        <li className="flex items-start">
                          <div className="text-blue-500 mr-2">•</div>
                          <span>Get vaccinated at least 10 days before travel</span>
                        </li>
                        <li className="flex items-start">
                          <div className="text-blue-500 mr-2">•</div>
                          <span>Bring identification and travel documents</span>
                        </li>
                        <li className="flex items-start">
                          <div className="text-blue-500 mr-2">•</div>
                          <span>Certificate valid for life per WHO guidelines</span>
                        </li>
                        <li className="flex items-start">
                          <div className="text-blue-500 mr-2">•</div>
                          <span>Contact us to confirm vaccine availability</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-yellow-700"> <strong>Note:</strong> For a more affordable option, the Daga Memorial Government Women Hospital in Nagpur is also listed as a yellow fever vaccination center. However, its operational status may vary. It's recommended to contact them directly to verify current services. </p>
                      </div>
                    </div>
                  </div>
                  <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => {const modal = document.getElementById('schedule-nagpur-modal') as HTMLDialogElement; if(modal) modal.showModal();}}>Schedule Your Vaccination</Button>
                </div>
                <div className="md:w-1/3">
                  <div className="bg-gradient-to-b from-blue-50 to-white p-5 rounded-lg border border-blue-100 shadow-sm">
                    <div className="flex items-center justify-center mb-4">
                      <Image src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/hope%20hospital%20youtube%20logo-PiORnz9bxpvolYsNVD1Vgtz7yDDirJ.png" alt="Hope Hospital Logo" width={120} height={40} className="border-2 border-blue-200 p-2 bg-white rounded-lg" />
                    </div>
                    <h4 className="font-semibold text-blue-700 text-center mb-4">Contact Details</h4>
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <MapPin className="h-5 w-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-gray-600">2, Teka Naka, Kamptee Road, Nagpur, Maharashtra, 440012</p>
                      </div>
                      <div className="flex items-start">
                        <Phone className="h-5 w-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm text-gray-600">Toll Free: 18002330000</p>
                          <p className="text-sm text-gray-600">Mobile: +91 99235 55053</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <Mail className="h-5 w-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-gray-600">Email: info@hopehospital.com</p>
                      </div>
                      <div className="flex items-start">
                        <Globe className="h-5 w-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-gray-600">Website: hopehospital.com</p>
                      </div>
                      <div className="flex items-start">
                        <ClockIcon className="h-5 w-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-gray-600">Hours: 9:00 AM - 6:00 PM (Daily)</p>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-blue-100">
                      <Button variant="outline" className="w-full border-blue-600 text-blue-600 hover:bg-blue-50" onClick={() => {const modal = document.getElementById('get-directions-modal') as HTMLDialogElement; if (modal) modal.showModal();}}> Get Directions </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* About Us Page */}
        {activePage === "About Us" && (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
            <div className="bg-gradient-to-r from-blue-700 to-blue-600 text-white p-8">
              <h2 className="text-3xl font-bold mb-2">About Hope International Medical Institute</h2>
              <p className="text-lg opacity-90"> Advancing global health through research, education, and service since 1978 </p>
            </div>
            <div className="p-6">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="md:w-2/3">
                  <section className="mb-10">
                    <h3 className="text-2xl font-semibold text-blue-700 mb-4">Our Mission</h3>
                    <p className="text-gray-700 mb-4"> Hope International Medical Institute (HIMI) is dedicated to improving global health outcomes through innovative research, comprehensive education, and compassionate service. We strive to reduce the burden of tropical and infectious diseases worldwide, with a particular focus on underserved populations and regions. </p>
                    <p className="text-gray-700"> Founded in 1978 by Dr. Eleanor Blackwell and Dr. James Thornton, HIMI has grown from a small research facility in Geneva to a global network of 28 centers across 17 countries, employing over 3,500 healthcare professionals, researchers, and support staff. </p>
                  </section>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <div className="bg-blue-50 p-5 rounded-lg border border-blue-100">
                      <div className="text-blue-600 text-4xl font-bold mb-2">47</div>
                      <p className="text-gray-700">Years of service to global health</p>
                    </div>
                    <div className="bg-blue-50 p-5 rounded-lg border border-blue-100">
                      <div className="text-blue-600 text-4xl font-bold mb-2">17M+</div>
                      <p className="text-gray-700">Vaccines administered worldwide</p>
                    </div>
                    <div className="bg-blue-50 p-5 rounded-lg border border-blue-100">
                      <div className="text-blue-600 text-4xl font-bold mb-2">124</div>
                      <p className="text-gray-700">Research publications annually</p>
                    </div>
                  </div>
                  <section className="mb-10">
                    <h3 className="text-2xl font-semibold text-blue-700 mb-4"> Center for Tropical Disease Prevention </h3>
                    <p className="text-gray-700 mb-4"> Established in 1992, our Center for Tropical Disease Prevention (CTDP) leads global efforts in preventing and controlling tropical diseases through cutting-edge research, surveillance programs, and intervention strategies. The CTDP operates specialized laboratories equipped with BSL-3 and BSL-4 facilities for studying high-risk pathogens. </p>
                    <p className="text-gray-700 mb-4">Key achievements of the CTDP include:</p>
                    <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
                      <li> Development of rapid diagnostic tests for dengue fever, reducing diagnosis time from days to minutes </li>
                      <li> Implementation of community-based vector control programs that reduced malaria incidence by 68% in pilot regions </li>
                      <li> Creation of the Global Tropical Disease Surveillance Network, connecting 230 field stations across 42 countries </li>
                      <li>Pioneering research on climate change impacts on vector-borne disease distribution</li>
                    </ul>
                    <p className="text-gray-700"> Under the leadership of Dr. Sophia Chen, the CTDP collaborates with the World Health Organization, national health ministries, and academic institutions to develop evidence-based prevention strategies and policy recommendations. </p>
                  </section>
                  <section className="mb-10">
                    <h3 className="text-2xl font-semibold text-blue-700 mb-4">Global Health & Vaccination Services</h3>
                    <p className="text-gray-700 mb-4"> Our Global Health & Vaccination Services (GHVS) division translates research into practical healthcare solutions. Founded in 1998, GHVS operates vaccination centers in 42 countries and provides consultation services for travelers, expatriates, and local populations. </p>
                    <p className="text-gray-700 mb-4">The GHVS is recognized for:</p>
                    <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
                      <li>Administering over 17 million vaccines, including 3.2 million yellow fever vaccinations</li>
                      <li> Training more than 12,000 healthcare professionals in vaccine administration and cold chain management </li>
                      <li> Developing the award-winning "VaxTrack" digital vaccination record system, now used in 28 countries </li>
                      <li> Leading emergency vaccination campaigns during disease outbreaks, including the 2021 response in East Africa </li>
                    </ul>
                    <p className="text-gray-700"> GHVS also maintains the International Travel Health Database, providing real-time information on disease outbreaks, vaccination requirements, and health advisories for 196 countries and territories. </p>
                  </section>
                  <section>
                    <h3 className="text-2xl font-semibold text-blue-700 mb-4">Research and Innovation</h3>
                    <p className="text-gray-700 mb-4"> Research excellence is at the core of HIMI's mission. Our research programs span basic science, clinical trials, epidemiology, and implementation science. The Institute's research budget of €87 million annually supports work across multiple disciplines. </p>
                    <p className="text-gray-700 mb-4">Notable research achievements include:</p>
                    <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
                      <li> Development of a thermostable yellow fever vaccine that doesn't require cold chain storage </li>
                      <li>Identification of novel biomarkers for early detection of dengue hemorrhagic fever</li>
                      <li> Creation of AI-powered disease prediction models that forecast outbreaks with 83% accuracy </li>
                      <li> Pioneering work on community engagement strategies that improve vaccination acceptance rates </li>
                    </ul>
                    <p className="text-gray-700"> HIMI researchers publish over 120 peer-reviewed articles annually and have been awarded 18 international patents for diagnostic and preventive technologies. </p>
                  </section>
                </div>
                <div className="md:w-1/3">
                  <div className="sticky top-4">
                    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
                      <div className="p-4 flex justify-center border-b">
                        <Image src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/hope%20hospital%20youtube%20logo-PiORnz9bxpvolYsNVD1Vgtz7yDDirJ.png" alt="Hope Hospital Logo" width={180} height={60} className="my-2" />
                      </div>
                      <Image src="/placeholder.svg?key=himi-headquarters&text=HIMI%20Headquarters" alt="HIMI Headquarters in Geneva" width={400} height={250} className="w-full h-auto" />
                      <div className="p-4">
                        <p className="text-sm text-gray-600">HIMI Headquarters in Geneva, Switzerland</p>
                      </div>
                    </div>
                    <div className="bg-blue-50 rounded-lg border border-blue-100 p-5 mb-6">
                      <h4 className="font-semibold text-blue-700 mb-3">Leadership</h4>
                      <div className="space-y-4">
                        <div className="flex items-start">
                          <div className="mr-3">
                            <Image src="/placeholder.svg?key=director-general&text=Director" alt="Dr. Amara Okafor" width={60} height={60} className="rounded-full" />
                          </div>
                          <div>
                            <h5 className="font-medium">Dr. Amara Okafor</h5>
                            <p className="text-sm text-gray-600">Director-General</p>
                            <p className="text-xs text-gray-500 mt-1"> Former WHO Regional Director, leading HIMI since 2019 </p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <div className="mr-3">
                            <Image src="/placeholder.svg?key=research-director&text=Research" alt="Dr. Miguel Sanchez" width={60} height={60} className="rounded-full" />
                          </div>
                          <div>
                            <h5 className="font-medium">Dr. Miguel Sanchez</h5>
                            <p className="text-sm text-gray-600">Director of Research</p>
                            <p className="text-xs text-gray-500 mt-1"> Virologist with 25+ years experience in tropical diseases </p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <div className="mr-3">
                            <Image src="/placeholder.svg?key=operations-director&text=Operations" alt="Dr. Sophia Chen" width={60} height={60} className="rounded-full" />
                          </div>
                          <div>
                            <h5 className="font-medium">Dr. Sophia Chen</h5>
                            <p className="text-sm text-gray-600">Director of CTDP</p>
                            <p className="text-xs text-gray-500 mt-1"> Epidemiologist specializing in vector-borne diseases </p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <div className="mr-3">
                            <Image src="/placeholder.svg?key=clinician-director&text=Clinician" alt="Dr. Murali BK" width={60} height={60} className="rounded-full" />
                          </div>
                          <div>
                            <h5 className="font-medium">Dr. Murali BK</h5>
                            <p className="text-sm text-gray-600">Chief Clinician & Orthopaedic Surgeon</p>
                            <p className="text-xs text-gray-500 mt-1"> 25+ years experience in tropical diseases, Hope Hospital, Nagpur </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-5 mb-6">
                      <h4 className="font-semibold text-blue-700 mb-3">Global Presence</h4>
                      <Image src="/placeholder.svg?key=global-map&text=Global%20Presence%20Map" alt="HIMI Global Presence Map" width={400} height={250} className="w-full h-auto rounded-md mb-3" />
                      <div className="p-4">
                        <p className="text-sm text-gray-600">HIMI Headquarters in Geneva, Switzerland</p>
                      </div>
                    </div>
                    <div className="bg-blue-600 text-white rounded-lg p-5">
                      <h4 className="font-semibold mb-3">Partner With Us</h4>
                      <p className="text-sm opacity-90 mb-4"> HIMI welcomes partnerships with governments, NGOs, academic institutions, and private sector organizations committed to improving global health. </p>
                      <div className="space-y-3">
                        <Button className="w-full bg-white text-blue-600 hover:bg-blue-50"> Contact Our Partnership Office </Button>
                        <Button className="w-full bg-transparent border border-white text-white hover:bg-blue-700" onClick={() => { const modal = document.getElementById('partnership-faq-modal') as HTMLDialogElement; if(modal) modal.showModal(); }} > Partnership FAQs </Button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-10 pt-6 border-t border-gray-200">
                  <h3 className="text-2xl font-semibold text-blue-700 mb-4">Our Values</h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-medium text-blue-700 mb-2">Excellence</h4>
                      <p className="text-sm text-gray-700"> We pursue the highest standards in research, education, and healthcare delivery. </p>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-medium text-blue-700 mb-2">Integrity</h4>
                      <p className="text-sm text-gray-700"> We conduct our work with honesty, transparency, and ethical responsibility. </p>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-medium text-blue-700 mb-2">Collaboration</h4>
                      <p className="text-sm text-gray-700"> We believe in the power of partnerships to achieve greater impact. </p>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-medium text-blue-700 mb-2">Innovation</h4>
                      <p className="text-sm text-gray-700"> We embrace creative solutions and cutting-edge approaches to global health challenges. </p>
                    </div>
                  </div>
                </div>
                <div className="mt-10 text-center">
                  <p className="text-gray-600">© 2025 Hope International Medical Institute. All rights reserved.</p>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Point of Entries Page */}
        {activePage === "Point of Entries" && (
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-6 text-white">
                <h2 className="text-2xl font-bold mb-2">Authorized Point of Entries</h2>
                <p> Official entry points with vaccination and health screening facilities for international travelers </p>
              </div>
              <div className="p-6">
                <p className="text-gray-700 mb-6"> Hope International Medical Institute maintains authorized Point of Entries with vaccination and health screening facilities. These locations serve as official entry and exit points for international travelers requiring health documentation and services. </p>
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-blue-700 mb-4">What are Points of Entry?</h3>
                  <p className="text-gray-700 mb-4"> Points of Entry (PoE) are designated international airports, seaports, and ground crossings where travelers can receive required health services, including vaccinations and health screenings. These facilities are equipped to issue International Certificates of Vaccination or Prophylaxis (ICVP) and provide health clearance for international travel. </p>
                  <p className="text-gray-700"> Our authorized PoE facilities are staffed with trained healthcare professionals who can administer vaccines, conduct health assessments, and provide travel health advice according to international health regulations. </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-blue-50 p-5 rounded-lg border border-blue-100">
                    <h4 className="font-semibold text-blue-700 mb-3">Services Available at Points of Entry</h4>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start">
                        <div className="text-blue-500 mr-2">•</div>
                        <span>Yellow Fever vaccination and certification</span>
                      </li>
                      <li className="flex items-start">
                        <div className="text-blue-500 mr-2">•</div>
                        <span>Health screening for infectious diseases</span>
                      </li>
                      <li className="flex items-start">
                        <div className="text-blue-500 mr-2">•</div>
                        <span>Issuance of International Certificates of Vaccination</span>
                      </li>
                      <li className="flex items-start">
                        <div className="text-blue-500 mr-2">•</div>
                        <span>Travel health consultation and advice</span>
                      </li>
                      <li className="flex items-start">
                        <div className="text-blue-500 mr-2">•</div>
                        <span>Medical exemption certificates (when applicable)</span>
                      </li>
                    </ul>
                  </div>
                  <div className="bg-blue-50 p-5 rounded-lg border border-blue-100">
                    <h4 className="font-semibold text-blue-700 mb-3">Requirements for Travelers</h4>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start">
                        <div className="text-blue-500 mr-2">•</div>
                        <span>Valid passport or travel document</span>
                      </li>
                      <li className="flex items-start">
                        <div className="text-blue-500 mr-2">•</div>
                        <span>Travel itinerary details</span>
                      </li>
                      <li className="flex items-start">
                        <div className="text-blue-500 mr-2">•</div>
                        <span>Previous vaccination records (if available)</span>
                      </li>
                      <li className="flex items-start">
                        <div className="text-blue-500 mr-2">•</div>
                        <span>Medical history information</span>
                      </li>
                      <li className="flex items-start">
                        <div className="text-blue-500 mr-2">•</div>
                        <span>Payment for services (varies by location)</span>
                      </li>
                    </ul>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-blue-700 mb-4">Authorized Point of Entry Locations</h3>
                <div className="overflow-x-auto mb-6">
                  <table className="min-w-full bg-white border border-gray-200">
                    <thead>
                      <tr className="bg-blue-100">
                        <th className="py-3 px-4 text-left border-b">Location</th>
                        <th className="py-3 px-4 text-left border-b">Type</th>
                        <th className="py-3 px-4 text-left border-b">Operating Hours</th>
                        <th className="py-3 px-4 text-left border-b">Contact Information</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">International Airport Terminal 1</td>
                        <td className="py-3 px-4">Airport</td>
                        <td className="py-3 px-4">8:00 AM - 8:00 PM (Daily)</td>
                        <td className="py-3 px-4">+41 22 123 4567</td>
                      </tr>
                      <tr className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">Central Port Health Office</td>
                        <td className="py-3 px-4">Seaport</td>
                        <td className="py-3 px-4">9:00 AM - 5:00 PM (Mon-Fri)</td>
                        <td className="py-3 px-4">+41 22 123 4568</td>
                      </tr>
                      <tr className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">Eastern Border Crossing Health Unit</td>
                        <td className="py-3 px-4">Land Crossing</td>
                        <td className="py-3 px-4">8:00 AM - 6:00 PM (Daily)</td>
                        <td className="py-3 px-4">+41 22 123 4569</td>
                      </tr>
                      <tr className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">Western District Health Center</td>
                        <td className="py-3 px-4">Urban Center</td>
                        <td className="py-3 px-4">9:00 AM - 4:00 PM (Mon-Sat)</td>
                        <td className="py-3 px-4">+41 22 123 4570</td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="py-3 px-4">Southern Regional Hospital</td>
                        <td className="py-3 px-4">Hospital</td>
                        <td className="py-3 px-4">24 Hours (By Appointment)</td>
                        <td className="py-3 px-4">+41 22 123 4571</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-yellow-700"> <strong>Important Notice:</strong> Appointments are strongly recommended for all vaccination services. Walk-in services may be limited based on capacity and vaccine availability. </p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="md:w-1/2">
                    <h3 className="text-xl font-semibold text-blue-700 mb-4">Find a Point of Entry</h3>
                    <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                      <div className="mb-4">
                        <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1"> Select Region </label>
                        <select id="location" className="w-full p-2 border border-gray-300 rounded-md">
                          <option value="">All Regions</option>
                          <option value="north">Northern Region</option>
                          <option value="south">Southern Region</option>
                          <option value="east">Eastern Region</option>
                          <option value="west">Western Region</option>
                          <option value="central">Central Region</option>
                        </select>
                      </div>
                      <div className="mb-4">
                        <label htmlFor="facility-type" className="block text-sm font-medium text-gray-700 mb-1"> Facility Type </label>
                        <select id="facility-type" className="w-full p-2 border border-gray-300 rounded-md">
                          <option value="">All Types</option>
                          <option value="airport">Airport</option>
                          <option value="seaport">Seaport</option>
                          <option value="land">Land Crossing</option>
                          <option value="hospital">Hospital</option>
                          <option value="center">Health Center</option>
                        </select>
                      </div>
                      <Button className="w-full bg-blue-600 hover:bg-blue-700">Search Facilities</Button>
                    </div>
                  </div>
                  <div className="md:w-1/2">
                    <h3 className="text-xl font-semibold text-blue-700 mb-4">Book an Appointment</h3>
                    <div className="bg-blue-50 p-5 rounded-lg border border-blue-100">
                      <p className="text-gray-700 mb-4"> Schedule your vaccination appointment at one of our authorized Point of Entry facilities. Online booking allows you to select your preferred date, time, and location. </p>
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center">
                          <svg className="h-5 w-5 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-sm text-gray-600">Convenient online scheduling</span>
                        </div>
                        <div className="flex items-center">
                          <svg className="h-5 w-5 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-sm text-gray-600">Email confirmation and reminders</span>
                        </div>
                        <div className="flex items-center">
                          <svg className="h-5 w-5 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-sm text-gray-600">Flexible rescheduling options</span>
                        </div>
                      </div>
                      <Button className="w-full bg-blue-600 hover:bg-blue-700">Book Now</Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Yellow Fever Page */}
        {activePage === "Yellow Fever" && (
          <div className="my-8 border rounded-lg overflow-hidden shadow-md">
            <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white p-6">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold">Yellow Fever Vaccine Information</h2>
                  <p className="text-sm mt-2 opacity-90"> Expert guidance from the Hope International Medical Institute </p>
                </div>
                <div className="mt-4 md:mt-0">
                  <Link href="/yellow-fever-fact-sheet.pdf" target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm" className="bg-white text-blue-600 hover:bg-blue-50">
                      <Download size={16} className="mr-2" /> Download Fact Sheet
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
            <div className="p-6 bg-white">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="md:w-3/4">
                  <div className="space-y-8">
                    <section>
                      <div className="flex items-center mb-3">
                        <div className="bg-blue-100 p-2 rounded-full mr-3">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600" >
                            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
                          </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-blue-700">About Yellow Fever Vaccine</h3>
                      </div>
                      <div className="ml-12">
                        <p className="mb-3 text-gray-700"> The yellow fever vaccine is a live attenuated vaccine that provides effective immunity against yellow fever virus, a disease transmitted by infected mosquitoes. A single dose provides lifelong protection for most people. </p>
                      </div>
                    </section>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
