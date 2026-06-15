import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebar } from '@/components/app-sidebar';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import { type BreadcrumbItem } from '@/types';

export default function AppSidebarLayout({ children, breadcrumbs = [] }: { children: React.ReactNode; breadcrumbs?: BreadcrumbItem[] }) {
    return (
        <AppShell variant="sidebar">
            <AppSidebar />
            <AppContent variant="sidebar">
                <AppSidebarHeader breadcrumbs={breadcrumbs} />
                {children}
                <footer className="mt-auto px-4 py-4 text-center text-sm text-gray-500">
                    Gasss<span className="font-medium text-[#0F6E56]">Trip</span> .Indonesia &copy; {new Date().getFullYear()}
                </footer>
            </AppContent>
        </AppShell>
    );
}