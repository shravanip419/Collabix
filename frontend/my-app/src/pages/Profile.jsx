import "./Profile.css";
import { MdWork, MdApartment, MdBusiness, MdLocationOn } from "react-icons/md";

export default function Profile() {
  return (
    <div className="profile-root">

      {/* COVER */}
      <div className="profile-cover">
        <div className="cover-overlay">
          <button className="cover-btn">Add cover image</button>
        </div>
      </div>

      <div className="profile-content">

        {/* LEFT */}
        <div className="profile-left">

          {/* AVATAR */}
          <div className="avatar-wrapper">
            <div className="avatar">
              KD
              <span className="avatar-overlay">Change</span>
            </div>
          </div>

          <h2 className="profile-name">Kaustubh Deshmane</h2>
          <button className="manage-account">Manage your account</button>

          {/* ABOUT */}
          <div className="profile-card">
            <h3>About</h3>

            <div className="about-item">
              <MdWork /> <span>Your job title</span>
            </div>
            <div className="about-item">
              <MdApartment /> <span>Your department</span>
            </div>
            <div className="about-item">
              <MdBusiness /> <span>Your organization</span>
            </div>
            <div className="about-item">
              <MdLocationOn /> <span>Your location</span>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="profile-right">

          <div className="worked-on-box">
            <div className="worked-header">
              <h3>Worked on</h3>
              <span className="view-all">View all</span>
            </div>

            <p className="worked-subtext">
              Others will only see what they can access.
            </p>

            <div className="worked-list">
              {[
                "Finalize Documentation for the Project",
                "Optimize Performance of the Application",
                "Develop Transaction History Feature",
                "Create Wallet Integration",
                "Set Up Notifications for Users"
              ].map((task, i) => (
                <div key={i} className="worked-item">
                  <span className="check">✓</span>
                  <div>
                    <p>{task}</p>
                    <span className="worked-meta">
                      (Example) Billing System Dev · You created this today
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <button className="show-more-btn">Show more</button>
          </div>

          <div className="profile-card places">
            <h3>Places you work in</h3>
            <div className="empty-state">
              <p><b>We don’t have places to show here yet</b></p>
              <p>
                There are no projects or spaces you’ve worked in across
                the last 90 days.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
