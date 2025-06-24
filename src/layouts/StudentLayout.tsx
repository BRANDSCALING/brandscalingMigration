import { ReactNode } from 'react';
import { StudentHeader } from '../components/StudentHeader';

interface StudentLayoutProps {
  children: ReactNode;
}

export function StudentLayout({ children }: StudentLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <StudentHeader />
      <main>{children}</main>
    </div>
  );
}