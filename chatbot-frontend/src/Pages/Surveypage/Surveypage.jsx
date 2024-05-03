import styles from "./Surveypage.module.css";
import { useAuth } from "../../hooks/useAuth";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";

axios.defaults.baseURL = "http://localhost:8001";

function SurveyPage() {
  const navigate = useNavigate();
  const { auth } = useAuth();
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
  };

  const handleCancel = () => {
    navigate("/");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("Attempting to submit form", formData);

    try {
      const { descriptions } = formData;
      const imageURL = await generateAvatar(descriptions);
      const updatedFormData = { ...formData, avatar: imageURL };
      console.log(imageURL);
      const response = await axios.post("/createChatbot", updatedFormData, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
      if (response.status === 200) {
        alert("Survey submitted successfully");
        console.log("Submission successful", response.data);
        navigate("/");
      }
    } catch (error) {
      console.error("Failed to submit form", error.response || error);
    }
  };

  const generateAvatar = async (describe) => {
    try {
      const response = await axios.post("/generate-avatar", {
        describe,
      });
      console.log(1111111);
      return response.data.imageURL;
    } catch (error) {
      console.error("Error generating avatar:", error);
    }
  };

  return (
    <div className={styles.survey_form_container}>
      <h1 className={styles.survey_title}>
        Let's create your first chatbot! Answer the following questions:
      </h1>
      <form className={styles.survey_form} onSubmit={handleSubmit}>
        <label className={styles.survey_label}>
          Name:
          <input
            className={styles.survey_input}
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </label>
        <label className={styles.survey_label}>
          Age:
          <input
            className={styles.survey_input}
            type="text"
            name="age"
            value={formData.age}
            onChange={handleChange}
          />
        </label>
        <label className={styles.survey_label}>
          Gender:
          <input
            className={styles.survey_input}
            type="text"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
          />
        </label>
        <label className={styles.survey_label}>
          Hobbies:
          <input
            className={styles.survey_input}
            type="text"
            name="hobbies"
            value={formData.hobbies}
            onChange={handleChange}
          />
        </label>
        <label className={styles.survey_label}>
          Personality:
          <input
            className={styles.survey_input}
            type="text"
            name="personality"
            value={formData.personality}
            onChange={handleChange}
          />
        </label>
        <label className={styles.survey_label}>
          Appearance Descriptions:
          <textarea
            className={styles.survey_input}
            name="descriptions"
            value={formData.descriptions}
            onChange={handleChange}
          />
        </label>
        <button
          className={styles.survey_button}
          type="submit"
          // onClick={handleSubmit}
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
