import { PencilIcon, PlusIcon, TrashIcon } from "lucide-react";
import Link from 'next/link';



export function CreateProfile() {
    return (
      <Link
        href="/user/profile/add"
        className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
      >
        <span className="hidden md:block">Create Profile</span>{' '}
        <PlusIcon className="h-5 md:ml-4" />
      </Link>
    );
  }
  
  export function UpdateProfile({ id }) {
    return (
      <Link
        href={`/user/profile/${id}/edit`}
        className="rounded-md border p-2 hover:bg-gray-100"
      >
        <PencilIcon className="w-5" />
      </Link>
    );
  }
  
  export function DeleteProfile({ id }) {
    return (
      <form>
        <button className="rounded-md border p-2 hover:bg-gray-100">
          <span className="sr-only">Delete</span>
          <TrashIcon className="w-5" />
        </button>
      </form>
    );
  }
  