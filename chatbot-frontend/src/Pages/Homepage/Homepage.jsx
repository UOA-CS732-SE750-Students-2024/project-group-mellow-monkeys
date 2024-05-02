import { useState, useEffect } from "react";
import styles from "./Homepage.module.css";
import {
  ChatCircle,
  GithubLogo,
  PaperPlaneRight,
  Robot,
  SignOut,
  TrashSimple,
} from "@phosphor-icons/react";
import { FaCog } from "react-icons/fa";
import { Button, FormControl, Spinner, Offcanvas } from "react-bootstrap";
import axios from "axios";
import { toast } from "react-toastify";
import { COMPLETIONS } from "../../urls";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
axios.defaults.baseURL = "http://localhost:8001";

const Homepage = () => {
  const navigate = useNavigate();
  const { auth, submitLogout } = useAuth();
  const [value, setValue] = useState("");
  const [message, setMessage] = useState(null);
  const [previousChats, setPreviousChats] = useState([]);
  const [currentTitle, setCurrentTitle] = useState(null);
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [name, setName] = useState(null);
  const [description, setDescription] = useState('');
    const [imageURL, setImageURL] = useState('');

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    if (auth.id && auth.token) {
      axios
        .get(`/user/${auth.id}`, {
          headers: { Authorization: `Bearer ${auth.token}` },
        })
        .then((response) => {
          setAvatar(response.data.user.avatar);
          setName(response.data.user.name);
        })
        .catch((error) => {
          console.error("Failed to fetch user avatar", error);
        });
    }
  }, [auth.id, auth.token]);

  const handleNavigateToUserInfo = () => {
    navigate("/user-info"); // Use navigate to go to the user information page
  };

  // Resets the current chat
  const createNewChat = () => {
    setValue("");
    setMessage(null);
    setCurrentTitle(null);
  };

  const handleClick = (uniqueTitle) => {
    setValue("");
    setMessage(null);
    setCurrentTitle(uniqueTitle);
  };

  const handleEmptyHistory = () => {
    setPreviousChats([]);
    setValue("");
    setMessage(null);
    setCurrentTitle(null);
  };

  /*
		Simple async function that fetches the messages from the API
	*/
  const getMessages = async () => {
    setLoading(true);

    try {
      // change this url for one in the .env file
      const response = await axios.post(
        COMPLETIONS,
        JSON.stringify({
          message: value,
        }),
        {
          headers: {
            Authorization: `Bearer ${auth?.token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response?.data);

      // Check if the choices array exists and has at least one element
      if (response?.data?.choices && response.data.choices.length > 0) {
        setMessage(response.data.choices[0].message);
      } else {
        // Handle the case where choices is not as expected
        console.error("Invalid response from API:", response.data);
        // Set the message state to some error message or handle accordingly
        setMessage("An error occurred while fetching the message.");
        toast.error("An error occurred while fetching the message.");
      }
      // setMessage(response?.data?.choices[0]?.message);
      setLoading(false);
    } catch (error) {
      console.error(error);
      toast.error(
        <div>
          Error! <br />
          {error?.response?.data?.error || error?.message}
        </div>
      );
      setLoading(false);
    }
  };

  /*
		UseEffect triggered by message and/or currentTitle state changes
	*/
  useEffect(() => {
    if (!currentTitle && value && message) {
      /*
				If there is no current title, but we've recieved a value and a message
				we set the current title as the value of the input (user message)
			*/
      setCurrentTitle(value);
    }
    if (currentTitle && value && message) {
      /*
				Saves the current chat and the previous one
				while also updating the current chat
				and savin the first message asked by the user
				as the title of the conversation
			*/
      setPreviousChats((prevChats) => [
        ...prevChats,
        {
          title: currentTitle,
          // Later, change this to the name retrieved from AUTH
          role: "user",
          content: value,
        },
        {
          title: currentTitle,
          role: message.role,
          content: message.content,
        },
      ]);
      setValue("");
    }
  }, [message, currentTitle]);

  /*
		filters the previous chats by the current title and stores
		the current chat if it matches the current title
	*/
  const currentChat = previousChats.filter(
    (previousChat) => previousChat.title === currentTitle
  );

  // creates an array of unique titles from the previous chats
  const uniqueTitles = Array.from(
    new Set(previousChats.map((previousChat) => previousChat.title))
  );

  const generateAvatar = async () => {
    try {
        const response = await axios.post('http://localhost:8001/generate-avatar', { description });
        setImageURL(response.data.imageURL);
    } catch (error) {
        console.error('Error generating avatar:', error);
    }
  };

  return (
    <div className={styles.homepage}>
      {/* SIDEBAR */}
      <Offcanvas
        show={show}
        onHide={handleClose}
        responsive="lg"
        className={styles.offcanvas_side_bar}
      >
        <section className={styles.side_bar}>
          <div className={styles.side_bar_user}>
            <img
              src={avatar}
              alt="User avatar"
              className={styles.user_avatar}
              onClick={handleNavigateToUserInfo}
            />
            <div className={styles.side_bar_user_name}>Hello {name}</div>
            <Button onClick={submitLogout} className={styles.btn_logout}>
              <SignOut size={20} />
            </Button>
          </div>
          <Button onClick={createNewChat} className={styles.btn_new_chat}>
            + New Chat
          </Button>
          {/* CHAT HISTORY */}
          <ul className={styles.chat_history}>
            {uniqueTitles?.map((uniqueTitle, index) => (
              <li
                onClick={() => handleClick(uniqueTitle)}
                key={index}
                className={uniqueTitle === currentTitle ? styles.active : ""}
              >
                <ChatCircle size={20} />
                <span>{uniqueTitle}</span>
              </li>
            ))}
          </ul>
          {/* CHAT HISTORY */}
          {/* FOOTER */}
          <span className={styles.footer_github}>
            {previousChats.length > 0 && (
              <Button
                onClick={handleEmptyHistory}
                className={styles.btn_empty_history}
              >
                <TrashSimple size={20} />
                Empty history
              </Button>
            )}
            <a
              href="https://github.com/UOA-CS732-SE750-Students-2024/project-group-mellow-monkeys"
              target="_blank"
              rel="https://github.com/UOA-CS732-SE750-Students-2024/project-group-mellow-monkeys noreferrer"
            >
              {/* this color has to be in hex to fix offcanvas bug */}
              <GithubLogo size={20} color="#94a3b8" />
              Made by Mellow Monkeys
            </a>
          </span>
          {/* FOOTER */}
        </section>
      </Offcanvas>
      {/* SIDEBAR */}

      {/* MAIN */}
      <section className={styles.main}>
        <div className={styles.bobu_logo_wrapper}>
          <h1 className={styles.bobu_logo}>
            <Robot size={32} />
            Bobu
          </h1>
        </div>
        <ul className={styles.text_feed}>
						{currentChat?.map((chatMessage, index) => (
							<li key={index}>
								<span className={styles.feed_role}>
									{chatMessage.role
										? chatMessage.role === "user"
											? <img src = {avatar} />
											: <img src={imageURL} alt="Virtual Lover Avatar" />
										: <img src={imageURL} alt="Virtual Lover Avatar" />}
								</span>
								<span>{chatMessage.content}</span>
							</li>
						))}
					</ul>
        <div className={styles.bottom_wrapper}>
          <div className={styles.input_wrapper}>
            <FormControl
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className={styles.input_field}
              type="text"
              maxLength={256}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  getMessages();
                }
              }}
            />
            <button onClick={getMessages} className={styles.btn_submit}>
              {loading ? (
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
              ) : (
                <PaperPlaneRight size={20} />
              )}
            </button>
          </div>
          <p className={`${styles.info} text-muted`}>Powered by Chat GPT4.</p>
        </div>
        <div className={styles.avatarGeneratorContainer}>
            			<input
                			type="text"
							placeholder="Describe your virtual lover"
							value={description}
							onChange={e => setDescription(e.target.value)}
						/>
						<button onClick={generateAvatar}>Generate Avatar</button>
					</div>
      </section>
      {/* MAIN */}
    </div>
  );
};

export default Homepage;
