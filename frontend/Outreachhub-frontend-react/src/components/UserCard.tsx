import React from "react";
import { motion } from "framer-motion";

interface ContactInfo {
  countryCode: string;
  phoneNo: string;
  email: string;
}

interface UserCardProps {
  profilePicture: string;
  name: string;
  contactInfo: ContactInfo;
  createdAt: string; // ISO date string
}

const UserCard: React.FC<UserCardProps> = ({
  profilePicture,
  name,
  contactInfo,
  createdAt,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.03 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="max-w-sm w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700 p-6 flex flex-col gap-4"
    >
      {/* Header: Profile Picture + Name */}
      <div className="flex items-center gap-4">
        <img
          src={profilePicture}
          alt={name}
          className="w-16 h-16 rounded-full object-cover border-2 border-gray-300 dark:border-gray-600"
        />
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {name}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Joined: {new Date(createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Contact Info */}
      <div className="flex flex-col gap-2 text-gray-700 dark:text-gray-300 text-sm">
        <div className="flex items-center gap-2">
          <span className="font-medium">Phone:</span>
          <span>
            {contactInfo.countryCode} {contactInfo.phoneNo}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-medium">Email:</span>
          <span>{contactInfo.email}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default UserCard;

