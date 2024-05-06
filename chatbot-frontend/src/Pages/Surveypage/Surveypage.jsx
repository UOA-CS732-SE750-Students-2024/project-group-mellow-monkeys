import styles from "./Surveypage.module.css";
import { useAuth } from "../../hooks/useAuth";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import Spinner from "react-bootstrap/Spinner";
import "bootstrap/dist/css/bootstrap.min.css";
import { saveAs } from "file-saver";

axios.defaults.baseURL = "http://localhost:8001";

function SurveyPage() {
  const navigate = useNavigate();
  const { auth } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    hobbies: "",
    personality: "",
    age: "",
    descriptions: "",
    user: auth.id,
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  function createImageUrl(imagePath) {
    const baseUrl = "http://localhost:8001";
    const filename = imagePath.split("/").pop();
    const fullUrl = `${baseUrl}/${filename}`;
    return fullUrl;
  }
  const handleCancel = () => {
    navigate("/");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (
      !formData.name ||
      !formData.age ||
      !formData.gender ||
      !formData.hobbies ||
      !formData.personality
    ) {
      setError("All fields except descriptions need to be filled.");
      return; // Prevent the form submission
    }
    setLoading(true);
    try {
      const { user, ...dataForAvatar } = formData; // Destructure to remove user and prepare data for avatar
      const avatarDescription = JSON.stringify({
        description:
          "Please create a character avatar based on the following attributes:",
        attributes: dataForAvatar,
      });
      console.log(avatarDescription);

      const imageURL = await generateAvatar(avatarDescription);
      console.log(`image url ${imageURL}`);
      const finalPath = createImageUrl(imageURL);
      console.log(`final path ${finalPath}`);

      const updatedFormData = { ...formData, avatar: finalPath };
      const response = await axios.post("/createChatbot", updatedFormData, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
      if (response.status === 201) {
        console.log("Submission successful", response.data);
        // navigate("/");
        navigate("/", { state: { needRefresh: true } });
      }
    } catch (error) {
      console.error("Failed to submit form", error.response || error);
    }
    setLoading(false);
  };

  const generateAvatar = async (description) => {
    try {
      const response = await axios.post("/generate-avatar", { description });
      if (response.status === 200) {
        return response.data.imagePath;
      } else {
        throw new Error("Failed to generate avatar");
      }
    } catch (error) {
      console.error("Error generating avatar:", error);
      return "avatar2.jpeg";
    }
  };

  return (
    <div className={styles.survey_form_container}>
      <h1 className={styles.survey_title}>
        Let's create your first chatbot! Answer the following questions:
      </h1>
      <form className={styles.survey_form} onSubmit={handleSubmit}>
        {loading && (
          <div
            className="loading-indicator"
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 1050,
            }}
          >
            <Spinner animation="border" role="status" variant="primary">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
        </div>
        )}{" "}
        <label className={styles.survey_label}>
          Name:
          <input
            className={styles.survey_input}
            type="text"
            name="name"
            data-testid="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </label>
        <label className={styles.survey_label}>
          Age:
          <input
            className={styles.survey_input}
            type="text"
            name="age"
            data-testid="age"
            value={formData.age}
            onChange={handleChange}
            required
          />
        </label>
        <label className={styles.survey_label}>
          Gender:
          <input
            className={styles.survey_input}
            type="text"
            name="gender"
            data-testid="gender"
            value={formData.gender}
            onChange={handleChange}
            required
          />
        </label>
        <label className={styles.survey_label}>
          Hobbies:
          <input
            className={styles.survey_input}
            type="text"
            name="hobbies"
            data-testid="hobbies"
            value={formData.hobbies}
            onChange={handleChange}
            required
          />
        </label>
        <label className={styles.survey_label}>
          Personality:
          <input
            className={styles.survey_input}
            type="text"
            name="personality"
            data-testid="personality"
            value={formData.personality}
            onChange={handleChange}
            required
          />
        </label>
        <label className={styles.survey_label}>
          Appearance Descriptions:
          <textarea
            className={styles.survey_input}
            name="descriptions"
            data-testid="descriptions"
            value={formData.descriptions}
            onChange={handleChange}
          />
        </label>
        {error && <p className={styles.error_message} data-testid="error">{error}</p>}
        <button
          className={styles.survey_button}
          type="submit"
          data-testid="submit"
        >
          Submit
        </button>
        <button
          className={styles.survey_button}
          type="button"
          onClick={handleCancel}
          style={{ backgroundColor: "#f44336", marginTop: "10px" }}
        >
          Cancel
        </button>
      </form>
    </div>
  );
}

export default SurveyPage;
