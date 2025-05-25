import React, { useState } from "react";
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  Scissors,
  ActivitySquare,
  Monitor,
  TestTube,
  FileSearch,
  Pill,
  Stethoscope,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  LogOut,
  BarChart3,
  CheckCircle2,
  User,
} from "lucide-react";
import Link from "next/link";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openDropdowns, setOpenDropdowns] = useState({
    dashboard: true,
    patient: false,
    masters: false,
    reports: false,
  });

  const toggleDropdown = (section: keyof typeof openDropdowns) => {
    setOpenDropdowns(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <div
      className={`border-r h-full flex flex-col ${isCollapsed ? "w-[60px]" : "w-64"} transition-all duration-300 ease-in-out relative bg-white`}
    >
      <div className={`p-4 border-b flex items-center gap-2 ${isCollapsed ? "justify-center" : ""}`}>
        <ActivitySquare className="h-6 w-6 text-green-600 flex-shrink-0" />
        {!isCollapsed && (
          <div>
            <h1 className="text-xl font-bold">Hope Hospital</h1>
            <div className="mt-1 rounded-md bg-green-100 px-2 py-1 text-xs font-medium text-green-800 inline-block">
              Hospital Management System
            </div>
          </div>
        )}
      </div>
      
      <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
        {/* Dashboard Section */}
        <div className="mb-2">
          <button
            onClick={() => toggleDropdown('dashboard')}
            className={`w-full px-3 py-2 rounded-md transition-colors flex items-center justify-between hover:bg-blue-50 border border-transparent hover:border-blue-200 ${isCollapsed ? "justify-center" : ""} cursor-pointer`}
          >
            <div className={`flex items-center ${isCollapsed ? "justify-center" : "gap-3"}`}>
              <LayoutDashboard className="h-4 w-4 flex-shrink-0 text-blue-600" />
              {!isCollapsed && <span className="font-medium text-gray-700">Dashboard</span>}
            </div>
            {!isCollapsed && (
              <div className="flex items-center">
                {openDropdowns.dashboard ? <ChevronUp className="h-4 w-4 text-blue-600" /> : <ChevronDown className="h-4 w-4 text-blue-600" />}
              </div>
            )}
          </button>
          {!isCollapsed && openDropdowns.dashboard && (
            <div className="ml-4 mt-1 space-y-1">
              <Link href="/?tab=today-ipd-dashboard" legacyBehavior>
                <a className="block px-3 py-2 rounded-md text-sm hover:bg-gray-100 transition-colors">
                  Today's IPD Dashboard
                </a>
              </Link>
              <Link href="/?tab=today-opd-dashboard" legacyBehavior>
                <a className="block px-3 py-2 rounded-md text-sm hover:bg-gray-100 transition-colors">
                  Today's OPD Dashboard
                </a>
              </Link>
            </div>
          )}
        </div>

        {/* Patient Management Section */}
        <div className="mb-2">
          <button
            onClick={() => toggleDropdown('patient')}
            className={`w-full px-3 py-2 rounded-md transition-colors flex items-center justify-between hover:bg-green-50 border border-transparent hover:border-green-200 ${isCollapsed ? "justify-center" : ""} cursor-pointer`}
          >
            <div className={`flex items-center ${isCollapsed ? "justify-center" : "gap-3"}`}>
              <Users className="h-4 w-4 flex-shrink-0 text-green-600" />
              {!isCollapsed && <span className="font-medium text-gray-700">Patient Management</span>}
            </div>
            {!isCollapsed && (
              <div className="flex items-center">
                {openDropdowns.patient ? <ChevronUp className="h-4 w-4 text-green-600" /> : <ChevronDown className="h-4 w-4 text-green-600" />}
              </div>
            )}
          </button>
          {!isCollapsed && openDropdowns.patient && (
            <div className="ml-4 mt-1 space-y-1">
              <Link href="/?tab=patient" legacyBehavior>
                <a className="block px-3 py-2 rounded-md text-sm hover:bg-gray-100 transition-colors">
                  Patient Management
                </a>
              </Link>
              <Link href="/?tab=patient-dashboard" legacyBehavior>
                <a className="block px-3 py-2 rounded-md text-sm hover:bg-gray-100 transition-colors">
                  Patient Dashboard
                </a>
              </Link>
            </div>
          )}
        </div>

        {/* Masters Section */}
        <div className="mb-2">
          <button
            onClick={() => toggleDropdown('masters')}
            className={`w-full px-3 py-2 rounded-md transition-colors flex items-center justify-between hover:bg-purple-50 border border-transparent hover:border-purple-200 ${isCollapsed ? "justify-center" : ""} cursor-pointer`}
          >
            <div className={`flex items-center ${isCollapsed ? "justify-center" : "gap-3"}`}>
              <ClipboardList className="h-4 w-4 flex-shrink-0 text-purple-600" />
              {!isCollapsed && <span className="font-medium text-gray-700">Masters</span>}
            </div>
            {!isCollapsed && (
              <div className="flex items-center">
                {openDropdowns.masters ? <ChevronUp className="h-4 w-4 text-purple-600" /> : <ChevronDown className="h-4 w-4 text-purple-600" />}
              </div>
            )}
          </button>
          {!isCollapsed && openDropdowns.masters && (
            <div className="ml-4 mt-1 space-y-1">
              <Link href="/?tab=diagnosis-master" legacyBehavior>
                <a className="block px-3 py-2 rounded-md text-sm hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-2">
                    <ClipboardList className="h-3 w-3" />
                    Diagnosis Master
                  </div>
                </a>
              </Link>
              <Link href="/?tab=cghs-surgery-master" legacyBehavior>
                <a className="block px-3 py-2 rounded-md text-sm hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-2">
                    <Scissors className="h-3 w-3" />
                    CGHS Surgery Master
                  </div>
                </a>
              </Link>
              <Link href="/?tab=yojna-surgery-master" legacyBehavior>
                <a className="block px-3 py-2 rounded-md text-sm hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-2">
                    <Scissors className="h-3 w-3" />
                    Yojna Surgery Master
                  </div>
                </a>
              </Link>
              <Link href="/?tab=private-surgery-master" legacyBehavior>
                <a className="block px-3 py-2 rounded-md text-sm hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-2">
                    <Scissors className="h-3 w-3" />
                    Private Surgery Master
                  </div>
                </a>
              </Link>
              <Link href="/?tab=complications-master" legacyBehavior>
                <a className="block px-3 py-2 rounded-md text-sm hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-2">
                    <ActivitySquare className="h-3 w-3" />
                    Complication Master
                  </div>
                </a>
              </Link>
              <Link href="/?tab=radiology-master" legacyBehavior>
                <a className="block px-3 py-2 rounded-md text-sm hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-2">
                    <Monitor className="h-3 w-3" />
                    Radiology Master
                  </div>
                </a>
              </Link>
              <Link href="/?tab=lab-master" legacyBehavior>
                <a className="block px-3 py-2 rounded-md text-sm hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-2">
                    <TestTube className="h-3 w-3" />
                    Lab Master
                  </div>
                </a>
              </Link>
              <Link href="/?tab=other-investigations-master" legacyBehavior>
                <a className="block px-3 py-2 rounded-md text-sm hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-2">
                    <FileSearch className="h-3 w-3" />
                    Other Investigations
                  </div>
                </a>
              </Link>
              <Link href="/?tab=medications-master" legacyBehavior>
                <a className="block px-3 py-2 rounded-md text-sm hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-2">
                    <Pill className="h-3 w-3" />
                    Medications Master
                  </div>
                </a>
              </Link>
              <Link href="/?tab=medical-staff-master" legacyBehavior>
                <a className="block px-3 py-2 rounded-md text-sm hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-2">
                    <Stethoscope className="h-3 w-3" />
                    Medical Staff
                  </div>
                </a>
              </Link>
              <Link href="/?tab=doctor-master" legacyBehavior>
                <a className="block px-3 py-2 rounded-md text-sm hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-2">
                    <User className="h-3 w-3" />
                    Doctor Master
                  </div>
                </a>
              </Link>
              <Link href="/?tab=user-list" legacyBehavior>
                <a className="block px-3 py-2 rounded-md text-sm hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-2">
                    <Users className="h-3 w-3" />
                    User List
                  </div>
                </a>
              </Link>
            </div>
          )}
        </div>

        {/* Reports & Admin Section */}
        <div className="mb-2">
          <button
            onClick={() => toggleDropdown('reports')}
            className={`w-full px-3 py-2 rounded-md transition-colors flex items-center justify-between hover:bg-orange-50 border border-transparent hover:border-orange-200 ${isCollapsed ? "justify-center" : ""} cursor-pointer`}
          >
            <div className={`flex items-center ${isCollapsed ? "justify-center" : "gap-3"}`}>
              <BarChart3 className="h-4 w-4 flex-shrink-0 text-orange-600" />
              {!isCollapsed && <span className="font-medium text-gray-700">Reports & Admin</span>}
            </div>
            {!isCollapsed && (
              <div className="flex items-center">
                {openDropdowns.reports ? <ChevronUp className="h-4 w-4 text-orange-600" /> : <ChevronDown className="h-4 w-4 text-orange-600" />}
              </div>
            )}
          </button>
          {!isCollapsed && openDropdowns.reports && (
            <div className="ml-4 mt-1 space-y-1">
              <Link href="/?tab=approvals" legacyBehavior>
                <a className="block px-3 py-2 rounded-md text-sm hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-3 w-3" />
                    Approvals
                  </div>
                </a>
              </Link>
              <Link href="/?tab=reports" legacyBehavior>
                <a className="block px-3 py-2 rounded-md text-sm hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-3 w-3" />
                    Reports
                  </div>
                </a>
              </Link>
            </div>
          )}
        </div>
      </nav>
      
      {/* Collapse/Expand Toggle Button */}
      <button
        className="absolute -right-3 top-20 h-6 w-6 rounded-full border bg-background shadow-md flex items-center justify-center hover:bg-gray-50"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        {isCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
      </button>
    </div>
  );
};

export default Sidebar; 