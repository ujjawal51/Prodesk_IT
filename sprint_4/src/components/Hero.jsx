import styles from './Hero.module.css';

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.inner}>
        <div className={styles.tag}>✨ AI-Powered Cover Letters</div>
        <h2 className={styles.title}>
          Land Your Dream Job
          <br />
          <span className={styles.gradient}>with AI Precision</span>
        </h2>
        <p className={styles.sub}>
          Fill in your details, let Gemini AI craft a personalized, professional
          cover letter — in seconds.
        </p>
      </div>
    </section>
  );
}
