// import { Link } from 'react-router-dom';
// import type { BreadcrumbItem } from '../../../hooks/useBreadcrumb';
// import styles from './Breadcrumb.module.css';

// interface BreadcrumbProps {
//   items: BreadcrumbItem[];
// }

// export default function Breadcrumb({ items }: BreadcrumbProps) {
//   if (items.length <= 1) return null;

//   return (
//     <nav className={styles.nav} aria-label="Breadcrumb">
//       <ol className={styles.list}>
//         {items.map((item, index) => {
//           const isLast = index === items.length - 1;
//           return (
//             <li key={index} className={styles.item}>
//               {!isLast && item.path
//                 ? <Link to={item.path} className={styles.link}>{item.label}</Link>
//                 : <span className={isLast ? styles.current : styles.link}>{item.label}</span>
//               }
//               {!isLast && <span className={styles.separator}>›</span>}
//             </li>
//           );
//         })}
//       </ol>
//     </nav>
//   );
// }