import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Profile = () => {
  const [profile, setProfile] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedProfileId, setSelectedProfileId] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/profile/');
      setProfile(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleImageSelect = (profileId) => {
    setSelectedProfileId(profileId);
  };

  const handleImageUpload = async (event) => {
    try {
      if (selectedProfileId && event.target.files.length > 0) {
        const formData = new FormData();
        formData.append('image', event.target.files[0]);

        await axios.patch(
          `http://127.0.0.1:8000/profile/${selectedProfileId}/`,
          formData,
          {
            headers: { 'Content-Type': 'multipart/form-data' },
          }
        );

        fetchProfile(); // Refresh profile data after image update
        setSelectedProfileId(null);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1>Profiles</h1>
      <div className='profile-main'>
        {profile.map((profileItem) => (
          <div key={profileItem.id}>
            <a href='#' onClick={() => handleImageSelect(profileItem.id)}>
              <img src={`http://127.0.0.1:8000${profileItem.image}`} alt='Profile' />
            </a>
            {selectedProfileId === profileItem.id && (
              <div className='upload-main'>
                <p>Uplaod a image</p>
                <input
                  type='file'
                  accept='image/*'
                  onChange={handleImageUpload}
                />
              </div>
            )}
            <h3>{profileItem.name && profileItem.name.username}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Profile;
