import React, { useEffect, useState } from 'react';
import { getProfile } from '../../services/profileService';
import { Dialog, DialogHeader, DialogBody, DialogFooter, Button } from "@material-tailwind/react";
import { useSelector } from 'react-redux';
import { selectUser } from '../../redux/slices/authSlice';

const Profile = ({ open, onClose }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = useSelector(selectUser)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile(user.UserId);
        setProfile(data);
      } catch (err) {
        setError('Failed to fetch profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
      <p className="mt-4 text-lg font-semibold text-gray-700">Đang tải...</p>
    </div>
  ); if (error) return <div>{error}</div>;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      size="lg"
    >
      <DialogHeader>View Profile</DialogHeader>
      <DialogBody className="grid grid-cols-2 gap-4">
        <div>
          <img src={profile.avatarUrl} alt="Avatar" className="w-32 h-32 rounded-full mb-4" />
        </div>
        <div>
          <p><strong>Full Name:</strong> {profile.fullName}</p>
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>Phone:</strong> {profile.phone}</p>
          <p><strong>Address:</strong> {profile.address}</p>
          <p><strong>Date of Birth:</strong> {new Date(profile.dob).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          })}</p>
          <p><strong>Gender:</strong> {profile.gender}</p>
          <p><strong>Created Date:</strong> {new Date(profile.createdDate).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          })}</p>
          <p><strong>Last Update:</strong> {new Date(profile.lastUpdate).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          })}</p>
        </div>
      </DialogBody>
      <DialogFooter>
        <Button
          variant="text"
          onClick={onClose}
        >
          Close
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default Profile;
