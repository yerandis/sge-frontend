import styles from './Spinner.module.css';

interface SpinnerProps {
  message?: string;
  size?: 'sm' | 'md';
}

export default function Spinner({ message = 'Cargando...', size = 'md' }: SpinnerProps) {
  if (size === 'sm') {
    return <span className={`${styles.spinner} ${styles.spinnerSm}`} />;
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.spinner} />
      <span>{message}</span>
    </div>
  );
}