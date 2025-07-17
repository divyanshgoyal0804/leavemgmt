import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Notifications() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/leaves`);
        const pendingLeaves = res.data.filter(leave => leave.status === 'pending');
        setNotifications(pendingLeaves);
      } catch (err) {
        console.error(err);
      }
    };

    fetchNotifications();
  }, []);

  return (
    <div>
      <h2>Notifications</h2>
      <ul>
        {notifications.map((notification) => (
          <li key={notification._id}>
            New leave request from {notification.employeeId} ({notification.leaveType}) on {new Date(notification.startDate).toLocaleDateString()}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Notifications;