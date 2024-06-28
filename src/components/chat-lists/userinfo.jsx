import "./userinfo.css"

const Userinfo = () => { 
    return ( 
        <div className="userInfo"> 
        <div className="user">
        <img src={require('../chat-images/avatar.png')} alt="Avatar" /> 
        <h4> John Doe </h4>
        </div>
        <div className="icons">
            <img src={require('../chat-images/more.png')} alt="More" /> 
            <img src={require('../chat-images/video.png')} alt="Video" /> 
            <img src={require('../chat-images/edit.png')} alt="Edit" /> 
        </div>
        </div>
    )
}

export default Userinfo