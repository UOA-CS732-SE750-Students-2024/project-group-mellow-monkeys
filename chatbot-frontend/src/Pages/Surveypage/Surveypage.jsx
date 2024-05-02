import styles from "./Surveypage.module.css";
import { useAuth } from "../../hooks/useAuth";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';


axios.defaults.baseURL = "http://localhost:8001";
function SurveyForm({ onSubmit }) {
  const navigate = useNavigate(); // 导入 useNavigate 并创建 navigate 变量
  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    hobbies: '',
    personality: '',
    nickname: ''
  });

const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }; 

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
        await axios.post('http://localhost:8001/survey', formData);
        navigate('/');  // Redirect to the Homepage after successful submission
    } catch (error) {
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.error('Error Response:', error.response);
            console.log('Status:', error.response.status);
            console.log('Data:', error.response.data);
            console.log('Headers:', error.response.headers);
        } else if (error.request) {
            // The request was made but no response was received
            console.error('Error Request:', error.request);
        } else {
            // Something happened in setting up the request that triggered an Error
            console.error('Error Message:', error.message);
        }
        console.error('Error Config:', error.config);
    }
};

/*   const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(formData);
    navigate('/Homepage'); // 使用 navigate 函数进行页面导航
  };
 */
  return (
    <div className={styles.survey_form_container}>
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
          Nickname for you:
          <input
            className={styles.survey_input}
            type="text"
            name="nickname"
            value={formData.nickname}
            onChange={handleChange}
          />
        </label>
        <button className={styles.survey_button} type="submit">
          Submit
        </button>
      </form>
    </div>
  );
}

export default SurveyForm;
