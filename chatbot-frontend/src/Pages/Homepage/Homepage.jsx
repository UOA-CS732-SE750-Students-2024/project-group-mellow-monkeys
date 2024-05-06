import { useState, useEffect } from "react";
import styles from "./Homepage.module.css";
import {
  GithubLogo,
  PaperPlaneRight,
  Robot,
  SignOut,
  TrashSimple,
} from "@phosphor-icons/react";
import { Button, FormControl, Spinner, Offcanvas } from "react-bootstrap";
import axios from "axios";
import { toast } from "react-toastify";
import { COMPLETIONS } from "../../urls";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

axios.defaults.baseURL = "http://localhost:8001";

const Homepage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { auth, submitLogout } = useAuth();
  const [value, setValue] = useState("");
  const [message, setMessage] = useState(null);
  const [currentTitle, setCurrentTitle] = useState(null);
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [name, setName] = useState(null);
  const [imageURL, setImageURL] = useState("");
  const [hasRefreshed, setHasRefreshed] = useState(false);
  const [activeChatbotId, setActiveChatbotId] = useState(null);
  const [chatBots, setChatBots] = useState(() => {
    const savedChatBots = sessionStorage.getItem('chatBots');
    return savedChatBots ? JSON.parse(savedChatBots) : [];
  });
  const [previousChats, setPreviousChats] = useState(() => {
    const savedChats = sessionStorage.getItem('previousChats');
    const parsedChats = savedChats ? JSON.parse(savedChats) : [];
    return parsedChats;
  });
  const [currentChat, setCurrentChat] = useState([]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    const storedTitle = sessionStorage.getItem('currentTitle');
    if (storedTitle) {
      setCurrentTitle(storedTitle);
    }

    const storedActiveChatbotId = sessionStorage.getItem('activeChatbotId');
    const storedChatBots = sessionStorage.getItem('chatBots');
    if (storedActiveChatbotId === "null") {
      setActiveChatbotId(null);
    }
    else if(storedActiveChatbotId) {
      setActiveChatbotId(storedActiveChatbotId);
    }
    if (storedChatBots) {
      setChatBots(JSON.parse(storedChatBots));
    }
  }, []);

  useEffect(() => {
    sessionStorage.setItem('currentTitle', currentTitle);
    sessionStorage.setItem('previousChats', JSON.stringify(previousChats));

    sessionStorage.setItem('activeChatbotId', activeChatbotId);
    sessionStorage.setItem('chatBots', JSON.stringify(chatBots));
  }, [currentTitle, previousChats, activeChatbotId, chatBots]);

  useEffect(() => {
    const filteredChats = previousChats.filter(
      chat => chat.title === currentTitle
    );
    setCurrentChat(filteredChats);
  }, [previousChats, currentTitle]);

  //the useEffect for controling the interface refresh
  useEffect(() => {
    if (location.state?.needRefresh && !hasRefreshed) {
      const timer = setTimeout(() => {
        setHasRefreshed(true);
        navigate(location.pathname, { replace: true, state: {} });
      }, 700);

      return () => clearTimeout(timer);
    }
  }, [location.state, hasRefreshed, navigate]);

  //UseEffect for current users' name and avatar
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

  //UseEffect for current users' chatbot
  useEffect(() => {
    if (auth.id) {
      axios
        .get(`/chatbots/user/${auth.id}`, {
          headers: { Authorization: `Bearer ${auth.token}` },
        })
        .then((response) => {
          setChatBots(response.data);
        });
    }
  }, [auth.id, auth.token]);

  
  //UseEffect triggered by message and/or currentTitle state changes
  useEffect(() => {
    if (!currentTitle && value && message) {
      setCurrentTitle(value);
    }
    if (currentTitle && value && message) {
      setPreviousChats((prevChats) => [
        ...prevChats,
        {
          title: currentTitle,
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

  const handleNavigateToUserInfo = () => {
    navigate("/user-info");
  };

  // Create new chat object
  const createNewChat = () => {
    navigate("/survey");
  };

  const handleClick = (chatbotId) => {
    setActiveChatbotId(chatbotId);
    // Find the chatbot by ID
    const selectedChatbot = chatBots.find((cb) => cb._id === chatbotId);
    console.log(chatBots);
    if (selectedChatbot) {
      setCurrentTitle(selectedChatbot.name);
      // sendChatbotDataToOpenAI(selectedChatbot._id);
    }
  };

  const handleEmptyHistory = () => {
    setPreviousChats([]);
    setValue("");
    setMessage(null);
    setCurrentTitle(null);
  };

  const handleDeleteChatbot = async (chatbotId) => {
    try {
      await axios.delete(`/deleteSingleChatbot/${chatbotId}`, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      setChatBots(chatBots.filter((cb) => cb._id !== chatbotId));
      toast.success("Chatbot deleted successfully");
    } catch (error) {
      toast.error("Failed to delete chatbot");
    }
  };

  // Simple async function that fetches the messages from the API
  const getMessages = async () => {
    setLoading(true);
    try {
      // change this url for one in the .env file
      const response = await axios.post(
        COMPLETIONS,
        JSON.stringify({
          message: value,
          chatbotId: activeChatbotId,
        }),
        {
          headers: {
            Authorization: `Bearer ${auth?.token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response.data.choices[0].message);

      if (response?.data?.choices && response.data.choices.length > 0) {
        setMessage(response.data.choices[0].message);
      } else {
        console.error("Invalid response from API:", response.data);
        setMessage("An error occurred while fetching the message.");
        toast.error("An error occurred while fetching the message.");
      }
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
		filters the previous chats by the current title and stores
		the current chat if it matches the current title
	*/
  

  // creates an array of unique titles from the previous chats
  const uniqueTitles = Array.from(
    new Set(previousChats.map((previousChat) => previousChat.title))
  );

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
            + New Chat Object
          </Button>

          {chatBots.length > 0 &&
            chatBots.map((chatbot) => (
              <div
                key={chatbot._id}
                className={`${styles.chatbot_entry} ${
                  activeChatbotId === chatbot._id ? styles.active : ""
                }`}
                onClick={() => handleClick(chatbot._id)}
              >
                <img
                  src={chatbot.avatar}
                  alt={chatbot.name}
                  className={styles.chatbot_avatar}
                />
                <div className={styles.chatbot_info}>
                  <span>{chatbot.name}</span>
                  <TrashSimple
                    size={20}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteChatbot(chatbot._id);
                    }}
                    className={styles.delete_icon}
                  />
                </div>
              </div>
            ))}
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
      {chatBots.length === 0 || !activeChatbotId ? (
        <section className={styles.main}>
          <div className={styles.no_chatbot_message}>
            {chatBots.length === 0
              ? "The current user does not have any chat objects yet, please click New Chat Object to create a chat object."
              : "Please select a chatbot to start chatting!"}
          </div>
        </section>
      ) : (
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
                  {chatMessage.role ? (
                    chatMessage.role === "user" ? (
                      <img src={avatar} />
                    ) : (
                      <img
                        src={
                          chatBots.find((cb) => cb.name === currentTitle)
                            ?.avatar
                        }
                        alt="Virtual Lover Avatar"
                        className={styles.chatbot_avatar}
                      />
                    )
                  ) : (
                    <img src={imageURL} alt="Virtual Lover Avatar" />
                  )}
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
        </section>
      )}
      {/* MAIN */}
    </div>
  );
};

export default Homepage;

