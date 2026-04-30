import { useState, useEffect } from "react";
import axios from "axios";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get("http://localhost:3000/profile", {
          withCredentials: true,
        });
        setUser(response.data);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);
 if (loading)
   return (
     <div
       style={{
         width: 200,
         height: 100,
         backgroundColor: "#e0e0e0",
         borderRadius: 8,
         margin: "2rem auto",
       }}
     />
   );
  if (!user) return <p>Not logged in.</p>;
  return (
    <div>
      <h2>Hello {user.given_name || user.name}</h2>
      <p>{user.email}</p>
      <a href="http://localhost:3000/logout">Log out</a>
      {user.picture && (
        <img
          src={user.picture}
          alt={user.name}
          style={{ width: 80, borderRadius: "50%" }}
        />
      )}
    </div>
  );
};

export default Profile;
