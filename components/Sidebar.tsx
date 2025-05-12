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
  LogOut,
  BarChart3,
  CheckCircle2,
  User,
} from "lucide-react";
import Link from "next/link";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  return (
    <div
      className={`border-r h-full flex flex-col ${isCollapsed ? "w-[60px]" : "w-64"} transition-all duration-300 ease-in-out relative`}
      onMouseEnter={() => isCollapsed && setIsCollapsed(false)}
      onMouseLeave={() => !isCollapsed && setIsCollapsed(true)}
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
      <nav className="flex-1 p-2 space-y-1">
        {/* Today's Dashboard Section */}
        {!isCollapsed && (
          <div className="mb-2 pl-3 pt-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Today's Dashboard
            </p>
          </div>
        )}
        <Link href="/?tab=today-ipd-dashboard" legacyBehavior>
          <a className={`w-full px-3 py-2 rounded-md transition-colors flex items-center ${isCollapsed ? "justify-center" : "gap-3"} hover:bg-muted`}>
            <LayoutDashboard className="h-4 w-4 flex-shrink-0" />
            {!isCollapsed && <span>Today's IPD Dashboard</span>}
          </a>
        </Link>
        <Link href="/?tab=today-opd-dashboard" legacyBehavior>
          <a className={`w-full px-3 py-2 rounded-md transition-colors flex items-center ${isCollapsed ? "justify-center" : "gap-3"} hover:bg-muted`}>
            <LayoutDashboard className="h-4 w-4 flex-shrink-0" />
            {!isCollapsed && <span>Today's OPD Dashboard</span>}
          </a>
        </Link>
        {/* Patient Management Section */}
        {!isCollapsed && (
          <div className="mb-2 mt-4 pl-3 pt-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Patient Management
            </p>
          </div>
        )}
        <Link href="/?tab=patient" legacyBehavior>
          <a className={`w-full px-3 py-2 rounded-md transition-colors flex items-center ${isCollapsed ? "justify-center" : "gap-3"} hover:bg-muted`}>
            <Users className="h-4 w-4 flex-shrink-0" />
            {!isCollapsed && <span>Patient Management</span>}
          </a>
        </Link>
        <Link href="/?tab=patient-dashboard" legacyBehavior>
          <a className={`w-full px-3 py-2 rounded-md transition-colors flex items-center ${isCollapsed ? "justify-center" : "gap-3"} hover:bg-muted`}>
            <Users className="h-4 w-4 flex-shrink-0" />
            {!isCollapsed && <span>Patient Dashboard</span>}
          </a>
        </Link>
        {/* Masters Section */}
        {!isCollapsed && (
          <div className="mb-2 mt-4 pl-3 pt-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Masters
            </p>
          </div>
        )}
        <Link href="/?tab=diagnosis-master" legacyBehavior>
          <a className={`w-full px-3 py-2 rounded-md transition-colors flex items-center ${isCollapsed ? "justify-center" : "gap-3"} hover:bg-muted`}>
            <ClipboardList className="h-4 w-4 flex-shrink-0" />
            {!isCollapsed && <span>Diagnosis Master</span>}
          </a>
        </Link>
        <Link href="/?tab=cghs-surgery-master" legacyBehavior>
          <a className={`w-full px-3 py-2 rounded-md transition-colors flex items-center ${isCollapsed ? "justify-center" : "gap-3"} hover:bg-muted`}>
            <Scissors className="h-4 w-4 flex-shrink-0" />
            {!isCollapsed && <span>CGHS Surgery Master</span>}
          </a>
        </Link>
        <Link href="/?tab=yojna-surgery-master" legacyBehavior>
          <a className={`w-full px-3 py-2 rounded-md transition-colors flex items-center ${isCollapsed ? "justify-center" : "gap-3"} hover:bg-muted`}>
            <Scissors className="h-4 w-4 flex-shrink-0" />
            {!isCollapsed && <span>Yojna Surgery Master</span>}
          </a>
        </Link>
        <Link href="/?tab=private-surgery-master" legacyBehavior>
          <a className={`w-full px-3 py-2 rounded-md transition-colors flex items-center ${isCollapsed ? "justify-center" : "gap-3"} hover:bg-muted`}>
            <Scissors className="h-4 w-4 flex-shrink-0" />
            {!isCollapsed && <span>Private Surgery Master</span>}
          </a>
        </Link>
        <Link href="/?tab=complications-master" legacyBehavior>
          <a className={`w-full px-3 py-2 rounded-md transition-colors flex items-center ${isCollapsed ? "justify-center" : "gap-3"} hover:bg-muted`}>
            <ActivitySquare className="h-4 w-4 flex-shrink-0" />
            {!isCollapsed && <span>Complication Master</span>}
          </a>
        </Link>
        <Link href="/?tab=radiology-master" legacyBehavior>
          <a className={`w-full px-3 py-2 rounded-md transition-colors flex items-center ${isCollapsed ? "justify-center" : "gap-3"} hover:bg-muted`}>
            <Monitor className="h-4 w-4 flex-shrink-0" />
            {!isCollapsed && <span>Radiology Master</span>}
          </a>
        </Link>
        <Link href="/?tab=lab-master" legacyBehavior>
          <a className={`w-full px-3 py-2 rounded-md transition-colors flex items-center ${isCollapsed ? "justify-center" : "gap-3"} hover:bg-muted`}>
            <TestTube className="h-4 w-4 flex-shrink-0" />
            {!isCollapsed && <span>Lab Master</span>}
          </a>
        </Link>
        <Link href="/?tab=other-investigations-master" legacyBehavior>
          <a className={`w-full px-3 py-2 rounded-md transition-colors flex items-center ${isCollapsed ? "justify-center" : "gap-3"} hover:bg-muted`}>
            <FileSearch className="h-4 w-4 flex-shrink-0" />
            {!isCollapsed && <span>Other Investigations</span>}
          </a>
        </Link>
        <Link href="/?tab=medications-master" legacyBehavior>
          <a className={`w-full px-3 py-2 rounded-md transition-colors flex items-center ${isCollapsed ? "justify-center" : "gap-3"} hover:bg-muted`}>
            <Pill className="h-4 w-4 flex-shrink-0" />
            {!isCollapsed && <span>Medications Master</span>}
          </a>
        </Link>
        <Link href="/?tab=medical-staff-master" legacyBehavior>
          <a className={`w-full px-3 py-2 rounded-md transition-colors flex items-center ${isCollapsed ? "justify-center" : "gap-3"} hover:bg-muted`}>
            <Stethoscope className="h-4 w-4 flex-shrink-0" />
            {!isCollapsed && <span>Medical Staff</span>}
          </a>
        </Link>
        <Link href="/?tab=doctor-master" legacyBehavior>
          <a className={`w-full px-3 py-2 rounded-md transition-colors flex items-center ${isCollapsed ? "justify-center" : "gap-3"} hover:bg-muted`}>
            <User className="h-4 w-4 flex-shrink-0" />
            {!isCollapsed && <span>Doctor Master</span>}
          </a>
        </Link>
        <Link href="/?tab=user-list" legacyBehavior>
          <a className={`w-full px-3 py-2 rounded-md transition-colors flex items-center ${isCollapsed ? "justify-center" : "gap-3"} hover:bg-muted`}>
            <Users className="h-4 w-4 flex-shrink-0" />
            {!isCollapsed && <span>User List</span>}
          </a>
        </Link>
        <Link href="/?tab=approvals" legacyBehavior>
          <a className={`w-full px-3 py-2 rounded-md transition-colors flex items-center ${isCollapsed ? "justify-center" : "gap-3"} hover:bg-muted`}>
            <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
            {!isCollapsed && <span>Approvals</span>}
          </a>
        </Link>
        <Link href="/?tab=reports" legacyBehavior>
          <a className={`w-full px-3 py-2 rounded-md transition-colors flex items-center ${isCollapsed ? "justify-center" : "gap-3"} hover:bg-muted`}>
            <BarChart3 className="h-4 w-4 flex-shrink-0" />
            {!isCollapsed && <span>Reports</span>}
          </a>
        </Link>
      </nav>
      {/* Collapse/Expand Toggle Button */}
      <button
        className="absolute -right-3 top-20 h-6 w-6 rounded-full border bg-background shadow-md flex items-center justify-center"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        {isCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
      </button>
    </div>
  );
};

export default Sidebar; 