import React from "react";
import Image from 'next/image';
import { DeleteProfile, UpdateProfile } from "./buttons";
import Roles from "./Roles";
import { formatDateToLocal } from "@/lib/utils";

const ProfilesList = ({profiles}) => {
  
  if (!profiles) {
    return <div>No profiles available</div>; // Handle null or undefined case gracefully
  }
    return (
        <div className="mt-6 flow-root">
          <div className="inline-block min-w-full align-middle">
            <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
              <div className="md:hidden">
                {profiles?.map((profile) => (
                  <div
                    key={profile._id}
                    className="mb-2 w-full rounded-md bg-white p-4"
                  >
                    <div className="flex items-center justify-between border-b pb-4">
                      <div>
                        <div className="mb-2 flex items-center">
                          <Image
                            src={profile.image || `https://ui-avatars.com/api/?name=${profile.first_name+'+'+profile.last_name}&background=random&format=png`}
                            className="mr-2 rounded-full"
                            width={28}
                            height={28}
                            alt={`${profile.first_name}'s profile picture`}
                          />
                          <p>{profile.first_name+' '+profile.last_name}</p>
                        </div>
                        <p className="text-sm text-gray-500">{profile.email}</p>
                      </div>
                      <Roles role={profile.role} />
                    </div>
                    <div className="flex w-full items-center justify-between pt-4">
                      <div>
                        <p className="text-xl font-medium" >{formatDateToLocal(profile.createdAt)}</p>
                      </div>
                      <div className="flex justify-end gap-2">
                        <UpdateProfile id={profile._id} />
                        <DeleteProfile id={profile._id} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <table className="hidden min-w-full text-gray-900 md:table">
                <thead className="rounded-lg text-left text-sm font-normal">
                  <tr>
                    <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                      Name
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      Email
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                    Created At
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      Role
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      Status
                    </th>
                    <th scope="col" className="relative py-3 pl-6 pr-3">
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {profiles?.map((profile) => (
                    <tr
                      key={profile._id}
                      className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                    >
                      <td className="whitespace-nowrap py-3 pl-6 pr-3">
                        <div className="flex items-center gap-3">
                          <Image
                            src={profile.image || `https://ui-avatars.com/api/?name=${profile.first_name+'+'+profile.last_name}&background=random&format=png`}
                            className="rounded-full"
                            width={28}
                            height={28}
                            alt={`${profile.first_name}'s profile picture`}
                          />
                          <p>{profile.first_name+' '+profile.last_name}</p>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-3">
                        {profile.email}
                      </td>
                      <td className="whitespace-nowrap px-3 py-3">
                      {formatDateToLocal(profile.createdAt)}
                      </td>
                      <td className="whitespace-nowrap px-3 py-3">
                        <Roles role={profile.role} />
                      </td>
                      <td className="whitespace-nowrap px-3 py-3">
                      <span className={`${profile.isActive ? "text-green-500" : "text-gray-500"} font-medium`}>
                          {profile.isActive ? "Active" : "Inactive"}
                      </span>
                      </td>
                      <td className="whitespace-nowrap py-3 pl-6 pr-3">
                        <div className="flex justify-end gap-3">
                          <UpdateProfile id={profile._id} />
                          <DeleteProfile id={profile._id} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      );
};
export default ProfilesList;
