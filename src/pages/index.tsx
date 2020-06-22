import React, { useState, useEffect } from "react";
import css from "./index.module.css";
import { fetchNotifications } from "../services/notification";

import NotificationListItem from "../components/NotificationListItem";
import IssueDetail from "../components/IssueDetail";
import PullRequestDetail from "../components/PullRequestDetail";

function detailDom(notification: App.Notification | null) {
  if (notification?.type == "Issue") {
    return <IssueDetail notification={notification} />;
  } else if (notification?.type == "PullRequest") {
    return <PullRequestDetail notification={notification} />;
  }
  return null;
}

export default function Index() {
  const [notifications, setNotifications] = useState<App.Notification[]>([]);
  const [selected, setSelected] = useState<number>(-1);

  useEffect(() => {
    const { apiBase, apiToken } = JSON.parse(
      localStorage.getItem("hubook-settings") || "{}"
    );
    if (apiBase && apiToken) {
      fetchNotifications(apiBase, apiToken).then((resp) => {
        setNotifications(resp.notifications);
      });
    }
  }, []);

  const select = (n: number) => {
    return () => setSelected(n);
  };

  return (
    <div>
      <div className={css.notifications}>
        <h1 className={css.title}>notifications</h1>
        <ol className={css.list}>
          {notifications.map((item, i) => (
            <NotificationListItem
              notification={item}
              key={item.id}
              onClick={select(i)}
            />
          ))}
        </ol>
      </div>
      <div className={css.content}>
        {detailDom(notifications[selected] || null)}
      </div>
    </div>
  );
}
