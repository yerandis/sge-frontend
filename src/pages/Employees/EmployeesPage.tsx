import { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getEmployees, deleteEmployee } from '../../services/employeeService';
import * as departmentService from '../../services/departmentService';
import { getDepartments } from '../../services/departmentService';
import type { Employee, EmployeeFilters, Department } from '../../types/employee.types';
import Badge from '../../components/ui/Badge/Badge';
import Spinner from '../../components/ui/Spinner/Spinner';
import EmptyState from '../../components/ui/EmptyState/EmptyState';
import ConfirmModal from '../../components/ui/ConfirmModal/ConfirmModal';
import Pagination from '../../components/ui/Pagination/Pagination';
import { formatCurrency, getInitials, formatDate } from '../../utils/formatters';
import styles from './EmployeesPage.module.css';

// ─── Valores iniciales de los filtros ────────────────────────────
const DEFAULT_FILTERS: EmployeeFilters = {
  search: '',
  status: '',
  departmentId: '',
  page: 0,
  size: 10,
  sortBy: 'lastName',
  sortDir: 'asc',
};

export default function EmployeesPage() {
  const navigate = useNavigate();

  // ── Estado principal ──────────────────────────────────────────
  const [employees,     setEmployees]   = useState<Employee[]>([]);
  const [departments,   setDepartments] = useState<Department[]>([]);
  const [isLoading,     setIsLoading]   = useState(true);
  const [error,         setError]       = useState<string | null>(null);

  // ── Paginación ────────────────────────────────────────────────
  const [totalPages,    setTotalPages]      = useState(0);
  const [totalElements, setTotalElements]   = useState(0);

  // ── Filtros (lo que el usuario ha escrito/seleccionado) ───────
  const [filters, setFilters] = useState<EmployeeFilters>(DEFAULT_FILTERS);

  // ── Búsqueda con debounce ─────────────────────────────────────
  // 'searchInput': lo que el usuario está escribiendo AHORA
  // 'filters.search': lo que se envía a la API (con delay de 400ms)
  const [searchInput, setSearchInput] = useState('');

  // ── Modal de confirmación de eliminación ──────────────────────
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    employee: Employee | null;
    isLoading: boolean;
  }>({
    isOpen: false,
    employee: null,
    isLoading: false,
  });

  // ─────────────────────────────────────────────────────────────
  // EFECTO: cargar departamentos UNA SOLA VEZ al montar
  // ─────────────────────────────────────────────────────────────
 useEffect(() => {
  getDepartments().then(setDepartments).catch(console.error);
}, []);

  // ─────────────────────────────────────────────────────────────
  // EFECTO: debounce de búsqueda
  // Se ejecuta cada vez que 'searchInput' cambia.
  // Espera 400ms antes de actualizar el filtro real.
  // Si el usuario sigue escribiendo, el timer se reinicia.
  // ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters(prev => ({
        ...prev,
        search: searchInput,
        page: 0,  // al buscar, volvemos a la primera página
      }));
    }, 400);

    /**
     * Función de cleanup: se ejecuta antes del próximo efecto.
     * Cancela el timer anterior antes de iniciar uno nuevo.
     * Sin esto, cada tecla lanzaría una petición a la API.
     */
    return () => clearTimeout(timer);
  }, [searchInput]);

  // ─────────────────────────────────────────────────────────────
  // EFECTO: cargar empleados cuando cambian los filtros
  // Depende de 'filters': se ejecuta cada vez que filters cambia.
  // ─────────────────────────────────────────────────────────────
  useEffect(() => {
    fetchEmployees();
  }, [filters]);

  // ─────────────────────────────────────────────────────────────
  // FUNCIONES
  // ─────────────────────────────────────────────────────────────

  async function fetchEmployees() {
    try {
      setIsLoading(true);
      setError(null);
      const page = await getEmployees(filters);
      setEmployees(page.content);
      setTotalPages(page.totalPages);
      setTotalElements(page.totalElements);
    } catch (err) {
      setError('Error al cargar los empleados. Verifica tu conexión.');
      console.error('Error al cargar los empleados: ', err);
    } finally {
      setIsLoading(false);
    }
  }

  /** Cambia el campo de ordenamiento. Si ya era ese campo, invierte la dirección. */
  function handleSort(field: string) {
    setFilters(prev => ({
      ...prev,
      sortBy: field,
      sortDir: prev.sortBy === field && prev.sortDir === 'asc' ? 'desc' : 'asc',
      page: 0,
    }));
  }

  function handleStatusFilter(e: React.ChangeEvent<HTMLSelectElement>) {
    setFilters(prev => ({ ...prev, status: e.target.value as any, page: 0 }));
  }

  function handleDepartmentFilter(e: React.ChangeEvent<HTMLSelectElement>) {
    const val = e.target.value;
    setFilters(prev => ({
      ...prev,
      departmentId: val === '' ? '' : Number(val),
      page: 0,
    }));
  }

  function handlePageChange(newPage: number) {
    setFilters(prev => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleClearFilters() {
    setSearchInput('');
    setFilters(DEFAULT_FILTERS);
  }

  const hasActiveFilters =
    searchInput !== '' || filters.status !== '' || filters.departmentId !== '';

  // ── Eliminar ──────────────────────────────────────────────────
  function openDeleteModal(employee: Employee) {
    setDeleteModal({ isOpen: true, employee, isLoading: false });
  }

  function closeDeleteModal() {
    setDeleteModal({ isOpen: false, employee: null, isLoading: false });
  }

  async function handleConfirmDelete() {
    if (!deleteModal.employee) return;

    setDeleteModal(prev => ({ ...prev, isLoading: true }));
    try {
      await deleteEmployee(deleteModal.employee.id);
      closeDeleteModal();
      // Recargamos: si era el único de la página y no era la primera, retrocedemos
      const newPage = employees.length === 1 && filters.page > 0
        ? filters.page - 1
        : filters.page;
      setFilters(prev => ({ ...prev, page: newPage }));
    } catch (err) {
      setDeleteModal(prev => ({ ...prev, isLoading: false }));
      alert('Error al eliminar el empleado. Inténtalo de nuevo.');
    }
  }

  // ─────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────

  return (
    <div className={styles.page}>

      {/* ── CABECERA ────────────────────────────────────────── */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Empleados</h1>
          <p className={styles.pageSubtitle}>
            {isLoading
              ? 'Cargando...'
              : `${totalElements} empleado${totalElements !== 1 ? 's' : ''} registrado${totalElements !== 1 ? 's' : ''}`
            }
          </p>
        </div>
        <Link to="/employees/new" className={styles.btnPrimary}>
          <svg className={styles.btnPrimaryIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Nuevo Empleado
        </Link>
      </div>

      {/* ── FILTROS ─────────────────────────────────────────── */}
      <div className={styles.filterPanel}>
        {/* Búsqueda */}
        <div className={styles.searchWrapper}>
          <svg className={styles.searchIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Buscar por nombre o email..."
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
          />
        </div>

        {/* Filtro de estado */}
        <select
          className={styles.filterSelect}
          value={filters.status}
          onChange={handleStatusFilter}
        >
          <option value="">Todos los estados</option>
          <option value="ACTIVE">Activos</option>
          <option value="INACTIVE">Inactivos</option>
        </select>

        {/* Filtro de departamento */}
        <select
          className={styles.filterSelect}
          value={filters.departmentId}
          onChange={handleDepartmentFilter}
        >
          <option value="">Todos los departamentos</option>
          {departments.map(d => (
            <option key={d.id} value={d.id}>{d.name}</option>
          ))}
        </select>

        {/* Limpiar filtros */}
        {hasActiveFilters && (
          <button className={styles.clearBtn} onClick={handleClearFilters}>
            Limpiar filtros
          </button>
        )}
      </div>

      {/* ── TABLA ───────────────────────────────────────────── */}
      <div className={styles.tableCard}>

        {/* Estado de carga */}
        {isLoading && <Spinner message="Cargando empleados..." />}

        {/* Error */}
        {!isLoading && error && (
          <EmptyState
            title="Error al cargar"
            description={error}
            action={
              <button className={styles.btnPrimary} onClick={fetchEmployees}>
                Reintentar
              </button>
            }
          />
        )}

        {/* Tabla con datos */}
        {!isLoading && !error && employees.length > 0 && (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <SortableHeader
                    label="Empleado"
                    field="lastName"
                    currentSort={filters.sortBy}
                    direction={filters.sortDir}
                    onSort={handleSort}
                    styles={styles}
                  />
                  <SortableHeader
                    label="Cargo"
                    field="position"
                    currentSort={filters.sortBy}
                    direction={filters.sortDir}
                    onSort={handleSort}
                    styles={styles}
                  />
                  <SortableHeader
                    label="Departamento"
                    field="department.name"
                    currentSort={filters.sortBy}
                    direction={filters.sortDir}
                    onSort={handleSort}
                    styles={styles}
                  />
                  <SortableHeader
                    label="Salario"
                    field="salary"
                    currentSort={filters.sortBy}
                    direction={filters.sortDir}
                    onSort={handleSort}
                    styles={styles}
                  />
                  <SortableHeader
                    label="Contratación"
                    field="hireDate"
                    currentSort={filters.sortBy}
                    direction={filters.sortDir}
                    onSort={handleSort}
                    styles={styles}
                  />
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {employees.map(employee => (
                  <tr key={employee.id}>

                    {/* Empleado: avatar + nombre + email */}
                    <td>
                      <div className={styles.employeeCell}>
                        <div className={styles.avatar}>
                          {getInitials(employee.firstName, employee.lastName)}
                        </div>
                        <div>
                          <div className={styles.employeeName}>
                            {employee.firstName} {employee.lastName}
                          </div>
                          <div className={styles.employeeEmail}>{employee.email}</div>
                        </div>
                      </div>
                    </td>

                    <td><span className={styles.positionText}>{employee.position}</span></td>
                    <td>{employee.department.name}</td>
                    <td><span className={styles.salaryText}>{formatCurrency(employee.salary)}</span></td>
                    <td>{formatDate(employee.hireDate)}</td>
                    <td><Badge status={employee.status} /></td>

                    {/* Acciones */}
                    <td>
                      <div className={styles.actions}>
                        {/* Ver detalle */}
                        <button
                          className={`${styles.actionBtn} ${styles.actionBtnView}`}
                          onClick={() => navigate(`/employees/${employee.id}`)}
                          title="Ver detalle"
                        >
                          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </button>

                        {/* Editar */}
                        <button
                          className={`${styles.actionBtn} ${styles.actionBtnEdit}`}
                          onClick={() => navigate(`/employees/${employee.id}/edit`)}
                          title="Editar"
                        >
                          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round"
                              d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
                          </svg>
                        </button>

                        {/* Eliminar */}
                        <button
                          className={`${styles.actionBtn} ${styles.actionBtnDelete}`}
                          onClick={() => openDeleteModal(employee)}
                          title="Eliminar"
                        >
                          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round"
                              d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                          </svg>
                        </button>
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Estado vacío */}
        {!isLoading && !error && employees.length === 0 && (
          <EmptyState
            title={hasActiveFilters ? 'Sin resultados' : 'No hay empleados'}
            description={
              hasActiveFilters
                ? 'Ningún empleado coincide con los filtros aplicados. Prueba con otros criterios.'
                : 'Aún no hay empleados registrados. ¡Empieza añadiendo el primero!'
            }
            action={
              hasActiveFilters ? (
                <button className={styles.clearBtn} onClick={handleClearFilters}>
                  Limpiar filtros
                </button>
              ) : (
                <Link to="/employees/new" className={styles.btnPrimary}>
                  Agregar primer empleado
                </Link>
              )
            }
          />
        )}

        {/* Paginación */}
        {!isLoading && !error && totalPages > 1 && (
          <Pagination
            currentPage={filters.page}
            totalPages={totalPages}
            totalElements={totalElements}
            pageSize={filters.size}
            onPageChange={handlePageChange}
          />
        )}
      </div>

      {/* ── MODAL DE CONFIRMACIÓN DE ELIMINACIÓN ──────────── */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        title="Eliminar empleado"
        message={
          deleteModal.employee
            ? `¿Estás seguro de que deseas eliminar a ${deleteModal.employee.firstName} ${deleteModal.employee.lastName}? Esta acción no se puede deshacer.`
            : ''
        }
        confirmLabel="Sí, eliminar"
        isLoading={deleteModal.isLoading}
        onConfirm={handleConfirmDelete}
        onCancel={closeDeleteModal}
      />

    </div>
  );
}

// ─── Componente auxiliar: cabecera de columna ordenable ───────────
interface SortableHeaderProps {
  label: string;
  field: string;
  currentSort: string;
  direction: 'asc' | 'desc';
  onSort: (field: string) => void;
  styles: Record<string, string>;
}

function SortableHeader({ label, field, currentSort, direction, onSort, styles }: SortableHeaderProps) {
  const isActive = currentSort === field;

  return (
    <th className={styles.thSortable} onClick={() => onSort(field)}>
      <div className={styles.thInner}>
        {label}
        <svg
          className={`${styles.sortIcon} ${isActive ? styles.sortIconActive : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
        >
          {isActive ? (
            direction === 'asc'
              ? <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />  /* chevron up */
              : <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /> /* chevron down */
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
          )}
        </svg>
      </div>
    </th>
  );
}