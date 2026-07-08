import styles from './Pagination.module.css';

interface PaginationProps {
  currentPage: number;      // 0-based (como lo devuelve Spring)
  totalPages: number;
  totalElements: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

/**
 * Componente de paginación.
 *
 * Recibe el estado de paginación del padre y llama a onPageChange
 * cuando el usuario hace clic en un botón.
 *
 * Nota sobre índices: Spring Boot usa paginación base-0 (primera página = 0).
 * Para mostrar al usuario usamos base-1 (primera página = 1).
 * La conversión es: displayPage = currentPage + 1
 */
export default function Pagination({
  currentPage,
  totalPages,
  totalElements,
  pageSize,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null; // no mostrar si solo hay 1 página

  // Rango de registros mostrados (para "Mostrando X-Y de Z")
  const start = currentPage * pageSize + 1;
  const end = Math.min((currentPage + 1) * pageSize, totalElements);

  /**
   * Genera los números de página a mostrar.
   * Muestra máximo 5 botones: ... [3] [4] [5] ...
   * Siempre muestra la primera, la última, la actual y sus vecinas.
   */
  function getPageNumbers(): (number | '...')[] {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i);
    }

    const pages: (number | '...')[] = [0];

    if (currentPage > 2) pages.push('...');

    const start = Math.max(1, currentPage - 1);
    const end = Math.min(totalPages - 2, currentPage + 1);
    for (let i = start; i <= end; i++) pages.push(i);

    if (currentPage < totalPages - 3) pages.push('...');

    pages.push(totalPages - 1);
    return pages;
  }

  return (
    <div className={styles.wrapper}>
      {/* Info: "Mostrando 1-10 de 47 resultados" */}
      <p className={styles.info}>
        Mostrando{' '}
        <span className={styles.infoStrong}>{start}–{end}</span>{' '}
        de{' '}
        <span className={styles.infoStrong}>{totalElements}</span>{' '}
        resultados
      </p>

      {/* Botones de navegación */}
      <div className={styles.controls}>
        {/* Anterior */}
        <button
          className={`${styles.btn} ${styles.btnNav}`}
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 0}
          aria-label="Página anterior"
        >
          <svg className={styles.btnIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Ant.
        </button>

        {/* Números de página */}
        {getPageNumbers().map((page, index) =>
          page === '...' ? (
            <span key={`ellipsis-${index}`} className={styles.btn} style={{ border: 'none', cursor: 'default' }}>
              …
            </span>
          ) : (
            <button
              key={page}
              className={`${styles.btn} ${page === currentPage ? styles.btnActive : ''}`}
              onClick={() => onPageChange(page as number)}
            >
              {(page as number) + 1}
            </button>
          )
        )}

        {/* Siguiente */}
        <button
          className={`${styles.btn} ${styles.btnNav}`}
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages - 1}
          aria-label="Página siguiente"
        >
          Sig.
          <svg className={styles.btnIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}