import React from "react";
import styles from "./Surveypage.module.css";
import { useAuth } from "../../hooks/useAuth";

function SurveyPage() {
  console.log("successful login survey page");
  const { submitSurvey } = useAuth();
  return (
    <div className={styles.container}>
      <h1>Survey Page</h1>
      <p>
        Welcome to the Survey Page. Please fill out the following information:
      </p>

      {/* Submit button*/}
      <button className={styles.button} onClick={submitSurvey}>
        Submit
      </button>
    </div>
  );
}

export default SurveyPage;
