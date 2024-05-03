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

  // const handleSubmit = async (event) => {
  //   event.preventDefault();
  //   try {
  //     await axios.post("http://localhost:8001/createChatbot", formData);
  //     navigate("/");
  //   } catch (error) {
  //     if (error.response) {
  //       // The request was made and the server responded with a status code
  //       // that falls out of the range of 2xx
  //       console.error("Error Response:", error.response);
  //       console.log("Status:", error.response.status);
  //       console.log("Data:", error.response.data);
  //       console.log("Headers:", error.response.headers);
  //     } else if (error.request) {
  //       // The request was made but no response was received
  //       console.error("Error Request:", error.request);
  //     } else {
  //       // Something happened in setting up the request that triggered an Error
  //       console.error("Error Message:", error.message);
  //     }
  //     console.error("Error Config:", error.config);
  //   }
  // };
  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("Attempting to submit form", formData);

    try {
      const response = await axios.post("/createChatbot", formData, {
        headers: {
          Authorization: `Bearer ${auth.token}`, // Assuming auth.token is your token
        },
      });
      console.log("Submission successful", response.data);
      navigate("/"); // Navigate after successful post
    } catch (error) {
      console.error("Failed to submit form", error.response || error);
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
          Descriptions:
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
