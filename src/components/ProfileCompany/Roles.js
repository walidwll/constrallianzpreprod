import clsx from 'clsx';
import { Briefcase, HardHat, Settings } from 'lucide-react';

export default function Roles({ role }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-2 py-1 text-xs',
        {
          'bg-green-500 text-white': role === 'director',
          'bg-blue-500 text-white': role === 'manager',
          'bg-gray-100 text-gray-500': role === 'production',
          'bg-yellow-500 text-black': role === 'supervisor',
        },
      )}
    >
      {role === 'director' ? (
        <>
          Director
          <HardHat className="ml-1 w-4 text-white" />
        </>
      ) : null}
      {role === 'manager' ? (
        <>
          Manager
          <Briefcase className="ml-1 w-4 text-white" />
        </>
      ) : null}
      {role === 'production' ? (
        <>
          Production
          <Settings className="ml-1 w-4 text-gray-500" />
        </>
      ) : null}
      {role === 'supervisor' ? (
        <>
          Supervisor
          <HardHat className="ml-1 w-4 text-black" />
        </>
      ) : null}
    </span>
  );
}