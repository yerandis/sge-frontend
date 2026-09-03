import { useMemo } from "react";
import styles from './PasswordStrengthBar.module.css';

interface PasswordStrengthBarProps {
    password: string;
}

interface StrengthResult {
  score: number;        // 0-4
  label: string;
  color: string;
  criteria: { label: string; met: boolean }[];
}

/**
 * useMemo aquí es correcto:
 * - El cálculo de fuerza depende solo de 'password'
 * - Se ejecuta en cada render de todas formas (componente pequeño)
 * - useMemo evita recalcular si el padre re-renderiza por otra razón
 */
function usePasswordStrength(password: string): StrengthResult {
  return useMemo(() => {
    const criteria = [
      { label: 'Mínimo 8 caracteres',           met: password.length >= 8 },
      { label: 'Contiene mayúsculas',           met: /[A-Z]/.test(password) },
      { label: 'Contiene números',              met: /[0-9]/.test(password) },
      { label: 'Contiene caracteres especiales',met: /[!@#$%^&*(),.?":{}|<>]/.test(password) },
    ];

    const score = criteria.filter(c => c.met).length;

    const levels = [
      { label: 'Muy débil', color: '#dc2626' },
      { label: 'Débil',     color: '#f97316' },
      { label: 'Media',     color: '#eab308' },
      { label: 'Fuerte',    color: '#22c55e' },
      { label: 'Muy fuerte',color: '#16a34a' },
    ];

    return { score, ...levels[score], criteria };
  }, [password]);
}

export default function PasswordStrengthBar({ password }: PasswordStrengthBarProps) {
  const strength = usePasswordStrength(password);

  if (!password) return null;

  return (
    <div className={styles.wrapper}>
      {/* Barra de progreso: 4 segmentos */}
      <div className={styles.bar}>
        {[1, 2, 3, 4].map(level => (
          <div
            key={level}
            className={styles.segment}
            style={{
              backgroundColor: level <= strength.score ? strength.color : '#e5e7eb',
              transition: 'background-color 0.3s ease',
            }}
          />
        ))}
      </div>

      {/* Nivel en texto */}
      <span className={styles.label} style={{ color: strength.color }}>
        {strength.label}
      </span>

      {/* Criterios */}
      <ul className={styles.criteria}>
        {strength.criteria.map(c => (
          <li key={c.label} className={c.met ? styles.met : styles.unmet}>
            <span className={styles.icon}>{c.met ? '✓' : '✗'}</span>
            {c.label}
          </li>
        ))}
      </ul>
    </div>
  );
}