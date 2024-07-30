import "./userinfo.css";
import { useUserStore } from "../../../lib/userStore";
import defaultAvatar from "../chat-images/avatar.png";
import moreIcon from "../chat-images/more.png";
import videoIcon from "../chat-images/video.png";
import editIcon from "../chat-images/edit.png";

const Userinfo = () => {
  const { currentUser } = useUserStore();

  const avatarUrl = currentUser.avatar ? currentUser.avatar : defaultAvatar;

  return (
    <div className="userInfo">
      <div className="user">
        <img src={avatarUrl} alt="Avatar" />
        <h4>{currentUser.name}</h4>
      </div>
      <div className="icons">
        <img src={moreIcon} alt="More" />
        <img src={videoIcon} alt="Video" />
        <img src={editIcon} alt="Edit" />
      </div>
    </div>
  );
};

export default Userinfo;
